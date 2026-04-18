import MockAdapter from 'axios-mock-adapter';
import api from './api';

// Initialize the mock adapter on the default instance
const mock = new MockAdapter(api, { delayResponse: 800 }); // simulate network delay

// ----- MOCK DATA -----
const MOCK_PRODUCTS = [
  { id: 1, title: 'Aura Sync Smartwatch', description: 'Advanced smartwatch with health tracking and seamless integration.', price: 299.99, image: '/assets/product_watch_1776467103171.png', category: 'Wearables', isNew: true },
  { id: 2, title: 'SonicPro Wireless Headphones', description: 'High-fidelity audio with active noise cancellation.', price: 349.50, image: '/assets/product_headphones_1776467120598.png', category: 'Audio', isNew: false },
  { id: 3, title: 'AeroGlide Future Sneakers', description: 'Lightweight, dynamic comfort for the modern lifestyle.', price: 189.99, image: '/assets/product_sneakers_1776467199864.png', category: 'Footwear', isNew: true },
  { id: 4, title: 'Neon Pulse Mechanical Keyboard', description: 'Custom switches with vibrant RGB backlighting.', price: 149.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false },
  { id: 5, title: 'Zenith 4K Monitor', description: 'Ultra-wide display with stunning color accuracy.', price: 599.00, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', category: 'Displays', isNew: true },
  { id: 6, title: 'Ergonomic Wireless Mouse', price: 89.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false, description: 'Designed for comfort during long sessions. Features customizable buttons and multi-device support.' },
  { id: 7, title: 'Fitness Tracker Band Mini', price: 59.99, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=800', category: 'Wearables', isNew: false, description: 'Lightweight and waterproof fitness tracker with sleep monitoring and heart rate sensors.' },
  { id: 8, title: 'Wireless Charging Pad', price: 39.99, image: '/assets/wireless_charger.png', category: 'Accessories', isNew: false, description: 'Fast wireless charging for all your Qi-compatible devices with a premium leather finish.' },
  { id: 9, title: 'Studio Condenser Microphone', price: 199.50, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800', category: 'Audio', isNew: true, description: 'Professional-grade microphone for crystal clear audio recording and broadcasting.' },
  { id: 10, title: 'Portable SSD 2TB', price: 249.00, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false, description: 'Lightning-fast storage in a rugged, pocket-sized aluminum enclosure.' }
];

let mockCart = [
  { productId: 1, quantity: 1, product: MOCK_PRODUCTS[0] }
];

// ----- MOCK ENDPOINTS -----

// Authentication
mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  if (email === 'admin@cagura.com' && password === 'password') {
    return [200, { success: true, message: 'Login successful', data: { token: 'mock-jwt-token-admin', user: { id: 1, email, name: 'Admin User', role: 'Admin' } } }];
  } else if (email && password) {
    return [200, { success: true, message: 'Login successful', data: { token: 'mock-jwt-token-client', user: { id: 2, email, name: 'Test User', role: 'Client' } } }];
  }
  return [401, { success: false, message: 'Invalid credentials', data: null }];
});

mock.onPost('/auth/register').reply(200, {
  success: true, message: 'Registration successful', data: null
});

// Products
mock.onGet('/products').reply(200, {
  success: true, message: 'Products retrieved', data: MOCK_PRODUCTS
});

mock.onGet(/\/products\/\d+/).reply((config) => {
  const match = config.url?.match(/\/products\/(\d+)/);
  if (match) {
    const id = parseInt(match[1]);
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    if (product) {
      return [200, { success: true, message: 'Product retrieved', data: product }];
    }
  }
  return [404, { success: false, message: 'Product not found', data: null }];
});

// Cart
mock.onGet('/cart').reply(() => {
  return [200, { success: true, message: 'Cart retrieved', data: mockCart }];
});

mock.onPost('/cart').reply((config) => {
  const { productId, quantity } = JSON.parse(config.data);
  const existing = mockCart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      mockCart.push({ productId, quantity, product });
    }
  }
  return [200, { success: true, message: 'Item added to cart', data: mockCart }];
});

mock.onDelete(/\/cart\/\d+/).reply((config) => {
  const match = config.url?.match(/\/cart\/(\d+)/);
  if (match) {
    const productId = parseInt(match[1]);
    mockCart = mockCart.filter(item => item.productId !== productId);
    return [200, { success: true, message: 'Item removed', data: mockCart }];
  }
  return [400, { success: false, message: 'Invalid request', data: null }];
});

// Orders
mock.onPost('/orders').reply(() => {
  mockCart = []; // Clear cart on successful order
  return [201, { success: true, message: 'Order placed successfully', data: { orderId: 1001 } }];
});

// ==========================================
// Admin Orders
// ==========================================
let mockAllOrders = [
  { id: 1001, customerName: 'John Doe', email: 'john@example.com', date: '2026-04-18', total: 349.50, status: 'Processing' },
  { id: 1002, customerName: 'Jane Smith', email: 'jane@example.com', date: '2026-04-17', total: 1299.00, status: 'Shipped' },
  { id: 1003, customerName: 'Alice Johnson', email: 'alice@example.com', date: '2026-04-15', total: 59.99, status: 'Delivered' },
  { id: 1004, customerName: 'Bob Williams', email: 'bob@example.com', date: '2026-04-10', total: 189.99, status: 'Cancelled' },
];

mock.onGet('/admin/orders').reply(200, mockAllOrders);

mock.onPut(/\/admin\/orders\/\d+/).reply((config) => {
  const idMatch = config.url?.match(/\/admin\/orders\/(\d+)/);
  if (!idMatch) return [400, { message: 'Invalid ID' }];
  const id = parseInt(idMatch[1]);
  const { status } = JSON.parse(config.data);
  
  const orderIndex = mockAllOrders.findIndex(o => o.id === id);
  if (orderIndex >= 0) {
    mockAllOrders[orderIndex].status = status;
    return [200, mockAllOrders[orderIndex]];
  }
  return [404, { message: 'Order not found' }];
});

// ==========================================
// Admin Customers
// ==========================================
let mockCustomers = [
  { id: 1, name: 'Admin User', email: 'admin@cagura.com', role: 'Admin', joinDate: '2026-01-15' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Customer', joinDate: '2026-03-20' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', joinDate: '2026-04-02' },
  { id: 4, name: 'Alice Johnson', email: 'alice@example.com', role: 'Customer', joinDate: '2026-04-10' },
];

mock.onGet('/admin/customers').reply(200, mockCustomers);

export default mock;
