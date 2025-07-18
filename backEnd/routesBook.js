const express = require('express');
const routerBook = express.Router();
const Book = require('./Book'); // ajuste le chemin selon ton projet
const Rating = require('./Raitings');
const authenticateToken = require('./verifyToken')

// Obtenir tous les livres
routerBook.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir un livre par ID Mongo
routerBook.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ googleBookId: req.params.id }); // ✅ recherche par googleBookId
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(book);
  } catch (err) {
    console.error("Erreur GET /books/:id :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Évaluer un livre via son googleBookId
routerBook.post('/books/:id/rate', authenticateToken, async (req, res) => {
  /*const { rating } = req.body;
  const googleBookId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Note invalide. Elle doit être entre 1 et 5.' });
  }

  try {
    // Chercher le livre dans la base de données
    let book = await Book.findOne({ googleBookId });

    // S'il n'existe pas encore, on le crée automatiquement
    if (!book) {
      book = new Book({
        googleBookId,
        title: "Titre inconnu",
        authors: [],
        publisher: "",
        publishedDate: "",
        description: "",
        averageRating: 0,
        ratingsCount: 0
      });
    }

    const totalRating = book.averageRating * book.ratingsCount;
    book.ratingsCount += 1;
    book.averageRating = (totalRating + rating) / book.ratingsCount;

    await book.save();

    res.json({
      message: 'Merci pour votre évaluation !',
      averageRating: book.averageRating.toFixed(1)
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de l'évaluation" });
  }*/
/*
const { rating, title, authors, description, publisher, publishedDate } = req.body;

if (!rating || rating < 1 || rating > 5) {
  return res.status(400).json({ message: 'Note invalide. Elle doit être entre 1 et 5.' });
}

try {
  let book = await Book.findOne({ googleBookId: req.params.id });

  // 🔁 Si le livre n'existe pas encore, on le crée
  if (!book) {
    book = new Book({
      googleBookId: req.params.id,
      title,
      authors,
      description,
      publisher,
      publishedDate,
      averageRating: rating,
      ratingsCount: 1
    });
  } else {
    const totalRating = book.averageRating * book.ratingsCount;
    book.ratingsCount += 1;
    book.averageRating = (totalRating + rating) / book.ratingsCount;
  }

  await book.save();
  res.json({
    message: 'Merci pour votre évaluation !',
    averageRating: book.averageRating.toFixed(1)
  });
} catch (err) {
  res.status(500).json({ error: 'Erreur serveur lors de l\'évaluation' });
}

*/

 const { rating, title, authors, description, publisher, publishedDate } = req.body;
  const googleBookId = req.params.id;
  const userId = req.user?.id; // récupéré depuis le token

  if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Note invalide. Elle doit être entre 1 et 5.' });
  }

  try {
    // Vérifie si l'utilisateur a déjà noté ce livre
    const existingRating = await Rating.findOne({ userId, bookId: googleBookId });
    if (existingRating) {
      return res.status(400).json({ message: 'Vous avez déjà évalué ce livre.' });
    }

    // Enregistre la nouvelle note
    await Rating.create({ userId, bookId: googleBookId, rating });

    // Met à jour ou crée le livre
    let book = await Book.findOne({ googleBookId });
    if (!book) {
      book = new Book({
        googleBookId,
        title,
        authors,
        description,
        publisher,
        publishedDate,
        averageRating: rating,
        ratingsCount: 1
      });
    } else {
      const totalRating = book.averageRating * book.ratingsCount;
      book.ratingsCount += 1;
      book.averageRating = (totalRating + rating) / book.ratingsCount;
    }

    await book.save();

    res.json({
      message: 'Merci pour votre évaluation !',
      averageRating: book.averageRating.toFixed(1)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'évaluation' });
  }

});

module.exports = routerBook;
