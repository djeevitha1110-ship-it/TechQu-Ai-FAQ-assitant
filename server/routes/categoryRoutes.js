const express = require('express');
const router = express.Router();
const { memoryStore } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// GET all categories
router.get('/', (req, res) => {
  // Recalculate faqCount for accuracy
  const categories = memoryStore.categories.map(cat => {
    const count = memoryStore.faqs.filter(f => f.categoryId === cat.id || f.categoryName === cat.name).length;
    return { ...cat, faqCount: count };
  });

  res.json({ categories });
});

// CREATE category (Admin / Content Creator)
router.post('/', authenticate, authorize('Admin', 'Content Creator'), (req, res) => {
  const { name, description, color } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const existing = memoryStore.categories.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'Category with this name already exists.' });
  }

  const colors = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2', '#DB2777'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newCategory = {
    id: 'cat-' + Date.now(),
    name: name.trim(),
    description: description ? description.trim() : '',
    color: color || randomColor,
    faqCount: 0,
    createdBy: req.user.name,
    createdAt: new Date()
  };

  memoryStore.categories.push(newCategory);

  // Activity log
  memoryStore.activities.unshift({
    id: 'act-' + Date.now(),
    user: req.user.name,
    action: 'Category created',
    target: newCategory.name,
    date: new Date()
  });

  res.status(201).json({ message: 'Category created successfully.', category: newCategory });
});

// UPDATE category
router.put('/:id', authenticate, authorize('Admin', 'Content Creator'), (req, res) => {
  const category = memoryStore.categories.find(c => c.id === req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  const { name, description, color } = req.body;
  if (name) category.name = name.trim();
  if (description !== undefined) category.description = description.trim();
  if (color) category.color = color;

  res.json({ message: 'Category updated successfully.', category });
});

// DELETE category
router.delete('/:id', authenticate, authorize('Admin'), (req, res) => {
  const index = memoryStore.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  const cat = memoryStore.categories[index];
  memoryStore.categories.splice(index, 1);

  res.json({ message: `Category '${cat.name}' deleted successfully.` });
});

module.exports = router;
