import React from 'react';
import '../styles/Dashboard.css';

const ReceiverDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Receiver Dashboard</h1>
      <div className="dashboard-welcome">
        <p>Welcome! View and manage your received certificates here.</p>
      </div>
      <div className="dashboard-actions">
        <div className="action-card">
          <h2>My Certificates</h2>
          <p>View all certificates issued to you.</p>
          <button>View List</button>
        </div>
        <div className="action-card">
          <h2>Download Certificate</h2>
          <p>Download your certificate files.</p>
          <button>Download</button>
        </div>
        <div className="action-card">
          <h2>Share Verification</h2>
          <p>Share a verification code with others to prove authenticity.</p>
          <button>Share Code</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
