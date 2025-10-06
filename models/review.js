const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'resident', required: true },
  cleanerId: { type: mongoose.Schema.Types.ObjectId, ref: 'cleaner', required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'location', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
