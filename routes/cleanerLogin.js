const express = require("express");
const cleanerLoginRouter=express.Router();
const passport = require("../routes/passport");



cleanerLoginRouter.get(
  "/auth/google",
  passport.authenticate("cleaner-google", { scope: ["profile", "email"] })
);


cleanerLoginRouter.get(
  "/auth/google/callback",
  passport.authenticate("cleaner-google", {
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