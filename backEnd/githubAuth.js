// githubAuth.js
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./userProvider'); // ton modèle mongoose

require('dotenv').config();

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

    const user = await User.findOneAndUpdate(
      { githubId: profile.id },
      {
        email,
        prenom: profile.username, // GitHub ne donne pas "first name"
        nom: "", // champ vide si tu veux
      },
      { upsert: true, new: true }
    );

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
