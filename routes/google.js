const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const google = express.Router();



google.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

google.use(passport.initialize());
google.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

google.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res)=>{
  const redirectUrl = `http://localhost:3000/successgoogle?user=${encodeURIComponent(JSON.stringify(req.user))}`
  res.redirect(redirectUrl)
});

google.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(user, process.env.JWT_SECRET);
    const redirectUrl = `http://localhost:3000/successgoogle/callback/${encodeURIComponent(token)}`
    res.redirect(redirectUrl);
  }
);

google.get('/success', (req, res) => {
  res.redirect('http://localhost:3000/home');
});

module.exports = google;
