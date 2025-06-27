import React from 'react';
import '../styles/Dashboard.css';

const VerifierDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Verifier Dashboard</h1>
      <div className="dashboard-welcome">
        <p>Welcome! Verify the authenticity of certificates here.</p>
      </div>
      <div className="dashboard-actions">
        <div className="action-card">
          <h2>Verify Certificate</h2>
          <p>Enter a certificate code to check its authenticity.</p>
          <button>Verify Now</button>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;
