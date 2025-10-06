const garbageSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number] // [lng, lat]
  },
  description: String,
  status: { type: String, enum: ["Uncleaned", "In Progress", "Cleaned"], default: "Uncleaned" },
  cleaner: { type: mongoose.Schema.Types.ObjectId, ref: "Cleaner" },
  review: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Garbage", garbageSchema);
