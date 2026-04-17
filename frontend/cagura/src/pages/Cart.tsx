import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Cart.css';

export function Cart() {
  const navigate = useNavigate();
  const { cart, isLoading, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <div className="cart-empty-state">
          <h1>Please Log In</h1>
          <p>You need to be logged in to view your cart.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            GO TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty-state">
          <h1>Your Cart is Empty</h1>
          <p>Add some products to get started!</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">SHOPPING CART</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.cartItemId} className="cart-item">
                <div className="cart-item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} />
                  ) : (
                    <div className="image-placeholder"></div>
                  )}
                </div>

                <div className="cart-item-details">
                  <h3>{item.productName}</h3>
                  <p className="item-price">${item.unitPrice.toFixed(2)}</p>
                </div>

                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))} disabled={isLoading}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} disabled={isLoading}>
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  <p className="subtotal">${item.subtotal.toFixed(2)}</p>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.cartItemId)}
                  disabled={isLoading}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>ORDER SUMMARY</h2>

            <div className="summary-row">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>${cart.cartTotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>TOTAL</span>
              <span>${cart.cartTotal.toFixed(2)}</span>
            </div>

            <button className="checkout-button" onClick={handleCheckout}>
              PROCEED TO CHECKOUT
            </button>

            <button className="continue-shopping-button" onClick={() => navigate('/products')}>
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
