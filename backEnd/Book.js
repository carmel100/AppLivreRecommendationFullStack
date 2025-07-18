const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  googleBookId: {            // 🔑 utilisé pour l'identification depuis Google Books
    type: String,
    required: true,
    unique: true
  },
  title: String,
  authors: [String],
  publisher: String,
  publishedDate: String,
  description: String,
  averageRating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Book', bookSchema);
