import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">CAGURA<span className="logo-dot">.</span></h2>
            <p className="footer-desc">
              Premium electronics and accessories for the modern professional. 
              Elevating your digital lifestyle with every interaction.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Website" onClick={(e) => e.preventDefault()}><Globe size={20} /></a>
              <a href="#" aria-label="Email" onClick={(e) => e.preventDefault()}><Mail size={20} /></a>
              <a href="#" aria-label="Phone" onClick={(e) => e.preventDefault()}><Phone size={20} /></a>
              <a href="#" aria-label="Location" onClick={(e) => e.preventDefault()}><MapPin size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h3 className="footer-title">Shop</h3>
              <ul>
                <li><Link to="/shop?sort=new">New Arrivals</Link></li>
                <li><Link to="/shop">Best Sellers</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/shop?category=Accessories">Accessories</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-col">
              <h3 className="footer-title">Support</h3>
              <ul>
                <li><Link to="/info/support">Help Center</Link></li>
                <li><Link to="/profile">Track Order</Link></li>
                <li><Link to="/info/support">Returns & Exchanges</Link></li>
                <li><Link to="/info/support">Contact Us</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-col">
              <h3 className="footer-title">Company</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/info/careers">Careers</Link></li>
                <li><Link to="/info/privacy">Privacy Policy</Link></li>
                <li><Link to="/info/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CAGURA E-Commerce System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
