const express = require('express');
const router = express.Router();
const { memoryStore } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// Simple string similarity helper for duplicate detection & semantic search
function computeSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().replace(/[^\w\s]/g, '');
  const s2 = str2.toLowerCase().replace(/[^\w\s]/g, '');
  const words1 = new Set(s1.split(/\s+/).filter(Boolean));
  const words2 = new Set(s2.split(/\s+/).filter(Boolean));

  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) intersection++;
  }
  const union = new Set([...words1, ...words2]).size;
  return union === 0 ? 0 : (intersection / union);
}

// Duplicate detection endpoint
router.post('/duplicate-check', (req, res) => {
  const { question } = req.body;
  if (!question || question.trim().length < 5) {
    return res.json({ matches: [] });
  }

  const duplicates = memoryStore.faqs
    .map(faq => {
      const score = computeSimilarity(question, faq.question);
      return { faq, score: Math.round(score * 100) };
    })
    .filter(item => item.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  res.json({ matches: duplicates });
});

// Search FAQs endpoint
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  const category = req.query.category;

  if (!q) {
    return res.json({ query: '', results: [] });
  }

  // Log activity and record in unanswered if no match
  memoryStore.activities.unshift({
    id: 'act-' + Date.now(),
    user: 'System User',
    action: 'Search performed',
    target: q,
    date: new Date()
  });

  let faqs = memoryStore.faqs.filter(f => f.status === 'Published');
  if (category && category !== 'All') {
    faqs = faqs.filter(f => f.categoryId === category || f.categoryName === category);
  }

  const queryTerms = q.toLowerCase().split(/\s+/).filter(Boolean);

  const scoredResults = faqs.map(faq => {
    const qText = faq.question.toLowerCase();
    const aText = faq.answer.toLowerCase();
    const keywords = (faq.keywords || []).map(k => k.toLowerCase());

    let matchCount = 0;
    let titleMatch = false;

    queryTerms.forEach(term => {
      if (qText.includes(term)) {
        matchCount += 3;
        titleMatch = true;
      }
      if (aText.includes(term)) matchCount += 1;
      if (keywords.some(k => k.includes(term))) matchCount += 2;
    });

    const similarity = computeSimilarity(q, faq.question);
    const totalScore = Math.min(100, Math.round((similarity * 50) + (matchCount * 10)));

    return {
      ...faq,
      relevanceScore: totalScore,
      matchedTerms: queryTerms.filter(t => qText.includes(t) || aText.includes(t) || keywords.some(k => k.includes(t)))
    };
  })
  .filter(item => item.relevanceScore > 10)
  .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // If no results, track as unanswered query
  if (scoredResults.length === 0) {
    const existingUnanswered = memoryStore.unansweredQuestions.find(u => u.query.toLowerCase() === q.toLowerCase());
    if (existingUnanswered) {
      existingUnanswered.count += 1;
      existingUnanswered.lastSearched = new Date();
    } else {
      memoryStore.unansweredQuestions.push({
        id: 'un-' + Date.now(),
        query: q,
        count: 1,
        category: category !== 'All' ? category : 'General',
        lastSearched: new Date(),
        status: 'unanswered'
      });
    }
  }

  res.json({ query: q, total: scoredResults.length, results: scoredResults });
});

// GET all FAQs
router.get('/', (req, res) => {
  let { category, status, search, sort, favoritesOnly } = req.query;
  let results = [...memoryStore.faqs];

  if (category && category !== 'All') {
    results = results.filter(f => f.categoryId === category || f.categoryName === category);
  }

  if (status && status !== 'All') {
    results = results.filter(f => f.status === status);
  }

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(f =>
      f.question.toLowerCase().includes(term) ||
      f.answer.toLowerCase().includes(term) ||
      (f.keywords && f.keywords.some(k => k.toLowerCase().includes(term)))
    );
  }

  // Sort
  if (sort === 'oldest') {
    results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'alphabetical') {
    results.sort((a, b) => a.question.localeCompare(b.question));
  } else if (sort === 'views') {
    results.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    // default newest / recently updated
    results.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }

  res.json({ total: results.length, faqs: results });
});

// GET single FAQ detail
router.get('/:id', (req, res) => {
  const faq = memoryStore.faqs.find(f => f.id === req.params.id);
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found.' });
  }

  // Increment view count
  faq.views = (faq.views || 0) + 1;

  // Find 3 related FAQs in same category or keywords
  const related = memoryStore.faqs
    .filter(f => f.id !== faq.id && f.status === 'Published')
    .map(f => {
      let score = 0;
      if (f.categoryId === faq.categoryId) score += 3;
      if (f.keywords && faq.keywords) {
        score += f.keywords.filter(k => faq.keywords.includes(k)).length * 2;
      }
      return { ...f, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  res.json({ faq, related });
});

// CREATE FAQ (Admin & Content Creator)
router.post('/', authenticate, authorize('Admin', 'Content Creator'), (req, res) => {
  const { question, answer, categoryId, categoryName, keywords, status, isAiGenerated } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ message: 'Question is required.' });
  }

  if (!answer || !answer.trim()) {
    return res.status(400).json({ message: 'Answer is required.' });
  }

  const categoryObj = memoryStore.categories.find(c => c.id === categoryId || c.name === categoryName);
  const catName = categoryObj ? categoryObj.name : (categoryName || 'General');

  const newFaq = {
    id: 'faq-' + Date.now(),
    question: question.trim(),
    answer: answer.trim(),
    categoryId: categoryObj ? categoryObj.id : 'cat-gen',
    categoryName: catName,
    keywords: Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(k => k.trim()) : []),
    authorId: req.user.id,
    authorName: req.user.name,
    authorRole: req.user.role,
    status: status || 'Published',
    helpfulYes: 0,
    helpfulNo: 0,
    views: 0,
    isAiGenerated: !!isAiGenerated,
    versions: [
      {
        version: 1,
        answer: answer.trim(),
        updatedBy: req.user.name,
        date: new Date(),
        summary: 'Initial release'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  memoryStore.faqs.unshift(newFaq);

  // Update category FAQ count
  if (categoryObj) {
    categoryObj.faqCount = (categoryObj.faqCount || 0) + 1;
  }

  // Activity log
  memoryStore.activities.unshift({
    id: 'act-' + Date.now(),
    user: req.user.name,
    action: isAiGenerated ? 'AI FAQ generated' : 'FAQ created',
    target: newFaq.question,
    date: new Date()
  });

  res.status(201).json({ message: 'FAQ created successfully.', faq: newFaq });
});

// UPDATE FAQ
router.put('/:id', authenticate, (req, res) => {
  const faq = memoryStore.faqs.find(f => f.id === req.params.id);
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found.' });
  }

  // Authorization: Admin can edit any, Content Creator can edit own
  if (req.user.role !== 'Admin' && faq.authorId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to edit this FAQ.' });
  }

  const { question, answer, categoryId, categoryName, keywords, status, changeSummary } = req.body;

  if (question) faq.question = question.trim();
  if (answer && answer.trim() !== faq.answer) {
    // Append version history
    const nextVer = (faq.versions?.length || 0) + 1;
    faq.versions = faq.versions || [];
    faq.versions.push({
      version: nextVer,
      answer: faq.answer,
      updatedBy: req.user.name,
      date: new Date(),
      summary: changeSummary || `Version ${nextVer} update`
    });
    faq.answer = answer.trim();
  }

  if (categoryId || categoryName) {
    const categoryObj = memoryStore.categories.find(c => c.id === categoryId || c.name === categoryName);
    faq.categoryId = categoryObj ? categoryObj.id : faq.categoryId;
    faq.categoryName = categoryObj ? categoryObj.name : (categoryName || faq.categoryName);
  }

  if (keywords) {
    faq.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
  }

  if (status) faq.status = status;
  faq.updatedAt = new Date();

  // Activity log
  memoryStore.activities.unshift({
    id: 'act-' + Date.now(),
    user: req.user.name,
    action: 'FAQ updated',
    target: faq.question,
    date: new Date()
  });

  res.json({ message: 'FAQ updated successfully.', faq });
});

// DELETE FAQ
router.delete('/:id', authenticate, (req, res) => {
  const index = memoryStore.faqs.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'FAQ not found.' });
  }

  const faq = memoryStore.faqs[index];
  if (req.user.role !== 'Admin' && faq.authorId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to delete this FAQ.' });
  }

  memoryStore.faqs.splice(index, 1);

  // Decrement category count
  const cat = memoryStore.categories.find(c => c.id === faq.categoryId);
  if (cat && cat.faqCount > 0) cat.faqCount -= 1;

  // Activity log
  memoryStore.activities.unshift({
    id: 'act-' + Date.now(),
    user: req.user.name,
    action: 'FAQ deleted',
    target: faq.question,
    date: new Date()
  });

  res.json({ message: 'FAQ deleted successfully.' });
});

// Helpful Yes/No Feedback
router.post('/:id/helpful', (req, res) => {
  const { vote } = req.body; // 'yes' or 'no'
  const faq = memoryStore.faqs.find(f => f.id === req.params.id);
  if (!faq) return res.status(404).json({ message: 'FAQ not found.' });

  if (vote === 'yes') faq.helpfulYes = (faq.helpfulYes || 0) + 1;
  if (vote === 'no') faq.helpfulNo = (faq.helpfulNo || 0) + 1;

  res.json({ message: 'Feedback recorded.', helpfulYes: faq.helpfulYes, helpfulNo: faq.helpfulNo });
});

// Favorite toggle
router.post('/:id/favorite', authenticate, (req, res) => {
  const user = memoryStore.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.favorites = user.favorites || [];
  const faqId = req.params.id;
  const idx = user.favorites.indexOf(faqId);

  let isFavorite = false;
  if (idx >= 0) {
    user.favorites.splice(idx, 1);
    isFavorite = false;
  } else {
    user.favorites.push(faqId);
    isFavorite = true;
  }

  res.json({ isFavorite, favorites: user.favorites });
});

// Restore historical version
router.post('/:id/restore-version', authenticate, authorize('Admin', 'Content Creator'), (req, res) => {
  const { versionNumber } = req.body;
  const faq = memoryStore.faqs.find(f => f.id === req.params.id);
  if (!faq) return res.status(404).json({ message: 'FAQ not found.' });

  const targetVer = (faq.versions || []).find(v => v.version === versionNumber);
  if (!targetVer) {
    return res.status(400).json({ message: 'Target version not found in history.' });
  }

  // Push current answer to history
  faq.versions.push({
    version: faq.versions.length + 1,
    answer: faq.answer,
    updatedBy: req.user.name,
    date: new Date(),
    summary: `Restored version v${versionNumber}`
  });

  faq.answer = targetVer.answer;
  faq.updatedAt = new Date();

  res.json({ message: `Restored to version ${versionNumber} successfully.`, faq });
});

module.exports = router;
