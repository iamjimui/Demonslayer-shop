const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Instancer le JWT
const jwt = require('jsonwebtoken');
// bcrypt concerne l'hashage des mots de passe
const bcrypt = require('bcryptjs');
// require('crypto').randomBytes(64).toString('hex') pour la génération d'un code secret JWT
const SECRET_JWT_CODE = "667877b49c1712be993161c057be1deea8444de1aba2ef13da9e27d2487574d2ad59c82d5fbf8a39df46ea939698fba42c84f22814819c3ff2091ab4e424e770";

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: Number,
    required: true,
    default: 1
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  adresse: {
    type: String,
    required: true
  },
  currencies: {
    type: Number,
    required:true,
    minimum : 0,
    default: 100
  },
  image: {
    type: String,
    default: null
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = mongoose.model('User', UserSchema);