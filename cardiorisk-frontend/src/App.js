import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/dashboard";
import Pacientes from "./pages/pacientes";
import CalcularRisco from "./pages/calcularRisco"
import Paciente from "./pages/pacientes"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Calcular-Risco" element={<CalcularRisco />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<Paciente />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;