 
 const mongoose = require('mongoose')
 const dotenv = require('dotenv')

 dotenv.config()


const connexion = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    process.exit(1); // Stoppe l'app si la BDD échoue
  }
};

module.exports = connexion;


