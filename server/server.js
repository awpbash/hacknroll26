const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase
require('./config/firebase');

const app = express();

// Trust proxy - needed for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Optional: Apply general API rate limiting
if (process.env.ENABLE_RATE_LIMIT !== 'false') {
  const { apiLimiter } = require('./middleware/rateLimiter');
  app.use('/api/', apiLimiter);
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/services', require('./routes/services'));
app.use('/api/quest', require('./routes/quest'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CloudArch LeetCode API is running' });
});



const PORT = process.env.PORT || 5000;

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Hello")
  });
}

// Export for Vercel serverless
module.exports = app;
