import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { orderService } from '../../services/orderService';
import type { OrderResponseDto, UpdateStatusDto } from '../../types';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 10;

const ManageOrders = () => {
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const payload: UpdateStatusDto = { status: newStatus };
      await orderService.updateStatus(id, payload);
      setOrders(orders.map(o => o.orderId === id ? { ...o, status: newStatus } : o));
      toast.success(`Order #${id} marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Manage Orders</h2>
      </div>

      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(order => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>
                    <div>{order.customerName}</div>
                    {order.shippingAddress && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.shippingAddress}</div>
                    )}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.itemCount}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.15)', cursor: 'pointer' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={orders.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManageOrders;
