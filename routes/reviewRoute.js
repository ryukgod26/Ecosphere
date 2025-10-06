const express = require('express');
const router = express.Router();
const Review = require('../models/review');

router.post('/submit-review', async (req, res) => {
  try {
    const { residentId, cleanerId, areaId, rating, comment } = req.body;

    const newReview = new Review({ residentId, cleanerId, areaId, rating, comment });
    await newReview.save();

    res.status(201).json({ success: true, message: 'Review submitted successfully!' });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting review' });
  }
});

module.exports = router;
