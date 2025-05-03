const mongoose = require('mongoose');

const medicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  crm: {
    type: String,
    required: true,
    unique: true,
  },
  resetToken: String, // Token de redefinição
  resetTokenExpiration: Date, // Data de expiração do token
});

module.exports = mongoose.model('Medico', medicoSchema);