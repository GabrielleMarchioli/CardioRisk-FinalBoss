const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Paciente = require('../models/Paciente');

// Middleware para verificar o token
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

// Calcular idade a partir da data de nascimento
const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

// Listar pacientes do médico logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const pacientes = await Paciente.find({ medicoId: req.medico.medicoId });
    // Adicionar idade calculada a cada paciente
    const pacientesComIdade = pacientes.map(paciente => ({
      ...paciente._doc,
      idade: calcularIdade(paciente.dataNascimento),
    }));
    res.json(pacientesComIdade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Adicionar paciente
router.post('/', authMiddleware, async (req, res) => {
  const { nome, dataNascimento, cpf, sexo } = req.body;
  // Validar formato do CPF
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpfRegex.test(cpf)) {
    return res.status(400).json({ message: 'CPF inválido. Use o formato XXX.XXX.XXX-XX.' });
  }
  try {
    const paciente = new Paciente({
      nome,
      dataNascimento: new Date(dataNascimento),
      cpf,
      sexo,
      medicoId: req.medico.medicoId,
    });
    await paciente.save();
    // Retornar paciente com idade calculada
    res.status(201).json({
      ...paciente._doc,
      idade: calcularIdade(paciente.dataNascimento),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'CPF já cadastrado.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar paciente
router.put('/:id', authMiddleware, async (req, res) => {
  const { nome, dataNascimento, cpf, sexo } = req.body;
  // Validar formato do CPF, se fornecido
  if (cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return res.status(400).json({ message: 'CPF inválido. Use o formato XXX.XXX.XXX-XX.' });
    }
  }
  try {
    const paciente = await Paciente.findOneAndUpdate(
      { _id: req.params.id, medicoId: req.medico.medicoId },
      { 
        nome, 
        dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined, 
        cpf, 
        sexo 
      },
      { new: true }
    );
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }
    res.json({
      ...paciente._doc,
      idade: calcularIdade(paciente.dataNascimento),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'CPF já cadastrado.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;