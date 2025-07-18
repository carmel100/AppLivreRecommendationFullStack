

const express = require('express');
const routerInterractionDetails = express.Router();

const Recommendation = require('./usersBookRecommendation');
const Interraction = require('./usersInterraction');
const verifyToken = require('./verifyToken');


routerInterractionDetails.get('/recommendation/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    // Récupère la recommandation
    const rec = await Recommendation.findById(id).populate('userId');

    if (!rec) {
      return res.status(404).json({ message: 'Recommandation non trouvée' });
    }

    // Récupère l'interaction liée
    const inter = await Interraction.findOne({ recommendationId: id });

    // Construction de la réponse enrichie
    const response = {
      ...rec.toObject(),
      likesCount: inter?.likes?.length || 0,
      dislikesCount: inter?.dislikes?.length || 0,
      abonnementsCount: inter?.abonnés?.length || 0,
      abonnés: inter?.abonnés || [] // <-- Important pour savoir si l'utilisateur est abonné
    };

    res.json(response);

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


routerInterractionDetails.post('/recommendation/:id/comment', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { contenu } = req.body;
    const userId = req.user.id;

    if (!contenu || contenu.trim() === "") {
      return res.status(400).json({ message: "Le commentaire ne peut pas être vide." });
    }

    const inter = await Interraction.findOne({ recommendationId: id });

    if (!inter) {
      return res.status(404).json({ message: "Interaction non trouvée." });
    }

    inter.commentaires = inter.commentaires || [];

    // Vérifie si un commentaire existe déjà pour cet utilisateur
    const existingIndex = inter.commentaires.findIndex(
      (c) => c.auteur.toString() === userId
    );

    if (existingIndex !== -1) {
      // Modifier le commentaire existant
      inter.commentaires[existingIndex].contenu = contenu;
      inter.commentaires[existingIndex].date = new Date();
    } else {
      // Ajouter un nouveau commentaire
      inter.commentaires.push({ auteur: userId, contenu, date: new Date() });
    }

    await inter.save();

    res.status(200).json({
      message: existingIndex !== -1 ? "Commentaire mis à jour" : "Commentaire ajouté",
      commentaire: inter.commentaires.find(c => c.auteur.toString() === userId),
    });

  } catch (error) {
    console.error("Erreur ajout/modification commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




// exemple : routes/interactions.js ou routes/recommendation.js

routerInterractionDetails.get('/recommendation/:id/commentaires', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const interaction = await Interraction.findOne({ recommendationId: id })
      .populate("commentaires.auteur", "prenom nom");

    if (!interaction) {
      return res.status(404).json({ message: "Aucune interaction trouvée" });
    }

    res.status(200).json({ commentaires: interaction.commentaires || [] });
  } catch (error) {
    console.error("Erreur récupération commentaires :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


routerInterractionDetails.delete('/recommendation/:id/comment', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const inter = await Interraction.findOne({ recommendationId: id });

    if (!inter) {
      return res.status(404).json({ message: "Interaction non trouvée." });
    }

    const index = inter.commentaires.findIndex(
      (c) => c.auteur.toString() === userId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Commentaire non trouvé pour cet utilisateur." });
    }

    inter.commentaires.splice(index, 1);
    await inter.save();

    res.status(200).json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});







module.exports = routerInterractionDetails;


