const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Competition title is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['hackathon', 'design', 'business', 'science', 'sports', 'other'],
    default: 'other'
  },
  organizer: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  deadline: {
    type: Date
  },
  prize: {
    type: String,
    default: ''
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  maxTeamSize: {
    type: Number,
    default: 5
  },
  minTeamSize: {
    type: Number,
    default: 2
  },
  registeredTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Competition', competitionSchema);
