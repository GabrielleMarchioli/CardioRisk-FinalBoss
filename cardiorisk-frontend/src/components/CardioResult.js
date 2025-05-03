import React from 'react';
import '../global.css';

const CardioResult = () => {
  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="form-container">
        <p className="form-description">Seu risco cardiovascular é de X%.</p>
      </div>

      <div className="form-container">
        <p className="form-description">A idade do seu coração é X anos.</p>
      </div>

      <div className="form-container" style={{ backgroundColor: '#dbeafe' }}>
        <p style={{ textAlign: 'center', fontWeight: 500 }}>Categoria: RISCO X</p>
      </div>

      <div className="form-container" style={{ backgroundColor: '#dcfce7' }}>
        <p style={{ textAlign: 'center', fontSize: '14px' }}>ERG menor que X% em homens ou mulheres.</p>
      </div>
    </div>
  );
};

export default CardioResult;
