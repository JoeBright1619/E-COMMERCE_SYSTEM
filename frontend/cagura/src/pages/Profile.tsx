import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, User, MapPin, Star, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService } from '../services/orderService';
import { reviewService } from '../services/reviewService';
import type { OrderResponseDto, ReviewResponseDto } from '../types';
import ReviewModal from '../components/ReviewModal';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<ReviewResponseDto | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === 'reviews') {
      const fetchReviews = async () => {
        try {
          const data = await reviewService.getMine();
          setReviews(data);
        } catch (error) {
          console.error('Failed to load reviews:', error);
        }
      };
      fetchReviews();
    }
  }, [activeTab]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (editingReview) {
      await reviewService.update(editingReview.reviewId, { rating, comment });
      toast.success('Review updated!');
      const data = await reviewService.getMine();
      setReviews(data);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await reviewService.remove(reviewId);
      const data = await reviewService.getMine();
      setReviews(data);
      toast.success('Review deleted');
    }
  };

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
            className={`profile-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={20} /> My Reviews
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
                <div style={{ overflowX: 'auto' }}>
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
                </div>
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

          {activeTab === 'reviews' && (
            <div>
              <h2>My Reviews</h2>
              <p className="text-secondary mb-4">Manage the reviews you've left for products.</p>
              {reviews.length === 0 ? (
                <p className="text-secondary">You haven't reviewed any products yet.</p>
              ) : (
                <div className="detail-reviews-list mt-4">
                  {reviews.map(review => (
                    <div key={review.reviewId} className="review-item glass-panel">
                      <div className="flex-between mb-sm">
                        <div>
                          <strong>{review.productName}</strong>
                          <div className="flex-align-center gap-sm mt-1">
                            <span className="detail-stars detail-stars-sm">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  fill={star <= review.rating ? '#f4b740' : 'transparent'}
                                  color={star <= review.rating ? '#f4b740' : '#d8ccbf'}
                                />
                              ))}
                            </span>
                            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {review.productImageUrl && (
                          <img src={review.productImageUrl} alt={review.productName} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                        )}
                      </div>
                      <p className="review-item-comment mt-3">{review.comment}</p>
                      <div className="review-item-actions mt-3 flex-align-center gap-sm">
                        <button className="icon-btn text-secondary" onClick={() => { setEditingReview(review); setIsReviewModalOpen(true); }} aria-label="Edit review">
                          <Edit2 size={16} /> Edit
                        </button>
                        <button className="icon-btn" style={{ color: 'var(--accent-red)' }} onClick={() => handleDeleteReview(review.reviewId)} aria-label="Delete review">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setEditingReview(null);
        }}
        onSubmit={handleReviewSubmit}
        productName={editingReview?.productName || 'Product'}
        initialData={editingReview || undefined}
      />
    </div>
  );
};

export default Profile;
