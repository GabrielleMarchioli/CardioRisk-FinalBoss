import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Iniciando login com:", { email, password });
    try {
      const response = await fetch("http://localhost:5000/api/medicos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });
      const data = await response.json();
      console.log("Resposta do backend:", data, "Status:", response.status);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log("Token salvo no localStorage:", data.token);
        navigate("/dashboard", { replace: true });
      } else {
        setError(data.message || "Erro ao fazer login");
        console.log("Erro retornado:", data.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      if (error.name === "TypeError") {
        setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      } else {
        setError("Erro na conexão com o servidor");
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/medicos/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setForgotMessage("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
        setForgotEmail("");
      } else {
        setError(data.message || "Erro ao solicitar redefinição de senha");
      }
    } catch (error) {
      console.error("Erro na requisição de redefinição:", error);
      setError("Erro ao conectar ao servidor para redefinição de senha");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-green-100">
      {/* Lado esquerdo - Texto e ícone */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 bg-white">
        <div className="text-center">
          {/* Ícone de coração */}
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
            Gerencie a saúde dos seus pacientes!
          </h1>
          <p className="text-gray-600 text-lg">
            Acesse o CardioRisk e acompanhe tudo em um só lugar.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
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
          <h3 className="text-xl font-medium text-gray-700 text-center mb-6">Entre</h3>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insira sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Entrar
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-green-500 hover:underline">
              Registre-se
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link to="/forgot-password" className="text-green-500 hover:underline">
              Esqueceu a senha?
            </Link>
          </p>
          {forgotMessage && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-md">
              {forgotMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}