const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./userProvider'); // Modèle Mongoose

const routerProvider1 = express.Router();

// 🔧 Utilitaire pour générer l'URL de redirection selon l'environnement
function getRedirectBaseUrl() {
  return process.env.NODE_ENV === 'production'
    ? 'https://applivrerecommendationfullstack.onrender.com'
    : 'http://localhost:5173';
}

// Étape 1 : Démarrer l'authentification Microsoft
routerProvider1.get('/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] })
);

// Étape 2 : Callback Microsoft → créer token + rediriger vers frontend
routerProvider1.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: getRedirectBaseUrl(), session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.redirect(getRedirectBaseUrl());

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

      return res.redirect(`${getRedirectBaseUrl()}/Connexion?token=${token}`);
    } catch (err) {
      console.error("Erreur Microsoft callback :", err);
      return res.redirect(getRedirectBaseUrl());
    }
  }
);

module.exports = routerProvider1;
