import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import './Checkout.css';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await orderService.create();
      clearCart();
      toast.success('Order placed successfully!');
      setStep(3); // Success step
    } catch (error) {
      console.error('Order failed', error);
      toast.error('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="checkout-page success">
        <div className="glass-panel success-panel">
          <CheckCircle size={64} className="success-icon" />
          <h2>Order Confirmed!</h2>
          <p>Thank you for shopping with CAGURA. Your order has been placed successfully.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/profile')}>
            View Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <span className={step >= 1 ? 'active' : ''}>1. Shipping</span>
          <span className="step-divider"></span>
          <span className={step >= 2 ? 'active' : ''}>2. Payment</span>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form glass-panel">
          {step === 1 ? (
            <div className="shipping-form">
              <h3>Shipping Address</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label>Address Line 1</label>
                <input type="text" placeholder="123 Tech Street" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="Silicon Valley" />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input type="text" placeholder="94025" />
                </div>
              </div>
              <button className="btn btn-primary mt-4 w-100" onClick={() => setStep(2)}>
                Continue to Payment
              </button>
            </div>
          ) : (
            <div className="payment-form">
              <h3>Payment Information</h3>
              <p className="text-secondary mb-4">This is a mock checkout. No real card needed.</p>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>
              <div className="checkout-actions mt-4">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary glass-panel">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.productImageUrl || undefined} alt={item.productName} />
                <div className="summary-item-info">
                  <h4>{item.productName}</h4>
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="summary-item-price">
                  ${item.subtotal.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="summary-row total mt-4">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
