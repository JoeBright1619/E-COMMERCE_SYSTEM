import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, CreditCard, Smartphone, DollarSign, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import './Checkout.css';

type PaymentMethod = 'card' | 'mobile_money' | 'paypal' | 'cod';
type MomoNetwork = 'MTN' | 'Airtel';

interface ShippingForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface CardForm {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface MomoForm {
  network: MomoNetwork;
  phone: string;
}

const detectCardBrand = (num: string): string => {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return '';
};

const formatCardNumber = (val: string): string =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (val: string): string => {
  const d = val.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: '', lastName: '', address: '', city: '', zipCode: '', country: 'Rwanda',
  });

  const [card, setCard] = useState<CardForm>({
    cardHolder: '', cardNumber: '', expiry: '', cvv: '',
  });

  const [momo, setMomo] = useState<MomoForm>({ network: 'MTN', phone: '' });

  const shippingAddress = `${shipping.firstName} ${shipping.lastName}, ${shipping.address}, ${shipping.city} ${shipping.zipCode}, ${shipping.country}`.trim();

  const validateShipping = (): boolean => {
    if (!shipping.firstName.trim() || !shipping.lastName.trim() || !shipping.address.trim() || !shipping.city.trim()) {
      toast.error('Please fill in all required shipping fields');
      return false;
    }
    return true;
  };

  const validatePayment = (): boolean => {
    if (paymentMethod === 'card') {
      if (card.cardNumber.replace(/\s/g, '').length < 16) { toast.error('Enter a valid 16-digit card number'); return false; }
      if (card.expiry.length < 5) { toast.error('Enter a valid expiry date (MM/YY)'); return false; }
      if (card.cvv.length < 3) { toast.error('Enter a valid CVV'); return false; }
      if (!card.cardHolder.trim()) { toast.error('Enter the cardholder name'); return false; }
    }
    if (paymentMethod === 'mobile_money') {
      if (momo.phone.replace(/\D/g, '').length < 10) { toast.error('Enter a valid phone number'); return false; }
    }
    return true;
  };

  const paymentMethodLabel = (): string => {
    if (paymentMethod === 'card') return 'Card';
    if (paymentMethod === 'mobile_money') return `Mobile Money (${momo.network})`;
    if (paymentMethod === 'paypal') return 'PayPal';
    return 'Cash on Delivery';
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setLoading(true);
    try {
      await orderService.create({ shippingAddress, paymentMethod: paymentMethodLabel() });
      clearCart();
      toast.success('Order placed successfully!');
      setStep(3);
    } catch {
      toast.error('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="checkout-page success">
        <div className="checkout-success-panel">
          <div className="success-icon-wrap">
            <CheckCircle size={56} />
          </div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for shopping with CAGURA. Your order has been placed and we'll get it to you shortly.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
            <button className="btn btn-secondary" onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`step-badge ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className="step-line" />
          <div className={`step-badge ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-panel">
          {step === 1 && (
            <div className="form-section">
              <h3>Shipping Address</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={shipping.firstName} onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={shipping.lastName} onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} placeholder="KG 12 Ave, Kimironko" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} placeholder="Kigali" />
                </div>
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <input type="text" value={shipping.zipCode} onChange={e => setShipping(s => ({ ...s, zipCode: e.target.value }))} placeholder="00100" />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <select value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}>
                  <option>Rwanda</option>
                  <option>Uganda</option>
                  <option>Kenya</option>
                  <option>Tanzania</option>
                  <option>DRC</option>
                  <option>Other</option>
                </select>
              </div>
              <button className="btn btn-primary btn-full mt-4" onClick={() => { if (validateShipping()) setStep(2); }}>
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-section">
              <h3>Payment Method</h3>

              <div className="payment-methods">
                <button className={`method-card ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                  <CreditCard size={22} />
                  <span>Card</span>
                </button>
                <button className={`method-card ${paymentMethod === 'mobile_money' ? 'selected' : ''}`} onClick={() => setPaymentMethod('mobile_money')}>
                  <Smartphone size={22} />
                  <span>Mobile Money</span>
                </button>
                <button className={`method-card ${paymentMethod === 'paypal' ? 'selected' : ''}`} onClick={() => setPaymentMethod('paypal')}>
                  <DollarSign size={22} />
                  <span>PayPal</span>
                </button>
                <button className={`method-card ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                  <Package size={22} />
                  <span>Cash on Delivery</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" value={card.cardHolder} onChange={e => setCard(c => ({ ...c, cardHolder: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <div className="card-input-wrap">
                      <input
                        type="text"
                        value={card.cardNumber}
                        onChange={e => setCard(c => ({ ...c, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                      />
                      {detectCardBrand(card.cardNumber) && (
                        <span className={`card-brand card-brand-${detectCardBrand(card.cardNumber)}`}>
                          {detectCardBrand(card.cardNumber).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="•••" maxLength={4} />
                    </div>
                  </div>
                  <div className="security-badge">
                    <Lock size={13} />
                    <span>SSL Encrypted · Your card details are never stored</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'mobile_money' && (
                <div className="momo-form">
                  <div className="form-group">
                    <label>Network</label>
                    <div className="network-selector">
                      {(['MTN', 'Airtel'] as MomoNetwork[]).map(n => (
                        <button key={n} className={`network-btn ${momo.network === n ? 'selected' : ''}`} onClick={() => setMomo(m => ({ ...m, network: n }))}>
                          <span className={`network-dot network-${n.toLowerCase()}`} />
                          {n} Money
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={momo.phone} onChange={e => setMomo(m => ({ ...m, phone: e.target.value }))} placeholder={momo.network === 'MTN' ? '078 XXX XXXX' : '073 XXX XXXX'} />
                  </div>
                  <p className="momo-info">
                    A payment prompt will be sent to your {momo.network} number. Approve the transaction on your phone to complete the order.
                  </p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="paypal-panel">
                  <div className="paypal-logo">Pay<span>Pal</span></div>
                  <p>You'll be redirected to PayPal to complete your payment securely. Return here once the payment is confirmed.</p>
                  <button className="btn-paypal">
                    <DollarSign size={18} />
                    Continue with PayPal
                  </button>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="cod-panel">
                  <Package size={40} className="cod-icon" />
                  <h4>Cash on Delivery</h4>
                  <ul className="cod-info-list">
                    <li>Pay in cash when your order is delivered</li>
                    <li>Have the exact amount ready to speed up delivery</li>
                    <li>Delivery typically takes 1–3 business days</li>
                  </ul>
                </div>
              )}

              <div className="checkout-actions mt-4">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Processing...' : `Place Order · $${totalPrice.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary-panel">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.productImageUrl || undefined} alt={item.productName} />
                <div className="summary-item-info">
                  <p className="item-name">{item.productName}</p>
                  <span className="item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total-row">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
