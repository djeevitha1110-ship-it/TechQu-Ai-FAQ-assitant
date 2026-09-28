const express = require('express');
const router = express.Router();
const { memoryStore } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// GET all unanswered search queries
router.get('/', authenticate, (req, res) => {
  res.json({ unanswered: memoryStore.unansweredQuestions });
});

// DISMISS / DELETE an unanswered question
router.delete('/:id', authenticate, authorize('Admin', 'Content Creator'), (req, res) => {
  const index = memoryStore.unansweredQuestions.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    memoryStore.unansweredQuestions.splice(index, 1);
  }
  res.json({ message: 'Unanswered question dismissed.' });
});

module.exports = router;
