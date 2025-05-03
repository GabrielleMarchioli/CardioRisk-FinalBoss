const mongoose = require('mongoose');

const consultaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true,
  },
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medico',
    required: true,
  },
  dataConsulta: {
    type: Date,
    required: true,
    default: Date.now,
  },
  respostasFormulario: {
    sexo: {
      type: String,
      enum: ['M', 'F'],
      required: true,
    },
    idade: {
      type: Number,
      required: true,
      min: 0,
    },
    hdl: {
      type: Number,
      required: true,
      min: 0,
    },
    colesterolTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    sbp: {
      type: Number,
      required: true,
      min: 0,
    },
    sbpTratada: {
      type: String,
      enum: ['sim', 'não'],
      required: true,
    },
    fumante: {
      type: String,
      enum: ['sim', 'não'],
      required: true,
    },
    diabetes: {
      type: String,
      enum: ['sim', 'não'],
      required: true,
    },
  },
  resultadoCalculo: {
    risco: {
      type: String,
      required: true,
    },
    idadeCardio: {
      type: String,
      required: true,
    },
    categoriaRisco: {
      type: String,
      enum: ['RISCO BAIXO', 'RISCO INTERMEDIÁRIO', 'RISCO ALTO', 'RISCO MUITO ALTO'],
      required: true,
    },
    textoRisco: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Consulta', consultaSchema);