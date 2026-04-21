import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const { items, totalPrice, removeFromCart, updateCartItem } = useCart();
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
            <div key={item.id} className="cart-item">
              <img src={item.productImageUrl || undefined} alt={item.productName} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.productName}</h3>
                {item.productDescription && <span className="cart-item-category">{item.productDescription}</span>}
              </div>
              <div className="cart-item-quantity">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span>Qty: {item.quantity}</span>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="cart-item-price">
                ${item.subtotal.toFixed(2)}
              </div>
              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(item.id)}
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
