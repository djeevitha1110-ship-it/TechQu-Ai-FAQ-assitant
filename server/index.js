require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const authRoutes = require('./routes/authRoutes');
const faqRoutes = require('./routes/faqRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const aiRoutes = require('./routes/aiRoutes');
const unansweredRoutes = require('./routes/unansweredRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect DB (with automatic fallback to MemoryStore)
connectDB();

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'TechQu API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/unanswered', unansweredRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// Production Static File Serving
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
}

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    message: err.message || 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 TechQu API running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
