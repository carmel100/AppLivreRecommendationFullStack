const express = require('express');
const router = express.Router();
const verifierToken = require('./verifyToken');

router.get('/protected', verifierToken, (req, res) => {
  res.status(200).json({ message: `Bienvenue ${req.user.email}` });
});

module.exports = router;
