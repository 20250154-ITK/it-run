const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000
  },
  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition'
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requiredSkills: [{
    type: String,
    trim: true
  }],
  maxMembers: {
    type: Number,
    default: 5,
    min: 2,
    max: 10
  },
  status: {
    type: String,
    enum: ['recruiting', 'full', 'active', 'completed'],
    default: 'recruiting'
  },
  matchScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
