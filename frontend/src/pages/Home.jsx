import React from 'react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ fontSize: 60, display: 'block', marginBottom: 16 }}>🎓</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Blockchain Certificate System</h1>
        <p style={{ fontSize: 20, color: '#444', margin: '18px 0 0 0', maxWidth: 600, textAlign: 'center', fontWeight: 400 }}>
          Securely issue, verify, and manage educational certificates on the blockchain.<br />
          Role-based dashboards for Institutions, Receivers, Verifiers, and Admins.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        <a href="/login" style={cardStyle}>Login</a>
        <a href="/signup" style={cardStyle}>Signup</a>
        <a href="/institution" style={cardStyle}>Institution Dashboard</a>
        <a href="/receiver" style={cardStyle}>Receiver Dashboard</a>
        <a href="/verifier" style={cardStyle}>Verifier Page</a>
        <a href="/admin" style={cardStyle}>Admin Dashboard</a>
      </div>
      <footer style={{ marginTop: 56, color: '#888', fontSize: 15, letterSpacing: '.01em', paddingBottom: 20 }}>
        &copy; {new Date().getFullYear()} Blockchain Certificate System
      </footer>
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 2px 12px 0 rgba(44,62,80,0.06)',
  padding: '32px 24px',
  textDecoration: 'none',
  color: '#1a1a1a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'box-shadow 0.2s, transform 0.2s',
  fontWeight: 500,
  minHeight: 80,
  minWidth: 180,
  fontSize: 18,
  cursor: 'pointer',
};
