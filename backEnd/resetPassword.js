// routes/reset.js
const express = require("express");
const routerResetPassword = express.Router();
const User = require("./user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
  dotenv.config()

routerResetPassword.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600000; // 1h
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_MAIL ,
      pass: process.env.PASSWORD_MAIL
    }
  });

  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


  const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
  ;

  await transporter.sendMail({
    from: `"Books ?" <${process.env.EMAIL_MAIL}>`,
    to: user.email,
    subject: "Réinitialisation de mot de passe",
    html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">${resetLink}</a>`
  });

  res.json({ message: "Email de réinitialisation envoyé !" });
});


routerResetPassword.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { nouveauMotDePasse } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

  user.motdepasse = nouveauMotDePasse;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();
  res.json({ message: "Mot de passe réinitialisé avec succès" });
});

  module.exports = routerResetPassword