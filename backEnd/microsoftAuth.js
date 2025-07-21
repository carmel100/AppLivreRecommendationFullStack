const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('./userProvider');
require('dotenv').config();

passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: process.env.MICROSOFT_CALLBACK_URL,
  scope: ['user.read']
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

    return done(null, user); // ✅ PAS de token ici

  } catch (err) {
    return done(err, null);
  }
}));
