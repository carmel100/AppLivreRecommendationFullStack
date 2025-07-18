  const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Ajouté
const User = require('./user');
const router = express.Router();

router.post('/auth', async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    if (!email || !motdepasse) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const utilisateur = await User.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const motDePasseValide = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // ✅ Crée un token signé
    const token = jwt.sign(
      {
        id: utilisateur._id,
        email: utilisateur.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token valide pendant 1h
    );

    // ✅ Réponse avec le token
    res.status(200).json({
  message: "Connexion réussie",
  token,
  user: {
    nom: utilisateur.nom,
    prenom: utilisateur.prenom,
    email: utilisateur.email,
  }
});

  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
