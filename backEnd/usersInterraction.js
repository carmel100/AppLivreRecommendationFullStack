const mongoose = require('mongoose');

// Schéma des commentaires
const commentaireSchema = new mongoose.Schema({
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Schéma des interactions
const interractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation', required: true },
  Titre: { type: String, required: true },
  Auteur: { type: String, required: true },
  Description: String,
  Image: String,
  Notes: { type: Number, min: 0, max: 5, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  abonnés: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  commentaires: [commentaireSchema], // ✅ Ajout ici
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interraction', interractionSchema);
