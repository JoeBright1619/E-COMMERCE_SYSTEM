import { useState } from 'react';
import { ShoppingCart, Search, User, Menu, LogOut, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-text">CAGURA</span>
            <span className="logo-dot">.</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        <div className="navbar-actions">
          <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
            </form>
            <button 
              className="icon-btn" 
              aria-label="Search"
              title="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>
          </div>
          <button className="icon-btn" aria-label="Account" title="Account" onClick={handleAuthAction}>
            {isAuthenticated ? <LogOut size={20} /> : <User size={20} />}
          </button>
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart" title="Cart">
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          <button 
            className="icon-btn mobile-menu" 
            aria-label="Menu"
            title="Menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="logo-text">CAGURA</span>
          <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="mobile-drawer-content">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link to="/categories" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
        </div>
        <div className="mobile-drawer-footer">
          <button className="mobile-auth-btn" onClick={() => {
            setIsMobileMenuOpen(false);
            handleAuthAction();
          }}>
            {isAuthenticated ? 'Logout' : 'Login / Register'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
