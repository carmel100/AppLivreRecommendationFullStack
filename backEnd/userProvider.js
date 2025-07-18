
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  googleId: String,
 githubId: String,
   microsoftId: String,
  prenom: String,  // 👈 à ajouter
  nom: String      // 👈 à ajouter
});

module.exports = mongoose.model('usersProvider', userSchema);