const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['competition', 'skill', 'profile', 'team', 'academic'],
    default: 'profile'
  },
  icon: {
    type: String,
    default: '🏆'
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  isNew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
