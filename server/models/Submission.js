const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  architecture: {
    nodes: [{
      id: String,
      type: String,
      data: mongoose.Schema.Types.Mixed,
      position: {
        x: Number,
        y: Number
      }
    }],
    edges: [{
      id: String,
      source: String,
      target: String,
      type: String
    }]
  },
  provider: {
    type: String,
    enum: ['AWS', 'Azure', 'GCP', 'Multi-Cloud'],
    required: true
  },
  evaluation: {
    passed: Boolean,
    cost: Number,
    complexity: Number,
    score: Number,
    feedback: [String],
    errors: [String]
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Architecture', 'Too Expensive', 'Incomplete'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
