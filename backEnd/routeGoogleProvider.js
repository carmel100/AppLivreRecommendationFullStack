/*const express = require('express');
const passport = require('passport');

const routerProvider = express.Router();

// Lancement de l'auth Google
routerProvider.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback après login Google
routerProvider.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173',
    successRedirect: 'http://localhost:5173/Accueil',
    session: false
  })
);





module.exports = routerProvider; */

/*
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const routerProvider = express.Router();

routerProvider.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// CALLBACK AVEC TOKEN
routerProvider.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173', session: false }),
  (req, res) => {
    // 1. Génère un token
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // 2. Redirige vers frontend AVEC le token dans l’URL
    res.redirect(`http://localhost:5173/Accueil?token=${token}`);
  }
);

module.exports = routerProvider;*/

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const routerProvider = express.Router();

routerProvider.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

routerProvider.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173', session: false }),
  async (req, res) => {
    try {
      // Relecture des infos utilisateur depuis MongoDB
      const user = await require('./userProvider').findById(req.user._id);
      if (!user) return res.redirect('http://localhost:5173');

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

      return res.redirect(`http://localhost:5173/Accueil?token=${token}`);
    } catch (err) {
      console.error("Erreur Google callback :", err);
      return res.redirect('http://localhost:5173');
    }
  }
);
module.exports = routerProvider;
