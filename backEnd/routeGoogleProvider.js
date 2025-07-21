
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const routerProvider = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


routerProvider.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

routerProvider.get('/google/callback',
  passport.authenticate('google', { failureRedirect: FRONTEND_URL, session: false }),
  async (req, res) => {
    try {
      // Relecture des infos utilisateur depuis MongoDB
      const user = await require('./userProvider').findById(req.user._id);
      if (!user) return res.redirect(FRONTEND_URL);

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          prenom: user.prenom,
          nom: user.nom,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.redirect(`${FRONTEND_URL}/Accueil?token=${token}`);
    } catch (err) {
      console.error("Erreur Google callback :", err);
      return res.redirect(FRONTEND_URL);
    }
  }
);
module.exports = routerProvider;
