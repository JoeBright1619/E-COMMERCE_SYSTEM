import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: About */}
        <div className="footer-section">
          <h4>CAGURA</h4>
          <p>Premium online shopping platform offering quality products and exceptional service to customers worldwide.</p>
        </div>

        {/* Column 2: Navigation */}
        <div className="footer-section">
          <h4>NAVIGATION</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div className="footer-section">
          <h4>SUPPORT</h4>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#privacy">Privacy</a></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-section">
          <h4>CONTACT</h4>
          <p>support@cagura.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} CAGURA. All rights reserved.</p>
      </div>
    </footer>
  );
}
