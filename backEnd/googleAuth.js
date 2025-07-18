/*const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv')
const User = require('./userProvider'); // Modèle Mongoose
   dotenv.config()
   
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOneAndUpdate(
    { googleId: profile.id },
    { email: profile.emails[0].value },
    { upsert: true, new: true }
  );
  done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));*/


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./userProvider');
const dotenv = require('dotenv');
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOneAndUpdate(
    { googleId: profile.id },
    {
      email: profile.emails[0].value,
      nom: profile.name?.familyName,
      prenom: profile.name?.givenName,
    },
    { new: true, upsert: true }
  );
  return done(null, user);
}));
