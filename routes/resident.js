// routes/resident.js
const express = require("express");
const residentRouter = express.Router();
const GarbageReport = require("../models/garbageReport");
const {pictures} = require("../config/cloudinaryUpload");
const Review = require("../models/review");
const Resident =  require('../models/resident');

// Render dashboard
residentRouter.get("/", async (req, res) => {
  try {
     const userName = req.user?.fullName || req.user?.username || "Guest";
    const cleanedAreas = await GarbageReport.find({});
    res.render("resident", {
      resident: { fullName: userName, mobile: req.user?.mobile || "N/A" },
      cleanedAreas, // pass all reports to EJS
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading resident dashboard");
  }
});
  residentRouter.post("/edit-details/", async (req, res) => {
    try {
      const { fullName, mobile, locality, city, state } = req.body;
      await Resident.findByIdAndUpdate(req.params.id, {
        fullName,
        mobile,
        locality,
        city,
        state,
      });
      res.redirect("/resident");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating profile");
    }
  });


residentRouter.post("/report", pictures.single("image"), async (req, res) => {
  try {
    const { lat, lng, name, mobile } = req.body;

    const newReport = new GarbageReport({
      resident: { fullName: name, mobile },
      location: { type: "Point", coordinates: [lng, lat] },
      image: req.file.path,
      status: "Pending",
    });

    await newReport.save();
    res.status(201).json({ success: true, message: "Report submitted successfully!" });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ success: false, message: "Server error while saving report" });
  }
});
residentRouter.get("/api/reports", async (req, res) => {
  try {
    const reports = await GarbageReport.find({});
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});
module.exports = residentRouter;
