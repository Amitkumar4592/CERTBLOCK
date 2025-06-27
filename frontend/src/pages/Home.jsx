import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Blockchain Certificate Verification System</h1>
        <p>Secure, transparent, and tamper-proof certificate management using blockchain technology.</p>
        <a href="/login" className="cta-button">Get Started</a>
      </section>
      
      <section className="about">
        <h2>About the Project</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Our Blockchain Certificate Verification System revolutionizes how educational and professional certificates are issued, stored, and verified. 
              By leveraging blockchain technology, we ensure that certificates are immutable, transparent, and verifiable by authorized parties.
            </p>
            <p>
              Institutions can issue certificates directly to receivers, who can then share verification codes with third parties. 
              Verifiers can instantly check the authenticity of any certificate without needing to contact the issuing authority.
            </p>
          </div>
          <div className="about-features">
            <div className="feature-card">
              <h3>Secure Storage</h3>
              <p>Certificates are stored on IPFS and referenced on the blockchain, ensuring they can't be altered.</p>
            </div>
            <div className="feature-card">
              <h3>Instant Verification</h3>
              <p>Anyone can verify a certificate's authenticity using a unique code.</p>
            </div>
            <div className="feature-card">
              <h3>Role-based Access</h3>
              <p>Different dashboards for institutions, receivers, verifiers, and administrators.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
