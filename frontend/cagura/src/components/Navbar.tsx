import { useState } from 'react';
import { ShoppingCart, Search, User, Menu, LogOut, X, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', to: '/', className: 'home-link' },
  { label: 'Categories', to: '/categories' },
  { label: 'Deals', to: '/shop?view=deals' },
  { label: "What's New", to: '/shop?view=new' },
  { label: 'Delivery', to: '/info/delivery' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();



  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(trimmedQuery ? `/shop?search=${encodeURIComponent(trimmedQuery)}` : '/shop');
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (to: string) => {
    if (to.includes('?')) {
      return `${location.pathname}${location.search}` === to;
    }

    return location.pathname === to;
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-promo">
        Free shipping on orders over $100 and easy 30-day returns.
      </div>

      <div className="navbar-main">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">
              <span className="logo-text">CAGURA</span>
              <span className="logo-tag">Everyday Essentials</span>
            </Link>
          </div>

          <div className="navbar-links">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`nav-link ${item.className ?? ''} ${isActiveLink(item.to) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <form onSubmit={handleSearchSubmit} className="search-shell desktop-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search Product"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {isAuthenticated && user?.role === 'Admin' && (
              <Link to="/admin" className="action-link" aria-label="Admin Panel" title="Admin Panel">
                <Shield size={18} />
                <span className="action-label">Admin</span>
              </Link>
            )}

            {isAuthenticated ? (
              <Link to="/profile" className="action-link" aria-label="Profile" title="Profile">
                <User size={18} />
                <span className="action-label">Profile</span>
              </Link>
            ) : (
              <Link to="/login" className="action-link" aria-label="Account" title="Account">
                <User size={18} />
                <span className="action-label">Account</span>
              </Link>
            )}

            <Link to="/cart" className="action-link cart-link" aria-label="Cart" title="Cart">
              <ShoppingCart size={18} />
              <span className="action-label">Cart</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            <button
              className="icon-btn mobile-menu"
              aria-label="Menu"
              title="Menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div>
            <span className="logo-text">CAGURA</span>
            <p className="mobile-drawer-subtitle">Shop the new calm collection</p>
          </div>
          <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="mobile-drawer-content">
          <form onSubmit={handleSearchSubmit} className="search-shell mobile-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Product"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
        </div>

        <div className="mobile-drawer-footer">
          {isAuthenticated && user?.role === 'Admin' && (
            <Link to="/admin" className="mobile-auth-btn" style={{ marginBottom: '10px', background: 'var(--primary)', color: 'white' }} onClick={() => setIsMobileMenuOpen(false)}>
              Admin Panel
            </Link>
          )}
          {isAuthenticated ? (
            <Link to="/profile" className="mobile-auth-btn" onClick={() => setIsMobileMenuOpen(false)}>
              My Profile & Orders
            </Link>
          ) : (
            <Link to="/login" className="mobile-auth-btn" onClick={() => setIsMobileMenuOpen(false)}>
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
