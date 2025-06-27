import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InstitutionDashboard from './pages/InstitutionDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import VerifierDashboard from './pages/VerifierDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash if not already shown in this tab session
    return sessionStorage.getItem('splashShown') !== 'true';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (showSplash) {
      timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 3000);
    }

    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }

    return () => clearTimeout(timer);
  }, [showSplash]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    // Redirect to appropriate dashboard based on role
    switch(userData.role) {
      case 'institution':
        navigate('/institution', { replace: true });
        break;
      case 'receiver':
        navigate('/receiver', { replace: true });
        break;
      case 'verifier':
        navigate('/verifier', { replace: true });
        break;
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="app-container">
      <Navbar isLoggedIn={isLoggedIn} role={user?.role} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={() => navigate('/login', { replace: true })} />} />
        <Route path="/institution" element={isLoggedIn && user?.role === 'institution' ? <InstitutionDashboard /> : <Login onLogin={handleLogin} />} />
        <Route path="/receiver" element={isLoggedIn && user?.role === 'receiver' ? <ReceiverDashboard /> : <Login onLogin={handleLogin} />} />
        <Route path="/verifier" element={isLoggedIn && user?.role === 'verifier' ? <VerifierDashboard /> : <Login onLogin={handleLogin} />} />
        <Route path="/admin" element={isLoggedIn && user?.role === 'admin' ? <AdminDashboard /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;
