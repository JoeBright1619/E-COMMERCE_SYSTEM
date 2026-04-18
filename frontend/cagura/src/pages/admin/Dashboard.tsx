import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  // Hardcoded mock stats for Phase 3 UI demonstration
  const stats = [
    { label: 'Total Revenue', value: '$12,450.00', icon: DollarSign, trend: '+12.5%' },
    { label: 'Total Orders', value: '145', icon: ShoppingBag, trend: '+5.2%' },
    { label: 'Total Customers', value: '89', icon: Users, trend: '+18.1%' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, trend: '+1.1%' },
  ];

  const recentOrders = [
    { id: '1001', customer: 'John Doe', date: '2026-04-18', total: '$349.50', status: 'Pending' },
    { id: '1002', customer: 'Jane Smith', date: '2026-04-17', total: '$189.99', status: 'Shipped' },
    { id: '1003', customer: 'Bob Johnson', date: '2026-04-16', total: '$599.00', status: 'Delivered' },
    { id: '1004', customer: 'Alice Brown', date: '2026-04-15', total: '$299.99', status: 'Processing' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card glass-panel">
            <div className="stat-card-header">
              <span className="stat-label">{stat.label}</span>
              <stat.icon size={20} className="stat-icon" />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-trend">
              <span className="trend-up">{stat.trend}</span> vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="recent-orders glass-panel">
          <h3>Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
