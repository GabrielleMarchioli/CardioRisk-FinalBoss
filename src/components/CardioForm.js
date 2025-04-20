import React, { useState } from 'react';
import '../global.css';

export const CardioForm = () => {
    const [gender, setGender] = useState('masculino');

    const handleSubmit = (e) => {
      e.preventDefault();

    };
  
    return (<div className="form-container">
        <div className="form-header">
          <h2 className="form-title">Cardio Check</h2>
          <button className="button button-outline">Limpar formulário</button>
        </div>
  
        <form onSubmit={handleSubmit}>
          <p className="form-description">
            Insira os Dados Abaixo para Avaliar o Risco Cardiovascular e a Idade do Coração:
          </p>
  
          <div className="form-group">
            <label className="label">Sexo</label>
            <div className="gender-buttons">
              <button
                type="button"
                className={`button ${gender === 'masculino' ? 'button-male button-selected' : ''}`}
                onClick={() => setGender('masculino')}
              >
                Masculino
              </button>
              <button
                type="button"
                className={`button ${gender === 'feminino' ? 'button-female button-selected' : ''}`}
                onClick={() => setGender('feminino')}
              >
                Feminino
              </button>
            </div>
          </div>
  
          <div className="form-group">
            <label className="label">Idade</label>
            <input type="number" min="0" className="input" placeholder="Digite sua idade" />
          </div>
  
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label">HDL</label>
              <button className="help-text">O que é HDL?</button>
            </div>
            <div className="input-with-unit">
              <input type="number" min="0" className="input" placeholder="Digite seu HDL" />
              <span className="unit-label">mg/dL</span>
            </div>
          </div>
  
          <div className="form-group">
            <label className="label">Colesterol Total</label>
            <div className="input-with-unit">
              <input type="number" min="0" className="input" placeholder="Digite seu colesterol total" />
              <span className="unit-label">mg/dL</span>
            </div>
          </div>
  
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label">Pressão Arterial Sistólica</label>
              <button className="help-text">O que é PAS?</button>
            </div>
            <input type="number" min="0" className="input" placeholder="Digite sua pressão sistólica" />
          </div>
  
          <div className="form-group">
            <label className="label">Pressão Tratada</label>
            <div className="yes-no-buttons">
              <button type="button" className="button button-outline">Sim</button>
              <button type="button" className="button button-outline">Não</button>
            </div>
          </div>
  
          <div className="form-group">
            <label className="label">Tabagista</label>
            <div className="yes-no-buttons">
              <button type="button" className="button button-outline">Sim</button>
              <button type="button" className="button button-outline">Não</button>
            </div>
          </div>
  
          <div className="form-group">
            <label className="label">Diabético</label>
            <div className="yes-no-buttons">
              <button type="button" className="button button-outline">Sim</button>
              <button type="button" className="button button-outline">Não</button>
            </div>
          </div>
  
          <button type="submit" className="button button-primary button-full">
            Calcular
          </button>
        </form>
      </div>
    );
};
  
export default CardioForm;
  