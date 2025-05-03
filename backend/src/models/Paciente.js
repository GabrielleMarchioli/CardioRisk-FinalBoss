const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  cpf: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  },
  sexo: { type: String, required: true, enum: ['Masculino', 'Feminino'] },
  medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Paciente', pacienteSchema);