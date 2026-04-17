import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          CAGURA
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">HOME</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">PRODUCTS</Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link">CART</Link>
          </li>
        </ul>

        {/* Auth Links */}
        <div className="nav-auth">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link btn-register">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
