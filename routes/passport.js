const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const Resident = require("../models/resident");
const Cleaner = require("../models/cleaner");


passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});


passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.role === "resident") user = await Resident.findById(obj.id);
    else if (obj.role === "cleaner") user = await Cleaner.findById(obj.id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});





passport.use(
  "resident-local",
  new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
    try {
      const resident = await Resident.findOne({ username });
      if (!resident) return done(null, false, { message: "Resident not found" });

      const isMatch = await bcrypt.compare(password, resident.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      resident.role = "resident";
      return done(null, resident);
    } catch (err) {
      return done(err);
    }
  })
);


passport.use(
  "cleaner-local",
  new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
    try {
      const cleaner = await Cleaner.findOne({ username });
      if (!cleaner) return done(null, false, { message: "Cleaner not found" });

      const isMatch = await bcrypt.compare(password, cleaner.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      cleaner.role = "cleaner";
      return done(null, cleaner);
    } catch (err) {
      return done(err);
    }
  })
);



passport.use(
  "resident-google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/residentLogin/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let resident = await Resident.findOne({ googleId: profile.id });
        if (!resident) {
          resident = new Resident({
            googleId: profile.id,
            fullName: profile.displayName,
            username: profile.emails?.[0]?.value || `user_${profile.id}`,
          });
          await resident.save();
        }
        resident.role = "resident";
        done(null, resident);
      } catch (err) {
        done(err, null);
      }
    }
  )
);


passport.use(
  "cleaner-google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/cleanerLogin/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let cleaner = await Cleaner.findOne({ googleId: profile.id });
        if (!cleaner) {
          cleaner = new Cleaner({
            googleId: profile.id,
            fullName: profile.displayName,
            username: profile.emails?.[0]?.value || `user_${profile.id}`,
          });
          await cleaner.save();
        }
        cleaner.role = "cleaner";
        done(null, cleaner);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
