const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Achievement = require('../models/Achievement');
const { protect } = require('../middleware/auth');

// GET /api/teams - Get all teams
router.get('/', protect, async (req, res) => {
  try {
    const teams = await Team.find({ status: { $in: ['recruiting', 'active'] } })
      .populate('leader', 'name email university')
      .populate('members.user', 'name email skills')
      .populate('competition', 'title category');
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/teams/my - Get current user's teams
// IMPORTANT: must be defined BEFORE /:id
router.get('/my', protect, async (req, res) => {
  try {
    const teams = await Team.find({ 'members.user': req.user._id })
      .populate('leader', 'name email')
      .populate('members.user', 'name email skills')
      .populate('competition', 'title');
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/teams - Create team
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, competition, requiredSkills, maxMembers } = req.body;

    const team = await Team.create({
      name,
      description,
      competition,
      requiredSkills,
      maxMembers,
      leader: req.user._id,
      members: [{ user: req.user._id, role: 'leader' }]
    });

    const existing = await Achievement.findOne({ user: req.user._id, title: 'Team Builder' });
    if (!existing) {
      await Achievement.create({
        user: req.user._id,
        title: 'Team Builder',
        description: 'Created your first team',
        type: 'team',
        icon: '👥'
      });
    }

    await team.populate('leader', 'name email');
    res.status(201).json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/teams/:id - Get team by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email university skills')
      .populate('members.user', 'name email skills university')
      .populate('competition', 'title category endDate');
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/teams/:id/join - Join a team
router.post('/:id/join', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const isMember = team.members.some(m => m.user.toString() === req.user._id.toString());
    if (isMember) return res.status(400).json({ success: false, message: 'Already a member' });

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ success: false, message: 'Team is full' });
    }

    team.members.push({ user: req.user._id, role: 'member' });
    if (team.members.length >= team.maxMembers) team.status = 'full';
    await team.save();

    res.json({ success: true, message: 'Joined team successfully', team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
