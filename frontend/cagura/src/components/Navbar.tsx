import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          CAGURA
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">Products</Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link">Cart</Link>
          </li>
        </ul>

        {/* Auth Links */}
        <div className="nav-auth">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link btn-register">Register</Link>
        </div>
      </div>
    </nav>
  );
}
