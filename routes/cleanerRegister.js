const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/cleaner");



router.post("/", async (req, res) => {
    const { fullName, mobile, locality, city, state, username, password, password2 } = req.body;
    let errors = [];
    if (password !== password2) errors.push({ msg: "Passwords do not match" });

    if (errors.length > 0) {
        return res.render("/cleanerRegister", { errors, fullName, mobile, locality, city, state, username });
    }
    if (!fullName || !mobile || !locality || !city || !state || !username || !password || !password2) {
        errors.push({ msg: "Please enter all fields" });
    }
    try {
        let user = await User.findOne({ username });
        if (user) {
            errors.push({ msg: "Username already exists" });
            return res.render("cleanerLogin", { errors, fullName, mobile, locality, city, state, username });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName, mobile, locality, city, state, username,
            password: hashedPassword,
        });

        await newUser.save();
        req.flash("success_msg", "cleaner registered successfully! Please login.");
        res.redirect("/cleanerLogin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.get("/", (req, res) => {
    res.render("cleanerRegister");
});

module.exports = router;
