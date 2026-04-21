import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, User, MapPin } from 'lucide-react';
import api from '../services/api';
import type { OrderResponseDto } from '../types';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = (await api.get('/orders/my')) as unknown as OrderResponseDto[];
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">{user.name.charAt(0)}</div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <span className="role-badge">{user.role}</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar glass-panel">
          <button 
            className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={20} /> Order History
          </button>
          <button 
            className={`profile-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <User size={20} /> Account Details
          </button>
          <button 
            className={`profile-tab ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={20} /> Saved Addresses
          </button>
          <button className="profile-tab logout" onClick={logout}>
            Log Out
          </button>
        </div>

        <div className="profile-main glass-panel">
          {activeTab === 'orders' && (
            <div>
              <h2>Order History</h2>
              <p className="text-secondary mb-4">View your past orders and their status.</p>
              {loading ? (
                <p className="text-secondary">Loading your orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-secondary">You have not placed any orders yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId}>
                        <td>#{order.orderId}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.itemCount}</td>
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
              )}
            </div>
          )}
          
          {activeTab === 'details' && (
            <div>
              <h2>Account Details</h2>
              <div className="form-group mt-4">
                <label>Full Name</label>
                <input type="text" value={user.name} readOnly />
              </div>
              <div className="form-group mt-4">
                <label>Email Address</label>
                <input type="email" value={user.email} readOnly />
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2>Saved Addresses</h2>
              <p className="text-secondary mt-2">No saved addresses yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
