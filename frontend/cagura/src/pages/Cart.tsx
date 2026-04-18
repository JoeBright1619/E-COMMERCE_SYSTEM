import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const { items, totalPrice, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items glass-panel">
          {items.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.product.image} alt={item.product.title} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.product.title}</h3>
                <span className="cart-item-category">{item.product.category}</span>
              </div>
              <div className="cart-item-quantity">
                Qty: {item.quantity}
              </div>
              <div className="cart-item-price">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(item.productId)}
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary glass-panel">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          
          <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight size={20} />
          </button>
          
          {!isAuthenticated && (
            <p className="auth-warning">You will be asked to log in to complete your order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
