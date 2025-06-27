import React from 'react';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-welcome">
        <p>Welcome, Administrator! Manage the entire system from here.</p>
      </div>
      <div className="dashboard-actions">
        <div className="action-card">
          <h2>Manage Users</h2>
          <p>View, edit roles, or delete user accounts.</p>
          <button>Manage Users</button>
        </div>
        <div className="action-card">
          <h2>View All Certificates</h2>
          <p>See every certificate in the system.</p>
          <button>View Certificates</button>
        </div>
        <div className="action-card">
          <h2>System Settings</h2>
          <p>Configure system-wide settings and policies.</p>
          <button>Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
