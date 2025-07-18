const express = require('express');
const routerRaiting = express.Router();
const Rating = require('./Raitings');
const verifyToken = require('./verifyToken');

routerRaiting.post('/books/ratings', verifyToken, async (req, res) => {
  try {
    const { bookId, rating } = req.body;
    const userId = req.user.id;

    if (!bookId || typeof rating !== "number") {
      return res.status(400).json({ message: "bookId et rating requis." });
    }

    // Remplacer ou insérer (upsert) une note
    const result = await Rating.findOneAndUpdate(
      { userId, bookId },
      { rating },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "✅ Note enregistrée", rating: result });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = routerRaiting;
