const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { protect } = require('../middleware/auth');

// GET /api/users - Get all users (for AI matching)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id }, isActive: true })
      .select('-password')
      .limit(50);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/matches - AI Team Matching
// IMPORTANT: must be defined BEFORE /:id to avoid Express treating "matches" as an id
router.get('/matches', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const allUsers = await User.find({ _id: { $ne: req.user._id }, isActive: true })
      .select('-password');

    const mbtiCompatibility = {
      'INTJ': ['ENFP', 'ENTP', 'INFJ', 'INFP'],
      'INTP': ['ENTJ', 'ESTJ', 'INFJ', 'ENFJ'],
      'ENTJ': ['INTP', 'INFP', 'ISTP', 'ISFP'],
      'ENTP': ['INTJ', 'INFJ', 'ISFJ', 'ISTJ'],
      'INFJ': ['ENTP', 'ENFP', 'INTJ', 'INTP'],
      'INFP': ['ENTJ', 'ENFJ', 'INTJ', 'INTP'],
      'ENFJ': ['INTP', 'INFP', 'ISTP', 'ISFP'],
      'ENFP': ['INTJ', 'INFJ', 'ISTJ', 'ISFJ'],
      'ISTJ': ['ENFP', 'ESFP', 'ESTP', 'ENTP'],
      'ISFJ': ['ENFP', 'ESFP', 'ESTP', 'ENTP'],
      'ESTJ': ['INTP', 'ISFP', 'ISTP', 'INFP'],
      'ESFJ': ['INTP', 'ISFP', 'ISTP', 'INFP'],
      'ISTP': ['ENTJ', 'ESFJ', 'ESTJ', 'ENFJ'],
      'ISFP': ['ENTJ', 'ESFJ', 'ESTJ', 'ENFJ'],
      'ESTP': ['ISTJ', 'ISFJ', 'INFJ', 'INTJ'],
      'ESFP': ['ISTJ', 'ISFJ', 'INFJ', 'INTJ']
    };

    const matches = allUsers.map(user => {
      let score = 0;

      const currentSkills = new Set(currentUser.skills.map(s => s.toLowerCase()));
      const userSkills = new Set(user.skills.map(s => s.toLowerCase()));
      const sharedSkills = [...currentSkills].filter(s => userSkills.has(s));
      const uniqueSkills = [...userSkills].filter(s => !currentSkills.has(s));

      score += sharedSkills.length * 10;
      score += uniqueSkills.length * 15;

      if (currentUser.mbti && user.mbti) {
        const compatibles = mbtiCompatibility[currentUser.mbti] || [];
        if (compatibles.includes(user.mbti)) score += 20;
        else if (currentUser.mbti === user.mbti) score += 5;
      }

      if (currentUser.gpa > 0 && user.gpa > 0) {
        const gpaDiff = Math.abs(currentUser.gpa - user.gpa);
        if (gpaDiff < 0.5) score += 15;
        else if (gpaDiff < 1.0) score += 8;
      }

      if (currentUser.university && user.university === currentUser.university) {
        score += 10;
      }

      const maxScore = 100;
      const percentage = Math.min(Math.round((score / maxScore) * 100), 99);

      return {
        user: {
          _id: user._id,
          name: user.name,
          university: user.university,
          major: user.major,
          skills: user.skills,
          mbti: user.mbti,
          gpa: user.gpa,
          avatar: user.avatar
        },
        matchScore: Math.max(percentage, 30),
        sharedSkills,
        complementarySkills: uniqueSkills.slice(0, 5)
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ success: true, matches: matches.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/dashboard/stats - Get dashboard statistics
// IMPORTANT: must be defined BEFORE /:id
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const achievements = await Achievement.find({ user: req.user._id });
    const newAchievements = achievements.filter(a => a.isNew).length;

    res.json({
      success: true,
      stats: {
        profileScore: user.profileScore,
        totalAchievements: achievements.length,
        newAchievements,
        gpa: user.gpa,
        skills: user.skills,
        teamMatches: 3
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/profile - Update current user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, university, major, gpa, skills, bio, mbti, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (university !== undefined) user.university = university;
    if (major !== undefined) user.major = major;
    if (gpa !== undefined) user.gpa = gpa;
    if (skills !== undefined) user.skills = skills;
    if (bio !== undefined) user.bio = bio;
    if (mbti !== undefined) user.mbti = mbti;
    if (avatar !== undefined) user.avatar = avatar;

    user.profileScore = user.calculateProfileScore();
    await user.save();

    if (user.profileScore >= 80) {
      const existing = await Achievement.findOne({ user: user._id, title: 'Profile Pro' });
      if (!existing) {
        await Achievement.create({
          user: user._id,
          title: 'Profile Pro',
          description: 'Completed your profile to 80%+',
          type: 'profile',
          icon: '⭐'
        });
      }
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
