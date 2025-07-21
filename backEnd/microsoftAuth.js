const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const jwt = require('jsonwebtoken');
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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return done(null, { user, token });

  } catch (err) {
    return done(err, null);
  }
}));
