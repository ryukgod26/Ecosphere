require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connection = require("./controllers/mongooseConnection");
const passport = require("./routes/passport");
const chat = require("./routes/cerabas");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== MIDDLEWARES ======
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// ====== ROUTES IMPORTS ======
const homeRouter = require("./routes/home");
const cleanerloginRouter = require("./routes/cleanerLogin");
const cleanerRouter = require("./routes/cleaner");
const residentloginRouter = require("./routes/residentLogin");
const cleanerRegisterRouter = require("./routes/cleanerRegister");
const residentRegisterRouter = require("./routes/residentRegister");
const residentRouter = require("./routes/resident");
const markLocationRouter = require("./routes/locationMark");
const reviewRoute = require("./routes/reviewRoute");

// ====== STATIC + VIEW ENGINE ======
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ====== CHAT ROUTE ======
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await chat(message);
    res.json(reply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ====== ROUTES (order matters) ======
app.use("/", homeRouter);
app.use("/cleaner", cleanerRouter);
app.use("/resident", residentRouter); // multer route must come before body parsers
app.use("/cleanerLogin", cleanerloginRouter);
app.use("/residentLogin", residentloginRouter);
app.use("/cleanerRegister", cleanerRegisterRouter);
app.use("/residentRegister", residentRegisterRouter);
app.use("/markLocation", markLocationRouter);
app.use("/reviewRoute", reviewRoute);

// ====== BODY PARSERS (after upload routes) ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// ====== SERVER ======
app.listen(3000);
