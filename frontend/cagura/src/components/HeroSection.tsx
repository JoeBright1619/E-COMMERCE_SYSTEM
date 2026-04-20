import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-eyebrow">New Season — Now Live</p>
          <h1 className="hero-title">
            Feel Good<br />in Everything<br /><span className="text-gradient">You Wear.</span>
          </h1>
          <p className="hero-subtitle">
            Premium products made for modern living — crafted with comfort, quality, and sustainability at the core.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary hero-btn">
              Shop Now <ArrowRight size={18} className="btn-icon" />
            </Link>
            <Link to="/about" className="hero-link">
              Our Story →
            </Link>
          </div>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-img-card">
            <img src="/assets/hero_bg_1776466872038.png" alt="Hero product" className="hero-img" />
          </div>
          <div className="hero-float-badge">
            <span className="hero-float-label">Free shipping</span>
            <span className="hero-float-sub">on orders over $100</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
