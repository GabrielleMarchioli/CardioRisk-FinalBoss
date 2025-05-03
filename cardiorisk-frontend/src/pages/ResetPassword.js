import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/medicos/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Senha redefinida com sucesso! Redirecionando para o login...");
        setTimeout(() => navigate("/login"), 3000); // Redireciona após 3 segundos
      } else {
        setError(data.message || "Erro ao redefinir a senha");
      }
    } catch (error) {
      console.error("Erro na requisição de redefinição:", error);
      setError("Erro ao conectar ao servidor para redefinir a senha");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-green-100">
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 bg-white">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h1 className="text-3xl lg:text-4xl font-bold text-green-700 mb-4">
            Redefina sua senha!
          </h1>
          <p className="text-gray-600 text-lg">
            Crie uma nova senha segura para acessar o CardioRisk.
          </p>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center p-8 lg:p-12 bg-green-200">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">CardioRisk</h2>
          </div>
          <h3 className="text-xl font-medium text-gray-700 text-center mb-6">Redefinir Senha</h3>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
          {message && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <input
                id="newPassword"
                type="password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Insira a nova senha"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Redefinir Senha
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Lembrou a senha?{" "}
            <Link to="/login" className="text-green-500 hover:underline">
              Volte ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}