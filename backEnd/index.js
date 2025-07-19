require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

// Initialisation Passport
require('./googleAuth');
require('./microsoftAuth');
require('./githubAuth');

// Routers
const authRouter = require('./auth');
const registerRouter = require('./register');
const routeProtected = require('./protected');
const providerGoogleRoute = require('./routeGoogleProvider');
const providerMicrosoftRoute = require('./routeMicrosoftProvder');
const providerGithubRoute = require('./routeGithubProvider');
const routerBook = require('./routesBook');
const routerRecommendation = require('./recommendationRoutes');
const logoutConnect = require('./lougout');
const routerResetPassword = require('./resetPassword');
const connexion = require('./connexion');
const ratingRoutes = require('./booksRaitings');
const routerInterractionDetails = require('./routerInterraction');
//const helmet = require("helmet");
//const compression = require("compression");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(helmet());
//app.use(compression());
// Connexion DB
connexion();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://applivrerecommendationfullstack.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/*
app.use(cors({
  origin: function (origin, callback) {
    // Accepte les requêtes sans origin (comme Postman) ou si l’origine est autorisée
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));*/

app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions"
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 // 1 jour
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes backend
app.use(authRouter);
app.use(registerRouter);
app.use(routeProtected);
app.use('/auth', providerGoogleRoute);
app.use('/auth', providerMicrosoftRoute);
app.use('/auth', providerGithubRoute);
app.use('/api', routerBook);
app.use(routerRecommendation);
app.use(logoutConnect);
app.use('/auth', routerResetPassword);
app.use(ratingRoutes);
app.use('/', routerInterractionDetails);

// 👉 Sert le frontend React buildé
app.use(express.static(path.join(__dirname, '../frontEnd/react', 'dist')));

// 👉 Catch-all pour React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontEnd/react', 'dist', 'index.html'));
});

// Lancement serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
