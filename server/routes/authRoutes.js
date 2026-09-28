const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { memoryStore } = require('../db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'Authenticated User',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      status: 'active',
      favorites: [],
      createdAt: new Date()
    };

    memoryStore.users.push(newUser);

    // Log activity
    memoryStore.activities.unshift({
      id: 'act-' + Date.now(),
      user: newUser.name,
      action: 'Account registered',
      target: newUser.email,
      date: new Date()
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        favorites: newUser.favorites
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed due to server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({ message: 'Your account is deactivated. Contact administrator.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        favorites: user.favorites || []
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed due to server error.' });
  }
});

// Google Authentication
router.post('/google', async (req, res) => {
  try {
    const { credential, email, name, picture } = req.body;
    let userEmail = email;
    let userName = name;
    let userAvatar = picture;

    // Decode Google GIS credential JWT payload if provided
    if (credential && typeof credential === 'string') {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          userEmail = payload.email || userEmail;
          userName = payload.name || userName;
          userAvatar = payload.picture || userAvatar;
        }
      } catch (err) {
        console.log('Google credential decode warning:', err.message);
      }
    }

    if (!userEmail) {
      return res.status(400).json({ message: 'Google account email is required for sign in.' });
    }

    const normalizedEmail = userEmail.toLowerCase().trim();
    let user = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // Auto-register new Google user as Content Creator
      const formattedName = userName ? userName.trim() : normalizedEmail.split('@')[0];
      const hashedPassword = await bcrypt.hash('GoogleOAuth_' + Date.now(), 10);
      
      user = {
        id: 'usr-g-' + Date.now(),
        name: formattedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'Content Creator',
        avatar: userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
        status: 'active',
        favorites: [],
        createdAt: new Date()
      };

      memoryStore.users.push(user);

      memoryStore.activities.unshift({
        id: 'act-' + Date.now(),
        user: user.name,
        action: 'Registered via Google',
        target: user.email,
        date: new Date()
      });
    } else {
      if (user.status === 'deactivated') {
        return res.status(403).json({ message: 'Your account has been deactivated. Contact administrator.' });
      }

      if (userAvatar) user.avatar = userAvatar;

      memoryStore.activities.unshift({
        id: 'act-' + Date.now(),
        user: user.name,
        action: 'Signed in via Google',
        target: user.email,
        date: new Date()
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        favorites: user.favorites || []
      }
    });
  } catch (error) {
    console.error('Google Auth Route Error:', error);
    res.status(500).json({ message: 'Google authentication failed.' });
  }
});

// Get Current Logged In User
router.get('/me', authenticate, (req, res) => {
  const user = memoryStore.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(444).json({ message: 'User not found.' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      favorites: user.favorites || []
    }
  });
});

// Update Profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = memoryStore.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar;

    res.json({ message: 'Profile updated successfully.', user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, favorites: user.favorites } });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed.' });
  }
});

// Change Password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = memoryStore.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password.' });
  }
});

module.exports = router;
