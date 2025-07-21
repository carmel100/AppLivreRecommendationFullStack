const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const routerProvider1 = express.Router();

// 🔧 URL frontend (en prod et local)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 👉 Démarrer l’authentification Microsoft
routerProvider1.get('/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] })
);

// 👉 Callback Microsoft avec JWT + redirection
routerProvider1.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: FRONTEND_URL, session: false }),
  async (req, res) => {
    try {
      const user = await require('./userProvider').findById(req.user._id);
      if (!user) return res.redirect(FRONTEND_URL);

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          prenom: user.prenom || "",
          nom: user.nom || ""
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.redirect(`${FRONTEND_URL}/Accueil?token=${token}`);
    } catch (err) {
      console.error("Erreur Microsoft callback :", err);
      return res.redirect(FRONTEND_URL);
    }
  }
);

module.exports = routerProvider1;
