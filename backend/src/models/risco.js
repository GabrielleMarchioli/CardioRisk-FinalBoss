const mongoose = require('mongoose');

const riscoSchema = new mongoose.Schema({
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  idade: { type: Number, required: true },
  sexo: { type: String, required: true, enum: ['Masculino', 'Feminino'] },
  colesterolTotal: { type: Number, required: true },
  hdl: { type: Number, required: true },
  pressaoSistolica: { type: Number, required: true },
  tratamentoHipertensao: { type: Boolean, required: true },
  tabagismo: { type: Boolean, required: true },
  diabetes: { type: Boolean, required: true },
  risco: { type: String, required: true },
  medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Risco', riscoSchema);