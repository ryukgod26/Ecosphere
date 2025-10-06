const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const Resident = require("../models/resident");
const bcrypt = require("bcrypt");
const session = require('express-session');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Resident.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


passport.use(
  new LocalStrategy(
     { usernameField: "username" },
    async (username, password, done) => {
    try {
      const resident = await Resident.findOne({ username });
      if (!resident) return done(null, false, { message: "User not found" });

      const isMatch = await bcrypt.compare(password, resident.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      return done(null, resident);
    } catch (err) {
      return done(err);
    }
  })
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/residentLogin/auth/google/callback"  || "http://localhost:3000/residentLogin/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const username =  (email && email.split("@")[0]) ||
          profile.displayName?.replace(/\s+/g, "_").toLowerCase() ||
          `google_${profile.id}`;
          console.log(username);
          

        let resident = await Resident.findOne({ googleId: profile.id });
        if (!resident) {
          resident = new Resident({
            googleId: profile.id,
            fullName: profile.displayName,
            username: profile.emails[0].value,
          });
          await resident.save();
        }
        done(null, resident);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
