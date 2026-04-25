import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import api from '../../services/api';
import { reportService } from '../../services/reportService';
import type { DashboardStatsDto, OrderResponseDto, OrderSummaryReportDto } from '../../types';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [summary, setSummary] = useState<OrderSummaryReportDto | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [dashboardStats, orders, orderSummary] = await Promise.all([
          reportService.getDashboardStats(),
          api.get('/orders') as Promise<OrderResponseDto[]>,
          reportService.getOrderSummary(),
        ]);

        setStats(dashboardStats);
        setRecentOrders(orders.slice(0, 5));
        setSummary(orderSummary);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleSummaryRefresh = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setReportLoading(true);
      const orderSummary = await reportService.getOrderSummary(startDate || undefined, endDate || undefined);
      setSummary(orderSummary);
    } catch (error) {
      console.error('Failed to load report summary:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const statCards = stats
    ? [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign },
        { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag },
        { label: 'Total Customers', value: stats.totalCustomers.toString(), icon: Users },
        { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package },
      ]
    : [];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
        <p>Live store metrics and reporting pulled from the backend API.</p>
      </div>

      {loading ? (
        <div className="glass-panel recent-orders">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map((stat) => (
              <div key={stat.label} className="stat-card glass-panel">
                <div className="stat-card-header">
                  <span className="stat-label">{stat.label}</span>
                  <stat.icon size={20} className="stat-icon" />
                </div>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="dashboard-content">
            <div className="recent-orders glass-panel">
              <div className="dashboard-section-header">
                <h3>Recent Orders</h3>
                <p className="text-secondary">Latest platform orders from the live orders endpoint.</p>
              </div>

              <div style={{ overflowX: 'auto' }}>
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
                    <tr key={order.orderId}>
                      <td>#{order.orderId}</td>
                      <td>{order.customerName}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
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

            <div className="recent-orders glass-panel">
              <div className="dashboard-section-header">
                <h3>Order Summary</h3>
                <p className="text-secondary">Filter revenue and order activity by date range.</p>
              </div>

              <form className="report-filter-form" onSubmit={handleSummaryRefresh}>
                <label>
                  <span>From</span>
                  <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                </label>
                <label>
                  <span>To</span>
                  <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                </label>
                <button type="submit" className="btn btn-primary" disabled={reportLoading}>
                  {reportLoading ? 'Loading...' : 'Apply'}
                </button>
              </form>

              {summary && (
                <>
                  <div className="summary-metrics">
                    <div className="summary-metric">
                      <span>Total Orders</span>
                      <strong>{summary.totalOrders}</strong>
                    </div>
                    <div className="summary-metric">
                      <span>Total Revenue</span>
                      <strong>${summary.totalRevenue.toFixed(2)}</strong>
                    </div>
                    <div className="summary-metric">
                      <span>Average Order Value</span>
                      <strong>${summary.averageOrderValue.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="dashboard-two-column">
                    <div>
                      <h4>Status Breakdown</h4>
                      <ul className="dashboard-list">
                        {summary.ordersByStatus.map((status) => (
                          <li key={status.status}>
                            <span>{status.status}</span>
                            <strong>{status.count}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4>Top Products</h4>
                      <ul className="dashboard-list">
                        {stats?.topProducts.map((product) => (
                          <li key={product.productName}>
                            <span>{product.productName}</span>
                            <strong>{product.quantitySold} sold</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="daily-summary">
                    <h4>Daily Summary</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Orders</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.dailySummary.map((day) => (
                            <tr key={day.date}>
                              <td>{new Date(day.date).toLocaleDateString()}</td>
                              <td>{day.orderCount}</td>
                              <td>${day.revenue.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
