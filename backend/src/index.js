const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const medicosRoutes = require('./routes/medicos');
const pacientesRoutes = require('./routes/pacientes');
const riscosRoutes = require('./routes/riscos');
const consultasRoutes = require('./routes/consultas');

require('dotenv').config();

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'https://cardio-risk-final-boss.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas
app.use('/api/medicos', medicosRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/riscos', riscosRoutes);
app.use('/api/consultas', consultasRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Cardiorisk funcionando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));