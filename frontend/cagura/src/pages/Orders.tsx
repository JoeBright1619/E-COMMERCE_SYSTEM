import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, ShoppingBag, MapPin, CreditCard, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService } from '../services/orderService';
import type { OrderResponseDto } from '../types';
import './Orders.css';

const STATUS_CLASS: Record<string, string> = {
  pending: 'status-pending',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    orderService.getMyOrders()
      .then(data => setOrders(data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  const handleCancel = async (orderId: number) => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    setCancelling(orderId);
    try {
      await orderService.cancel(orderId);
      setOrders(prev =>
        prev.map(o => o.orderId === orderId ? { ...o, status: 'Cancelled' } : o)
      );
      toast.success('Order cancelled');
    } catch {
      toast.error('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <p className="orders-loading">Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="orders-title-row">
          <Package size={26} />
          <h1>My Orders</h1>
        </div>
        <p className="orders-subtitle">Track and manage your purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <ShoppingBag size={56} />
          <h3>No orders yet</h3>
          <p>When you place an order, it will appear here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const isExpanded = expandedId === order.orderId;
            const isPending = order.status.toLowerCase() === 'pending';

            return (
              <div key={order.orderId} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                <button
                  className="order-card-header"
                  onClick={() => toggle(order.orderId)}
                  aria-expanded={isExpanded}
                >
                  <div className="order-header-left">
                    <span className="order-id">Order #{order.orderId}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <span className={`status-badge ${STATUS_CLASS[order.status.toLowerCase()] ?? ''}`}>
                      {order.status}
                    </span>
                    <span className="order-total">${order.totalAmount.toFixed(2)}</span>
                    <span className="order-item-count">
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="order-card-body">
                    <div className="order-details-grid">
                      <div className="order-items-section">
                        <h4>Items ordered</h4>
                        <div className="order-items">
                          {order.items.map((item, i) => (
                            <div key={i} className="order-item-row">
                              <span className="order-item-name">{item.productName}</span>
                              <span className="order-item-qty">× {item.quantity}</span>
                              <span className="order-item-price">${item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="order-items-total">
                            <span>Total</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="order-info-section">
                        {order.shippingAddress && (
                          <div className="order-info-row">
                            <MapPin size={15} className="info-icon" />
                            <div>
                              <span className="info-label">Shipping address</span>
                              <p className="info-value">{order.shippingAddress}</p>
                            </div>
                          </div>
                        )}
                        {order.paymentMethod && (
                          <div className="order-info-row">
                            <CreditCard size={15} className="info-icon" />
                            <div>
                              <span className="info-label">Payment method</span>
                              <p className="info-value">{order.paymentMethod}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {isPending && (
                      <div className="order-card-footer">
                        <button
                          className="btn-cancel-order"
                          onClick={() => handleCancel(order.orderId)}
                          disabled={cancelling === order.orderId}
                        >
                          <X size={14} />
                          {cancelling === order.orderId ? 'Cancelling…' : 'Cancel Order'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
