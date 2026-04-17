import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: About */}
        <div className="footer-section">
          <h4>About CAGURA</h4>
          <p>Your trusted online shopping destination for quality products at great prices.</p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@cagura.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <div className="social-links">
            <a href="#facebook" aria-label="Facebook">f</a>
            <a href="#twitter" aria-label="Twitter">𝕏</a>
            <a href="#instagram" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} CAGURA. All rights reserved.</p>
      </div>
    </footer>
  );
}
