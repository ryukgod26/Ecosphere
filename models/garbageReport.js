// models/garbageReport.js
const mongoose = require("mongoose");

const garbageReportSchema = new mongoose.Schema({
  resident: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
    fullName: String,
    mobile: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [lng, lat]
  },
  image: String, // Cloudinary URL or base64 for now
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

garbageReportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("GarbageReport", garbageReportSchema);
