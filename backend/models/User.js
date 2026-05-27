const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  mbti: {
    type: String,
    enum: ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
           'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP', ''],
    default: ''
  },
  university: {
    type: String,
    default: ''
  },
  major: {
    type: String,
    default: ''
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4.5,
    default: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  profileScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile score
userSchema.methods.calculateProfileScore = function() {
  let score = 0;
  if (this.name) score += 10;
  if (this.email) score += 10;
  if (this.university) score += 15;
  if (this.major) score += 10;
  if (this.gpa > 0) score += 15;
  if (this.skills.length > 0) score += Math.min(this.skills.length * 5, 20);
  if (this.bio) score += 10;
  if (this.mbti) score += 10;
  return Math.min(score, 100);
};

module.exports = mongoose.model('User', userSchema);
