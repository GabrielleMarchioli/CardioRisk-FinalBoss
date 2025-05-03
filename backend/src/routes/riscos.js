const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Risco = require('../models/risco');

// Middleware pra autenticação
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.medico = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

// POST - Criar um novo cálculo de risco
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      pacienteId,
      idade,
      sexo,
      colesterolTotal,
      hdl,
      pressaoSistolica,
      tratamentoHipertensao,
      tabagismo,
      diabetes,
      risco,
    } = req.body;

    const novoRisco = new Risco({
      medicoId: req.medico.medicoId, // Adicionando o medicoId do token
      pacienteId,
      idade,
      sexo,
      colesterolTotal,
      hdl,
      pressaoSistolica,
      tratamentoHipertensao,
      tabagismo,
      diabetes,
      risco,
    });

    await novoRisco.save();
    res.status(201).json(novoRisco);
  } catch (error) {
    console.error("Erro ao salvar risco:", error);
    res.status(500).json({ message: 'Erro ao salvar cálculo de risco', error: error.message });
  }
});

// GET - Buscar cálculos de risco por paciente
router.get('/paciente/:pacienteId', authMiddleware, async (req, res) => {
  try {
    const riscos = await Risco.find({
      medicoId: req.medico.medicoId,
      pacienteId: req.params.pacienteId,
    }).sort({ createdAt: -1 });
    res.json(riscos);
  } catch (error) {
    console.error("Erro ao buscar riscos:", error);
    res.status(500).json({ message: 'Erro ao buscar cálculos de risco' });
  }
});

module.exports = router;