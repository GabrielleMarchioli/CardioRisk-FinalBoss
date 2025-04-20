
import React from 'react';

const Index = () => {
  return (
    <div className="form-container">
      <h1 className="form-title">Bem-vindo ao CardioRisk</h1>
      <p className="form-description">Uma ferramenta para avaliar seu risco cardiovascular</p>
      <a href="/cardio-check" className="button button-primary" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
        Iniciar avaliação
      </a>
    </div>
  );
};

export default Index;