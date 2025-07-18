
/*
const express = require('express');
const passport = require('passport');

const routerProvider1 = express.Router();


// Étape 1 : Démarrer l'authentification Microsoft
routerProvider1.get('/microsoft', 
  passport.authenticate('microsoft', { scope: ['user.read'] })
);

// Étape 2 : Gérer le callback Microsoft après login
routerProvider1.get('/microsoft/callback',
  passport.authenticate('microsoft', {
    failureRedirect: 'http://localhost:5173',
    successRedirect: 'http://localhost:5173/Accueil',
  })
);

module.exports = routerProvider1;*/


const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./userProvider'); // Modèle Mongoose

const routerProvider1 = express.Router();

// Étape 1 : Démarrer l'authentification Microsoft
routerProvider1.get('/microsoft', 
  passport.authenticate('microsoft', { scope: ['user.read'] })
);

// Étape 2 : Gérer le callback Microsoft avec JWT
routerProvider1.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: 'http://localhost:5173', session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.redirect('http://localhost:5173');

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          prenom: user.prenom || "", // Si tu les ajoutes plus tard
          nom: user.nom || ""
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.redirect(`http://localhost:5173/Accueil?token=${token}`);
    } catch (err) {
      console.error("Erreur Microsoft callback :", err);
      return res.redirect('http://localhost:5173');
    }
  }
);

module.exports = routerProvider1;
