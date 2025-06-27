import React, { useEffect, useState } from 'react';
import '../styles/SplashScreen.css';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <h1>Blockchain Certificate System</h1>
      <p>Secure. Transparent. Trustworthy.</p>
    </div>
  );
};

export default SplashScreen;
