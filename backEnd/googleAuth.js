const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./userProvider');
const dotenv = require('dotenv');
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL, // ✅ URL complète
}, async (accessToken, refreshToken, profile, done) => {
  try {
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
  } catch (err) {
    return done(err, null);
  }
}));
