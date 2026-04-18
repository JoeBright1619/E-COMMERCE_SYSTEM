import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {

  // Finding the generated hero bg file in assets dynamically or hardcoding if known.
  // Since Vite bundles from public/assets, we can assume the prefix.
  // We'll look for a hero_bg image
  
  return (
    <section className="hero-section">
      <div className="hero-bg-wrapper">
        <div className="hero-bg-overlay"></div>
        {/* Placeholder for dynamic background image if needed, or handled via CSS */}
      </div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          New Collection 2026
        </div>
        
        <h1 className="hero-title">
          Elevate Your <br />
          <span className="text-gradient">Digital Lifestyle</span>
        </h1>
        
        <p className="hero-subtitle">
          Discover premium electronics and accessories designed for the modern professional. 
          Experience technology that seamlessly integrates into your life.
        </p>
        
        <div className="hero-actions">
          <Link to="/shop" className="btn btn-primary hero-btn" style={{ textDecoration: 'none' }}>
            Shop Now <ArrowRight size={20} className="btn-icon" />
          </Link>
          <a href="#featured" className="btn btn-secondary hero-btn" style={{ textDecoration: 'none' }}>
            View Lookbook
          </a>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">10k+</span>
            <span className="stat-label">Premium Products</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Expert Support</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">4.9</span>
            <span className="stat-label">Customer Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
