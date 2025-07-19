const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./userProvider');

const routerGithub = express.Router();

routerGithub.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

routerGithub.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173',
    session: false
  }),
  async (req, res) => {
    const user = await User.findById(req.user._id);

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      prenom: user.prenom,
      nom: user.nom,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/Connexion?token=${token}`);
  }
);

module.exports = routerGithub;
