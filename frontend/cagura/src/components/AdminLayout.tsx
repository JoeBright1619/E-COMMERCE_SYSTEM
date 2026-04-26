import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tags, LogOut, Home, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/categories', icon: Tags, label: 'Categories' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
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
              onClick={closeSidebar}
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
          <Link to="/" className="admin-nav-link store-link" onClick={closeSidebar}>
            <Home size={20} />
            <span>Storefront</span>
          </Link>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div
        className={`admin-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        aria-hidden="true"
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
      />

      <main className="admin-main-content">
        <header className="admin-topbar glass-panel">
          <button
            className="admin-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="topbar-search" />
        </header>
        <div className="admin-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
