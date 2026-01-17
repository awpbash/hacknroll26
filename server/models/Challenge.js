const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  constraints: {
    maxCost: Number,
    requiredServices: [String],
    optionalServices: [String]
  },
  category: {
    type: String,
    enum: ['Storage', 'Compute', 'Database', 'Networking', 'Serverless', 'Full-Stack'],
    required: true
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    description: String
  }],
  optimalSolution: {
    architecture: mongoose.Schema.Types.Mixed,
    cost: Number,
    complexity: Number,
    explanation: String
  },
  acceptanceRate: {
    type: Number,
    default: 0
  },
  submissions: {
    type: Number,
    default: 0
  },
  accepted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);
