

const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const dotenv = require('dotenv');
const User = require('./userProvider'); // modèle Mongoose
dotenv.config();

passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: '/auth/microsoft/callback',
  scope: ['user.read'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOneAndUpdate(
      { microsoftId: profile.id },
      {
        email: profile.emails?.[0]?.value,
        nom: profile.name?.familyName || '',
        prenom: profile.name?.givenName || '',
      },
      { new: true, upsert: true }
    );
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Sérialisation
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Désérialisation
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

