const express = require("express");
const router = express.Router();
const GarbageReport = require("../models/garbageReport");
const cleaner =  require('../models/cleaner');


router.get("/", async (req, res) => {
  try {
       const userName = req.user?.fullName || req.user?.username || "Guest";
      const cleanedAreas = await GarbageReport.find({});
      res.render("cleaner", {
        cleaner:req.user,
        cleanedAreas,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading resident dashboard");
    }
});


router.get("/api/reports", async (req, res) => {
  try {
    const reports = await GarbageReport.find();
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});


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
router.post("/edit-details", async (req, res) => {
    try {
      const { fullName, mobile, locality, city, state,userId} = req.body;
      await cleaner.findOneAndUpdate({username:userId}, {
        fullName,
        mobile,
        locality,
        city,
        state,
      });
      res.redirect("/cleaner");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating profile");
    }
  });
module.exports = router;
