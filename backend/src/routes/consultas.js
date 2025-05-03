const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Risco = require('../models/Risco');

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

// Middleware pra autenticação
router.use(authMiddleware);

// Endpoint pra contar consultas do dia atual
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await Risco.countDocuments({
      medicoId: req.medico.medicoId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    console.log(`Consultas hoje (${new Date().toISOString()}):`, count);
    res.json({ count });
  } catch (error) {
    console.error('Erro ao buscar consultas do dia:', error);
    res.status(500).json({ message: 'Erro ao buscar consultas' });
  }
});

// Endpoint pra consultas por hora
router.get('/hourly', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Log pra debuggar as consultas antes da agregação
    const consultasDoDia = await Risco.find({
      medicoId: req.medico.medicoId,
      createdAt: { $gte: today, $lt: tomorrow },
    }).select('createdAt');
    console.log(`Consultas encontradas (${new Date().toISOString()}):`, consultasDoDia.map(c => c.createdAt));

    const consultas = await Risco.aggregate([
      {
        $match: {
          medicoId: new mongoose.Types.ObjectId(req.medico.medicoId),
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: '$createdAt',
              unit: 'hour',
              timezone: 'America/Sao_Paulo',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          hora: { $hour: { date: '$_id', timezone: 'America/Sao_Paulo' } },
          count: 1,
          _id: 0,
        },
      },
      { $sort: { hora: 1 } },
    ]);

    console.log(`Consultas por hora (${new Date().toISOString()}):`, consultas);
    res.json(consultas);
  } catch (error) {
    console.error('Erro ao buscar consultas por hora:', error);
    res.status(500).json({ message: 'Erro ao buscar consultas por hora' });
  }
});

module.exports = router;