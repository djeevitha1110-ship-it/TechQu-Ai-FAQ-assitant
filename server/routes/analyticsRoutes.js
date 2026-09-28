const express = require('express');
const router = express.Router();
const { memoryStore } = require('../db');
const { authenticate } = require('../middleware/auth');

// GET analytics dashboard metrics
router.get('/', authenticate, (req, res) => {
  const totalFaqs = memoryStore.faqs.length;
  const publishedFaqs = memoryStore.faqs.filter(f => f.status === 'Published').length;
  const totalCategories = memoryStore.categories.length;
  const totalAiGenerated = memoryStore.faqs.filter(f => f.isAiGenerated).length + (memoryStore.aiGenerations ? memoryStore.aiGenerations.length : 0);
  
  // Real search count calculated strictly from logged search activities
  const totalSearches = memoryStore.activities.filter(a => a.action === 'Search performed').length;

  // Category distribution from real FAQs in store
  const categoryDist = memoryStore.categories.map(cat => {
    const count = memoryStore.faqs.filter(f => f.categoryId === cat.id || f.categoryName === cat.name).length;
    return { name: cat.name, count, color: cat.color };
  });

  // Top searched / most viewed FAQs
  const topFaqs = [...memoryStore.faqs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(f => ({ id: f.id, question: f.question, views: f.views || 0, helpful: f.helpfulYes || 0 }));

  // Growth trend based on actual FAQ creation dates
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = now.getMonth();
  
  const growthData = Array.from({ length: 5 }).map((_, i) => {
    const mIdx = (currentMonthIdx - 4 + i + 12) % 12;
    const mName = months[mIdx];
    const count = memoryStore.faqs.filter(f => {
      const d = new Date(f.createdAt);
      return d.getMonth() <= mIdx;
    }).length;
    return { month: mName, count };
  });

  res.json({
    stats: {
      totalFaqs,
      publishedFaqs,
      totalCategories,
      totalAiGenerated,
      totalSearches,
      unansweredCount: memoryStore.unansweredQuestions.length
    },
    categoryDist,
    topFaqs,
    growthData
  });
});

// GET activity log
router.get('/activity', authenticate, (req, res) => {
  res.json({ activities: memoryStore.activities });
});

// GET knowledge health metrics
router.get('/health', authenticate, (req, res) => {
  const faqs = memoryStore.faqs;
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  // Detect potential duplicates
  let duplicatesCount = 0;
  for (let i = 0; i < faqs.length; i++) {
    for (let j = i + 1; j < faqs.length; j++) {
      const q1 = faqs[i].question.toLowerCase().replace(/[^\w\s]/g, '');
      const q2 = faqs[j].question.toLowerCase().replace(/[^\w\s]/g, '');
      const words1 = new Set(q1.split(/\s+/));
      const words2 = new Set(q2.split(/\s+/));
      let common = 0;
      for (const w of words1) if (words2.has(w)) common++;
      if (common / Math.max(words1.size, words2.size) > 0.6) {
        duplicatesCount++;
      }
    }
  }

  const outdated = faqs.filter(f => (now - new Date(f.updatedAt || f.createdAt).getTime()) > thirtyDays);
  const shortAnswers = faqs.filter(f => (f.answer || '').length < 40);
  const missingCategories = faqs.filter(f => !f.categoryName || f.categoryName === 'General');
  const unansweredCount = memoryStore.unansweredQuestions.length;

  let totalDeduction = (duplicatesCount * 5) + (outdated.length * 4) + (shortAnswers.length * 5) + (unansweredCount * 3);
  let healthScore = Math.max(45, 100 - totalDeduction);

  res.json({
    healthScore,
    issues: {
      duplicates: duplicatesCount,
      outdated: outdated.length,
      shortAnswers: shortAnswers.length,
      missingCategories: missingCategories.length,
      unanswered: unansweredCount
    },
    recommendations: [
      duplicatesCount > 0 ? `Review and merge ${duplicatesCount} potential duplicate FAQ entries.` : null,
      outdated.length > 0 ? `Update ${outdated.length} FAQs that haven't been reviewed in the last 30 days.` : null,
      shortAnswers.length > 0 ? `Expand ${shortAnswers.length} brief answers with detailed steps or examples.` : null,
      unansweredCount > 0 ? `${unansweredCount} user search queries were unanswered. Generate FAQs for them.` : null
    ].filter(Boolean)
  });
});

module.exports = router;
