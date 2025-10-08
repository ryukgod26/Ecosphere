const express = require("express");
const cleanerLoginRouter=express.Router();
const passport = require("../routes/passport");


// start Google OAuth
cleanerLoginRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
cleanerLoginRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/cleaner",
    failureRedirect: "/cleanerLogin",
    failureFlash: true
  })
);


cleanerLoginRouter.post(
  "/", passport.authenticate("cleaner-local", {
    successRedirect: "/cleaner",       
    failureRedirect: "/cleanerLogin",  
    failureFlash: true                  
  })
);

cleanerLoginRouter.get("/", (req, res) => {
  res.render("cleanerLogin", { error: req.flash("error") });
});
module.exports =cleanerLoginRouter;