const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Medico = require('../models/Medico');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

router.post('/register', async (req, res) => {
  const { nome, email, senha, crm } = req.body;
  try {
    let medico = await Medico.findOne({ email });
    if (medico) {
      return res.status(400).json({ message: 'E-mail já registrado' });
    }
    medico = await Medico.findOne({ crm });
    if (medico) {
      return res.status(400).json({ message: 'CRM já registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    medico = new Medico({
      nome,
      email,
      senha: hashedPassword,
      crm,
    });

    await medico.save();

    const payload = { medicoId: medico.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const medico = await Medico.findOne({ email });
    if (!medico) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(senha, medico.senha);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const payload = { medicoId: medico.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const medico = await Medico.findById(req.medico.medicoId).select('-senha'); // Exclui a senha do retorno
    if (!medico) {
      return res.status(404).json({ message: 'Médico não encontrado.' });
    }
    res.json({ medicoId: medico._id, nome: medico.nome }); // Retorna medicoId e nome
  } catch (error) {
    console.error('Erro ao verificar médico:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para "Esqueceu a senha"
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const medico = await Medico.findOne({ email });
    if (!medico) {
      return res.status(400).json({ message: 'E-mail não encontrado' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    medico.resetToken = resetToken;
    medico.resetTokenExpiration = Date.now() + 3600000; // 1 hora de validade
    await medico.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Redefinição de Senha - CardioRisk',
      text: `Clique no link para redefinir sua senha: ${resetLink}\n\nEste link expira em 1 hora.`,
      html: `<p>Clique <a href="${resetLink}">aqui</a> para redefinir sua senha.</p><p>Este link expira em 1 hora.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail de redefinição enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar redefinição:', error);
    res.status(500).json({ message: 'Erro ao enviar e-mail de redefinição' });
  }
});

// Rota para redefinir a senha
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const medico = await Medico.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!medico) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    medico.senha = hashedPassword;
    medico.resetToken = undefined;
    medico.resetTokenExpiration = undefined;
    await medico.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro ao redefinir a senha' });
  }
});

module.exports = router;