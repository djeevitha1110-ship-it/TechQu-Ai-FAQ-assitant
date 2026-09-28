const express = require('express');
const router = express.Router();
const { memoryStore } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

// GET all users (Admin only)
router.get('/', authenticate, authorize('Admin'), (req, res) => {
  const usersWithStats = memoryStore.users.map(u => {
    const faqCount = memoryStore.faqs.filter(f => f.authorId === u.id).length;
    const { password, ...userWithoutPass } = u;
    return { ...userWithoutPass, faqCount };
  });

  res.json({ users: usersWithStats });
});

// UPDATE user role (Admin only)
router.put('/:id/role', authenticate, authorize('Admin'), (req, res) => {
  const { role } = req.body;
  if (!['Admin', 'Content Creator', 'Authenticated User'].includes(role)) {
    return res.status(400).json({ message: 'Invalid user role specified.' });
  }

  const user = memoryStore.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.role = role;
  res.json({ message: `Role for ${user.name} updated to ${role}.`, user: { id: user.id, role: user.role } });
});

// DEACTIVATE / ACTIVATE user (Admin only)
router.put('/:id/status', authenticate, authorize('Admin'), (req, res) => {
  const { status } = req.body;
  const user = memoryStore.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (user.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot deactivate your own account.' });
  }

  user.status = status || (user.status === 'active' ? 'deactivated' : 'active');
  res.json({ message: `User status changed to ${user.status}.`, user: { id: user.id, status: user.status } });
});

// DELETE user (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }

  const idx = memoryStore.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const deletedUser = memoryStore.users.splice(idx, 1)[0];
  res.json({ message: `User ${deletedUser.name} deleted successfully.` });
});

module.exports = router;
