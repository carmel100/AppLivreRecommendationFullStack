const express = require('express');
const routeRegister = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./user');

routeRegister.post('/register', async (req, res) => {
  const { nom, prenom, email, motdepasse } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const newUser = new User({ nom, prenom, email, motdepasse });
    await newUser.save();

    // Création du token JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // ou '1d', '7d' selon ce que tu veux
    );

    res.status(201).json({
      message: "Inscription réussie",
      token,
      user: {
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = routeRegister;
