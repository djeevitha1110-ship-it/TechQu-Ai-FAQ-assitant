const mongoose = require('mongoose');

// Hybrid Data Store supporting MongoDB Mongoose + In-Memory Fallback
class MemoryStore {
  constructor() {
    this.users = [];
    this.faqs = [];
    this.categories = [];
    this.aiGenerations = [];
    this.unansweredQuestions = [];
    this.activities = [];
    this.seedInitialData();
  }

  seedInitialData() {
    // Seed default categories
    this.categories = [
      { id: 'cat-1', name: 'Authentication', description: 'Login, registration, SSO and session management FAQs.', color: '#2563EB', faqCount: 4, createdBy: 'Admin', createdAt: new Date() },
      { id: 'cat-2', name: 'Configuration', description: 'System setup, environment vars, and settings.', color: '#059669', faqCount: 3, createdBy: 'Admin', createdAt: new Date() },
      { id: 'cat-3', name: 'Billing & Subscriptions', description: 'Plans, payment gateways, invoices, and refunds.', color: '#D97706', faqCount: 2, createdBy: 'Admin', createdAt: new Date() },
      { id: 'cat-4', name: 'Security & Privacy', description: 'Data protection, GDPR, encryption, and API keys.', color: '#DC2626', faqCount: 3, createdBy: 'Admin', createdAt: new Date() },
      { id: 'cat-5', name: 'Technical Support', description: 'Troubleshooting, errors, rate limits, and status.', color: '#7C3AED', faqCount: 3, createdBy: 'Admin', createdAt: new Date() }
    ];

    // Seed default admin user (Password: Admin@123)
    const bcrypt = require('bcryptjs');
    const adminHash = bcrypt.hashSync('Admin@123', 10);
    const creatorHash = bcrypt.hashSync('Creator@123', 10);

    this.users = [
      { id: 'usr-admin', name: 'Alex Rivera', email: 'admin@faq.ai', password: adminHash, role: 'Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'active', favorites: ['faq-1', 'faq-3'], createdAt: new Date() },
      { id: 'usr-creator', name: 'Sarah Chen', email: 'sarah@faq.ai', password: creatorHash, role: 'Content Creator', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'active', favorites: ['faq-2'], createdAt: new Date() },
      { id: 'usr-user', name: 'David Miller', email: 'user@faq.ai', password: creatorHash, role: 'Authenticated User', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'active', favorites: [], createdAt: new Date() }
    ];

    // Seed sample FAQs
    this.faqs = [
      {
        id: 'faq-1',
        question: 'How do I reset my account password?',
        answer: 'To reset your password, navigate to the Login page and click on "Forgot Password?". Enter your registered email address, and we will send you a secure password reset link valid for 1 hour. Follow the instructions in the email to set a new strong password.',
        categoryId: 'cat-1',
        categoryName: 'Authentication',
        keywords: ['password', 'reset', 'login', 'account', 'security'],
        authorId: 'usr-admin',
        authorName: 'Alex Rivera',
        authorRole: 'Admin',
        status: 'Published',
        helpfulYes: 42,
        helpfulNo: 2,
        views: 185,
        isAiGenerated: false,
        versions: [
          { version: 1, answer: 'Click forgot password link on login page.', updatedBy: 'Alex Rivera', date: new Date(Date.now() - 86400000 * 10), summary: 'Initial draft' },
          { version: 2, answer: 'To reset your password, navigate to the Login page and click on "Forgot Password?". Enter your registered email address, and we will send you a secure password reset link valid for 1 hour.', updatedBy: 'Alex Rivera', date: new Date(Date.now() - 86400000 * 2), summary: 'Added link expiration details' }
        ],
        createdAt: new Date(Date.now() - 86400000 * 10),
        updatedAt: new Date(Date.now() - 86400000 * 2)
      },
      {
        id: 'faq-2',
        question: 'What are the system requirements for API integration?',
        answer: 'Our REST API requires HTTPS for all requests. Authentication is handled via Bearer JWT tokens in the Authorization header. Rate limits allow up to 1,000 requests per minute per API key. Supported payload formats are JSON.',
        categoryId: 'cat-2',
        categoryName: 'Configuration',
        keywords: ['api', 'integration', 'jwt', 'rate limit', 'rest'],
        authorId: 'usr-creator',
        authorName: 'Sarah Chen',
        authorRole: 'Content Creator',
        status: 'Published',
        helpfulYes: 28,
        helpfulNo: 1,
        views: 120,
        isAiGenerated: true,
        versions: [],
        createdAt: new Date(Date.now() - 86400000 * 8),
        updatedAt: new Date(Date.now() - 86400000 * 5)
      },
      {
        id: 'faq-3',
        question: 'How do I upgrade or change my subscription plan?',
        answer: 'You can upgrade your plan at any time from Settings > Billing. Choose your preferred plan (Pro or Enterprise) and click "Upgrade". Pro-rated charges will be applied automatically for the remaining period of your billing cycle.',
        categoryId: 'cat-3',
        categoryName: 'Billing & Subscriptions',
        keywords: ['billing', 'upgrade', 'subscription', 'plan', 'payment'],
        authorId: 'usr-admin',
        authorName: 'Alex Rivera',
        authorRole: 'Admin',
        status: 'Published',
        helpfulYes: 35,
        helpfulNo: 3,
        views: 140,
        isAiGenerated: false,
        versions: [],
        createdAt: new Date(Date.now() - 86400000 * 6),
        updatedAt: new Date(Date.now() - 86400000 * 1)
      },
      {
        id: 'faq-4',
        question: 'How is user data encrypted and protected?',
        answer: 'All stored data is encrypted at rest using AES-256 bit encryption. Transmitted data is encrypted in transit via TLS 1.3. We conduct quarterly third-party penetration testing and adhere strictly to SOC-2 and GDPR compliance standard guidelines.',
        categoryId: 'cat-4',
        categoryName: 'Security & Privacy',
        keywords: ['security', 'encryption', 'gdpr', 'privacy', 'data'],
        authorId: 'usr-admin',
        authorName: 'Alex Rivera',
        authorRole: 'Admin',
        status: 'Published',
        helpfulYes: 50,
        helpfulNo: 0,
        views: 210,
        isAiGenerated: true,
        versions: [],
        createdAt: new Date(Date.now() - 86400000 * 4),
        updatedAt: new Date(Date.now() - 86400000 * 1)
      },
      {
        id: 'faq-5',
        question: 'What should I do if I exceed the API rate limit?',
        answer: 'If you receive an HTTP 429 Too Many Requests response, implement an exponential backoff strategy in your code. You can also request an increased rate limit tier by contacting support through the Settings page.',
        categoryId: 'cat-5',
        categoryName: 'Technical Support',
        keywords: ['rate limit', '429', 'api', 'errors', 'support'],
        authorId: 'usr-creator',
        authorName: 'Sarah Chen',
        authorRole: 'Content Creator',
        status: 'Published',
        helpfulYes: 19,
        helpfulNo: 2,
        views: 89,
        isAiGenerated: false,
        versions: [],
        createdAt: new Date(Date.now() - 86400000 * 3),
        updatedAt: new Date(Date.now() - 86400000 * 3)
      }
    ];

    // Seed sample unanswered questions
    this.unansweredQuestions = [
      { id: 'un-1', query: 'How do I set up two-factor authentication (2FA)?', count: 14, category: 'Security & Privacy', lastSearched: new Date(Date.now() - 3600000 * 4), status: 'unanswered' },
      { id: 'un-2', query: 'Can I export FAQ data to PDF or CSV?', count: 9, category: 'Configuration', lastSearched: new Date(Date.now() - 3600000 * 12), status: 'unanswered' },
      { id: 'un-3', query: 'What is the refund policy for annual billing?', count: 6, category: 'Billing & Subscriptions', lastSearched: new Date(Date.now() - 3600000 * 24), status: 'unanswered' }
    ];

    // Seed activity log
    this.activities = [
      { id: 'act-1', user: 'Alex Rivera', action: 'FAQ created', target: 'How do I reset my account password?', date: new Date(Date.now() - 3600000 * 2) },
      { id: 'act-2', user: 'Sarah Chen', action: 'AI FAQ generated', target: 'What are the system requirements for API integration?', date: new Date(Date.now() - 3600000 * 5) },
      { id: 'act-3', user: 'Alex Rivera', action: 'Category created', target: 'Security & Privacy', date: new Date(Date.now() - 3600000 * 12) },
      { id: 'act-4', user: 'Sarah Chen', action: 'FAQ updated', target: 'What should I do if I exceed the API rate limit?', date: new Date(Date.now() - 3600000 * 20) }
    ];
  }
}

const memoryStore = new MemoryStore();
let isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log('[Database] MongoDB connection bypassed. Using High-Performance In-Memory Data Store.');
  }
};

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  memoryStore
};
