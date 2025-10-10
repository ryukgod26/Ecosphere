const express = require("express");
const passport = require("../routes/passport");
const residentLoginRouter = express.Router();

// start Google OAuth
residentLoginRouter.get(
  "/auth/google",
  passport.authenticate("resident-google", { scope: ["profile", "email"] })
);

// Google OAuth callback
residentLoginRouter.get(
  "/auth/google/callback",
  passport.authenticate("resident-google", {
    successRedirect: "/resident",
    failureRedirect: "/residentLogin",
    failureFlash: true
  })
);


residentLoginRouter.post(
  "/", passport.authenticate("resident-local", {
    successRedirect: "/resident",       
    failureRedirect: "/residentLogin",  
    failureFlash: true                  
  })
);


residentLoginRouter.get("/", (req, res) => {
  res.render("residentLogin", { error: req.flash("error") });
});


module.exports = residentLoginRouter;
