const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const { protect } = require('../middleware/auth');

// GET /api/achievements - Get current user's achievements
router.get('/', protect, async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id }).sort({ earnedAt: -1 });
    res.json({ success: true, achievements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/achievements/read-all - Mark all achievements as read
// IMPORTANT: must be defined BEFORE /:id/read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Achievement.updateMany({ user: req.user._id, isNew: true }, { isNew: false });
    res.json({ success: true, message: 'All achievements marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/achievements/:id/read - Mark achievement as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const achievement = await Achievement.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isNew: false },
      { new: true }
    );
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });
    res.json({ success: true, achievement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
