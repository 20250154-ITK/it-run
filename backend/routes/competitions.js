const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/competitions - Get all competitions
router.get('/', protect, async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const competitions = await Competition.find(filter)
      .populate('registeredTeams', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, competitions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/competitions - Create competition (admin)
router.post('/', protect, async (req, res) => {
  try {
    const competition = await Competition.create(req.body);
    res.status(201).json({ success: true, competition });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/competitions/:id - Get competition by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate('registeredTeams');
    if (!competition) return res.status(404).json({ success: false, message: 'Competition not found' });
    res.json({ success: true, competition });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/competitions/:id - Update competition
router.put('/:id', protect, async (req, res) => {
  try {
    const competition = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!competition) return res.status(404).json({ success: false, message: 'Competition not found' });
    res.json({ success: true, competition });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
