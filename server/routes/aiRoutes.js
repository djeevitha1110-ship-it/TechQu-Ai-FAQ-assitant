const express = require('express');
const router = express.Router();
const { memoryStore } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');
const { generateFAQ, improveAnswer, qualityCheck } = require('../services/aiService');

// POST /api/ai/generate-faq
router.post('/generate-faq', authenticate, authorize('Admin', 'Content Creator'), async (req, res) => {
  try {
    const { topic, audience, tone, category, answerLength } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: 'Topic is required for AI generation.' });
    }

    const result = await generateFAQ({ topic, audience, tone, category, answerLength });

    // Store in AI generation history
    const historyItem = {
      id: 'gen-' + Date.now(),
      topic: topic.trim(),
      generatedQuestion: result.question,
      generatedAnswer: result.answer,
      category: result.suggestedCategory || category || 'General',
      keywords: result.keywords || [],
      createdBy: req.user.name,
      createdAt: new Date(),
      status: 'Generated'
    };

    memoryStore.aiGenerations.unshift(historyItem);

    // Log activity
    memoryStore.activities.unshift({
      id: 'act-' + Date.now(),
      user: req.user.name,
      action: 'AI FAQ generated',
      target: result.question,
      date: new Date()
    });

    res.json({ result, historyId: historyItem.id });
  } catch (err) {
    console.error('Error generating FAQ via AI:', err);
    res.status(500).json({ message: 'Failed to generate FAQ with AI.' });
  }
});

// POST /api/ai/improve-answer
router.post('/improve-answer', authenticate, authorize('Admin', 'Content Creator'), async (req, res) => {
  try {
    const { question, currentAnswer, improvementStyle } = req.body;

    if (!currentAnswer || !currentAnswer.trim()) {
      return res.status(400).json({ message: 'Current answer is required.' });
    }

    const result = await improveAnswer({
      question: question || 'General FAQ',
      currentAnswer,
      improvementStyle: improvementStyle || 'Professional'
    });

    res.json({ result });
  } catch (err) {
    console.error('Error improving answer via AI:', err);
    res.status(500).json({ message: 'Failed to improve answer with AI.' });
  }
});

// POST /api/ai/quality-check
router.post('/quality-check', authenticate, authorize('Admin', 'Content Creator'), async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Both question and answer are required for quality evaluation.' });
    }

    const result = await qualityCheck({ question, answer });
    res.json({ result });
  } catch (err) {
    console.error('Error performing quality check:', err);
    res.status(500).json({ message: 'Failed to complete FAQ quality check.' });
  }
});

// GET /api/ai/history
router.get('/history', authenticate, (req, res) => {
  res.json({ history: memoryStore.aiGenerations });
});

// DELETE /api/ai/history/:id
router.delete('/history/:id', authenticate, authorize('Admin', 'Content Creator'), (req, res) => {
  const idx = memoryStore.aiGenerations.findIndex(g => g.id === req.params.id);
  if (idx !== -1) {
    memoryStore.aiGenerations.splice(idx, 1);
  }
  res.json({ message: 'Generation history entry removed.' });
});

module.exports = router;
