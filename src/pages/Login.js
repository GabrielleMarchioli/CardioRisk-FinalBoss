
import React, { useState } from "react";
import "../login.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Apenas frontend, não faz nada
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-header">
          {/* Ícone removido */}
          <h2 className="login-title">Login</h2>
          <p className="login-desc">
            Acesse sua conta para usar o Cardio Check.
          </p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label className="login-label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="login-label" htmlFor="password">
              Senha
            </label>
            <div className="login-input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
                className="login-toggle-btn"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
