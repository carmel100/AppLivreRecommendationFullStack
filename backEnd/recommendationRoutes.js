

 const express = require('express');
const routerRecommendation = express.Router();
const Recommendation = require('./usersBookRecommendation');
 const Interraction = require('./usersInterraction')
const Raitings = require('./Raitings')
const verifyToken = require('./verifyToken');

routerRecommendation.post('/books/recommendation', verifyToken, async (req, res) => {
  try {
    const { Titre, Auteur, Description, Image, Notes, bookId } = req.body;
    const userId = req.user.id;

    let noteFinale;

    const noteExiste = Notes !== undefined && Notes !== null && Notes !== '';
    if (noteExiste && !isNaN(Number(Notes))) {
      noteFinale = Number(Notes);
    } else {
      const ratings = await Raitings.find({ bookId });
      noteFinale = ratings.length > 0
        ? Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
        : null;
    }

    const recommendation = new Recommendation({
      userId,
      Titre,
      Auteur,
      Description,
      Image,
      Notes: noteFinale,
      bookId,
    });

    await recommendation.save();
    res.status(201).json(recommendation);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


// Obtenir les recommandations d’un utilisateur
routerRecommendation.get('/users/:userId/recommendations', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId)
      return res.status(403).json({ message: "Non autorisé à voir ces recommandations." });

    const recommendations = await Recommendation.find({ userId });

    const enriched = await Promise.all(
      recommendations.map(async (rec) => {
        const inter = await Interraction.findOne({ recommendationId: rec._id });

        return {
          ...rec.toObject(),
          likesCount: inter?.likes.length || 0,
          dislikesCount: inter?.dislikes.length || 0,
          abonnementsCount: inter?.abonnés.length || 0
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


routerRecommendation.post('/books/publish/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // On récupère la reco dans Recommendation
    const rec = await Recommendation.findOne({ _id: id, userId: req.user.id });
    if (!rec) {
      return res.status(404).json({ message: 'Recommandation non trouvée ou non autorisée' });
    }

    // ✅ On crée une copie dans Interraction avec le lien vers Recommendation
    const interraction = new Interraction({
      userId: rec.userId,
      Titre: rec.Titre,
      Auteur: rec.Auteur,
      Description: rec.Description,
      Image: rec.Image,
      Notes: rec.Notes,
      recommendationId: rec._id, // ← ajout ici
    });

    await interraction.save();
    res.status(201).json({ message: 'Recommandation publiée avec succès ✅', interraction });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


routerRecommendation.get('/test/interractions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const recommendations = await Interraction.find({ userId: { $ne: userId } })
      .populate('userId', 'prenom nom email')
      .sort({ createdAt: -1 })
      .lean(); // Pour modifier l’objet avant envoi

    if (!recommendations.length) {
      return res.status(404).json({ message: "Aucune recommandation trouvée." });
    }

    const enriched = recommendations.map((rec) => ({
      ...rec,
      likesCount: rec.likes?.length || 0,
      dislikesCount: rec.dislikes?.length || 0,
      abonnementsCount: rec.abonnes?.length || 0,
    }));

    res.json(enriched);
  } catch (error) {
    console.error("Erreur dans /test/interractions:", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
});




// Liker une recommandation
routerRecommendation.post('/books/:id/like', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await Interraction.findById(id);
    if (!post) return res.status(404).json({ message: 'Introuvable' });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter(u => u.toString() !== userId);
    }

    await post.save();
    res.json({ message: '👍 Like enregistré' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Disliker
routerRecommendation.post('/books/:id/dislike', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await Interraction.findById(id);
    if (!post) return res.status(404).json({ message: 'Introuvable' });

    if (!post.dislikes.includes(userId)) {
      post.dislikes.push(userId);
      post.likes = post.likes.filter(u => u.toString() !== userId);
    }

    await post.save();
    res.json({ message: '👎 Dislike enregistré' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});


// S'abonner à un utilisateur
routerRecommendation.post('/test/interractions/:id/abonner', verifyToken, async (req, res) => {
  const recommendationId = req.params.id;
  const userId = req.user.id;

  try {
    // Empêcher un utilisateur de s'abonner à sa propre recommandation
    const reco = await Recommendation.findById(recommendationId);
    if (!reco) return res.status(404).json({ message: "Recommendation introuvable" });
    if (String(reco.userId) === String(userId)) {
      return res.status(400).json({ message: "Tu ne peux pas t'abonner à ta propre recommandation." });
    }

    let interraction = await Interraction.findOne({ recommendationId });

    // Si elle n'existe pas, on la crée avec les bonnes infos de reco
    if (!interraction) {
      interraction = new Interraction({
        recommendationId,
        userId: reco.userId, // pas l'utilisateur qui s'abonne, mais celui qui a publié
        Titre: reco.Titre,
        Auteur: reco.Auteur,
        Description: reco.Description,
        Image: reco.Image,
        Notes: reco.Notes,
        likes: [],
        dislikes: [],
        abonnés: [userId]
      });
    } else {
      // Ajoute seulement si pas déjà présent
      if (!interraction.abonnés.includes(userId)) {
        interraction.abonnés.push(userId);
      }
    }

    await interraction.save();

    res.json({
      message: '✅ Abonné avec succès',
      abonnementsCount: interraction.abonnés.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

/*
routerRecommendation.get('/recommendation/bigview/:id', verifyToken, async (req, res) => {
  try {
    const reco = await Recommendation.findById(req.params.id).populate("userId", "prenom nom");
    if (!reco) return res.status(404).json({ message: "Recommandation introuvable" });

    const inter = await Interraction.findOne({ recommendationId: reco._id });

    res.json({
      ...reco.toObject(),
      likes: inter?.likes || [],
      dislikes: inter?.dislikes || [],
      abonnés: inter?.abonnés || [],
      commentaires: inter?.commentaires || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});*/
/*
routerRecommendation.get('/recommendation/bigview/:id', verifyToken, async (req, res) => {
  try {
    const reco = await Recommendation.findById(req.params.id).populate("userId", "prenom nom");
    if (!reco) return res.status(404).json({ message: "Recommandation introuvable" });

    const inter = await Interraction.findOne({ recommendationId: reco._id }).populate("commentaires.userId", "prenom nom");

    res.json({
      ...reco.toObject(),
      likes: inter?.likes || [],
      dislikes: inter?.dislikes || [],
      abonnés: inter?.abonnés || [],
      commentaires: inter?.commentaires || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});*/

routerRecommendation.get('/recommendation/bigview/:id', verifyToken, async (req, res) => {
  try {
    const reco = await Recommendation.findById(req.params.id).populate("userId", "prenom nom");
    if (!reco) return res.status(404).json({ message: "Recommandation introuvable" });

    const inter = await Interraction.findOne({ recommendationId: reco._id })
                    .populate("commentaires.auteur", "prenom nom");

    res.json({
      ...reco.toObject(),
      likes: inter?.likes || [],
      dislikes: inter?.dislikes || [],
      abonnés: inter?.abonnés || [],
      commentaires: inter?.commentaires || [], // maintenant peuplés avec prénom + nom
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


routerRecommendation.delete('/books/recommendation/:id', verifyToken, async (req, res) => {
  try {
    const recommendationId = req.params.id;

    // Supprimer la recommandation
    const deleted = await Recommendation.findByIdAndDelete(recommendationId);

    if (!deleted) {
      return res.status(404).json({ message: "Recommandation introuvable" });
    }

    // Supprimer aussi les interactions associées (optionnel mais propre)
    await Interraction.deleteMany({ recommendationId });

    res.json({ message: "Recommandation supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


module.exports = routerRecommendation;
