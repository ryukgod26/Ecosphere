const express = require("express");
const router = express.Router();
const GarbageReport = require("../models/garbageReport");

// 1️⃣ Cleaner dashboard page
router.get("/", async (req, res) => {
  const reports = await GarbageReport.find().lean();
  res.render("cleaner", { cleaner: { fullName: "Arjun Kumar" }, reports });
});

// API: Fetch all reports
router.get("/api/reports", async (req, res) => {
  try {
    const reports = await GarbageReport.find();
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// API: Mark cleaned
router.post("/api/mark-cleaned/:id", async (req, res) => {
  try {
    const report = await GarbageReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "Cleaned";
    await report.save();

    res.json({ success: true, message: "Marked as cleaned successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update report status" });
  }
});

module.exports = router;
