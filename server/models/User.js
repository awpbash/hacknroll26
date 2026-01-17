const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  solvedChallenges: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    architectureData: mongoose.Schema.Types.Mixed,
    cost: Number,
    complexity: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  rank: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
