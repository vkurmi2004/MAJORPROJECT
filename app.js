require("dotenv").config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


// Routes
const listingsRoute = require('./routes/listing');
const reviewsRoute = require('./routes/review');
const userRouters = require('./routes/user.js');

const dbUrl = process.env.DB_URL;

// Mongo connection
async function main() {
  if (!dbUrl) throw new Error("DB_URL is missing");
  await mongoose.connect(dbUrl);
  console.log("✅ Connected to MongoDB");
}

main().catch(err => {
  console.error("❌ MongoDB error:", err.message);
});

// View engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600
});




store.on("error", e => {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 💥 THIS MIDDLEWARE IS THE FIX 💥
app.use((req, res, next) => {
  res.locals.currentUser = req.user;   // <-- IMPORTANT
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// ===== API ROUTE =====
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Root
app.get('/', (req, res) => {
  res.send('🌍 Welcome to WanderLust!');
});

app.get('/debug-version', (req, res) => {
  res.send('Deployed version: 88b4c02153e5322e8658f09d31ae6e30f74bd1d3');
});


// Routes
app.use('/listings', listingsRoute);
app.use('/listings/:id/reviews', reviewsRoute);

// IMPORTANT: mount user routes on /users
app.use('/users', userRouters);


// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

