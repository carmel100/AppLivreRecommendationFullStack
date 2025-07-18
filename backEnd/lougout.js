// dans un fichier comme `auth.js` ou `logout.js`
const express = require('express');
const routerLougout = express.Router();

routerLougout.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Erreur pendant la déconnexion' });
      res.clearCookie('connect.sid'); // nom du cookie de session par défaut
      res.status(200).json({ message: 'Déconnexion réussie' });
    });
  });
});

module.exports = routerLougout;
