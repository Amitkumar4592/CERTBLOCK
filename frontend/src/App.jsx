import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Institution from './pages/Institution';
import Receiver from './pages/Receiver';
import Verifier from './pages/Verifier';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/institution" element={<Institution />} />
      <Route path="/receiver" element={<Receiver />} />
      <Route path="/verifier" element={<Verifier />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;