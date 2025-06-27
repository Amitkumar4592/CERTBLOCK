import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isLoggedIn, role, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'q') {
      event.preventDefault();
      toggleDarkMode();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDarkMode]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">CertiChain</Link>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        {!isLoggedIn ? (
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
        ) : (
          <>
            <Link to={getDashboardRoute(role)}
              className="dashboard-link"
              onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="logout-button">Logout</button>
          </>
        )}
        <div className="dark-mode-switch" onClick={toggleDarkMode}>
          <div className={`switch-slider ${isDarkMode ? 'dark' : ''}`}></div>
          <span className="switch-label">{isDarkMode ? 'Dark' : 'Light'}</span>
        </div>
      </div>
    </nav>
  );
};

const getDashboardRoute = (role) => {
  switch(role) {
    case 'institution':
      return '/institution';
    case 'receiver':
      return '/receiver';
    case 'verifier':
      return '/verifier';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
};

export default Navbar;
