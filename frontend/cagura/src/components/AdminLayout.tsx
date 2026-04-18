import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar glass-panel">
        <div className="admin-brand">
          <Link to="/">
            <span className="logo-text">CAGURA</span>
            <span className="logo-dot">.</span>
          </Link>
          <span className="admin-badge">ADMIN</span>
        </div>
        
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{user?.name.charAt(0)}</div>
            <div className="admin-user-details">
              <span className="admin-name">{user?.name}</span>
              <span className="admin-role">{user?.role}</span>
            </div>
          </div>
          <Link to="/" className="admin-nav-link store-link">
            <Home size={20} />
            <span>Storefront</span>
          </Link>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="admin-main-content">
        <header className="admin-topbar glass-panel">
          <div className="topbar-search">
            {/* Search or breadcrumbs can go here */}
          </div>
        </header>
        <div className="admin-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
