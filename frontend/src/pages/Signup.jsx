import React, { useState } from 'react';
import '../styles/Login.css';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receiver');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Signup successful! You can now log in.');
        if (onSignup) onSignup();
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="receiver">Receiver</option>
              <option value="institution">Institution</option>
              <option value="verifier">Verifier</option>
            </select>
          </div>
          <button type="submit" className="login-button">Sign Up</button>
        </form>
        <p className="signup-prompt">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
