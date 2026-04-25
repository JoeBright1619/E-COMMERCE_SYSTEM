import MockAdapter from 'axios-mock-adapter';
import api from './api';

// Initialize the mock adapter on the default instance
const mock = new MockAdapter(api, { delayResponse: 800 }); // simulate network delay

// ----- MOCK DATA -----
const MOCK_PRODUCTS = [
  { id: 1, title: 'Aura Sync Smartwatch', description: 'Advanced smartwatch with health tracking and seamless integration.', price: 299.99, image: '/assets/product_watch_1776467103171.png', category: 'Wearables', isNew: true },
  { id: 2, title: 'SonicPro Wireless Headphones', description: 'High-fidelity audio with active noise cancellation.', price: 349.50, image: '/assets/product_headphones_1776467120598.png', category: 'Audio', isNew: false },
  { id: 3, title: 'AeroGlide Future Sneakers', description: 'Lightweight, dynamic comfort for the modern lifestyle.', price: 189.99, image: '/assets/product_sneakers_1776467199864.png', category: 'Footwear', isNew: true },
  { id: 4, title: 'Neon Pulse Mechanical Keyboard', description: 'Custom switches with vibrant RGB backlighting.', price: 149.99, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false },
  { id: 5, title: 'Zenith 4K Monitor', description: 'Ultra-wide display with stunning color accuracy.', price: 599.00, image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=800', category: 'Displays', isNew: true },
  { id: 6, title: 'Ergonomic Wireless Mouse', price: 89.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false, description: 'Designed for comfort during long sessions. Features customizable buttons and multi-device support.' },
  { id: 7, title: 'Fitness Tracker Band Mini', price: 59.99, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800', category: 'Wearables', isNew: false, description: 'Lightweight and waterproof fitness tracker with sleep monitoring and heart rate sensors.' },
  { id: 8, title: 'Wireless Charging Pad', price: 39.99, image: '/assets/wireless_charger.png', category: 'Accessories', isNew: false, description: 'Fast wireless charging for all your Qi-compatible devices with a premium leather finish.' },
  { id: 9, title: 'Studio Condenser Microphone', price: 199.50, image: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&q=80&w=800', category: 'Audio', isNew: true, description: 'Professional-grade microphone for crystal clear audio recording and broadcasting.' },
  { id: 10, title: 'Portable SSD 2TB', price: 249.00, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false, description: 'Lightning-fast storage in a rugged, pocket-sized aluminum enclosure.' },
  { id: 11, title: 'Titanium Smart Ring', price: 199.99, image: '/assets/titanium_smart_ring_1776712869520.png', category: 'Wearables', isNew: true, description: 'Sleek titanium smart ring with advanced health and sleep tracking capabilities.' },
  { id: 12, title: 'Premium Noise-Canceling Earbuds', price: 249.00, image: '/assets/premium_earbuds_1776712916481.png', category: 'Audio', isNew: true, description: 'Experience pure silence and rich audio with our matte finish premium wireless earbuds.' },
  { id: 13, title: 'Urban Commuter Backpack', price: 129.50, image: '/assets/urban_backpack_1776712967683.png', category: 'Accessories', isNew: false, description: 'Water-resistant, minimalist backpack designed for the modern professional.' },
  { id: 14, title: 'Leather Smart Wallet', price: 79.99, image: '/assets/smart_wallet_1776713017275.png', category: 'Accessories', isNew: true, description: 'Slim profile leather wallet with built-in RFID blocking and tracking technology.' },
  { id: 15, title: 'Heavyweight Minimalist T-Shirt', price: 45.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', category: 'Men\'s Clothing', isNew: true, description: 'Premium heavy-weight cotton t-shirt with a relaxed fit and incredibly soft feel.' },
  { id: 16, title: 'Tailored Modern Chinos', price: 89.00, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800', category: 'Men\'s Clothing', isNew: false, description: 'Versatile, sharp chinos designed for all-day comfort and mobility.' },
  { id: 17, title: 'Charcoal Bomber Jacket', price: 145.00, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800', category: 'Men\'s Clothing', isNew: true, description: 'Sleek, minimalist bomber jacket perfect for layering in transition seasons.' },
  { id: 18, title: 'Ribbed Knit Sweater', price: 95.00, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800', category: 'Women\'s Clothing', isNew: true, description: 'Cozy, elegant ribbed sweater in soft cream, crafted from a premium wool blend.' },
  { id: 19, title: 'Wide-Leg Trousers', price: 115.00, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800', category: 'Women\'s Clothing', isNew: false, description: 'Fluid, wide-leg trousers that offer a sophisticated silhouette with effortless comfort.' },
  { id: 20, title: 'Silk Slip Dress', price: 175.00, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800', category: 'Women\'s Clothing', isNew: true, description: 'A timeless silk slip dress in deep burgundy, designed to drape beautifully.' },
  { id: 21, title: 'Classic Leather Sneakers', price: 120.00, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800', category: 'Footwear', isNew: false, description: 'Clean, minimalist white leather sneakers for everyday wear.' },
  { id: 22, title: 'Suede Chelsea Boots', price: 165.00, image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800', category: 'Footwear', isNew: true, description: 'Premium suede Chelsea boots with an effortless slip-on design.' },
  { id: 23, title: 'Strappy Block Heels', price: 140.00, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800', category: 'Footwear', isNew: false, description: 'Elegant and comfortable block heel sandals perfect for evening transitions.' },
  { id: 24, title: 'Leather Ankle Boots', price: 185.00, image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=800', category: 'Footwear', isNew: true, description: 'Sleek leather ankle boots with a subtle heel for everyday sophistication.' },
  { id: 25, title: 'Pro Fitness Tracker Band', price: 129.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', category: 'Wearables', isNew: false, description: 'Minimalist fitness band tracking heart rate, sleep, and daily activity seamlessly.' },
  { id: 26, title: 'Waterproof Portable Speaker', price: 89.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800', category: 'Audio', isNew: true, description: 'Rugged, waterproof Bluetooth speaker delivering crisp 360-degree sound.' },
  { id: 27, title: 'Studio Over-Ear Headphones', price: 199.00, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', category: 'Audio', isNew: false, description: 'Professional-grade studio headphones offering flat response and supreme comfort.' },
  { id: 28, title: 'Leather Tech Organizer', price: 65.00, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false, description: 'Premium leather pouch to keep your cables and chargers organized.' },
  { id: 29, title: 'Wireless Charging Hub', price: 49.50, image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: true, description: 'Sleek aluminum charging pad for your phone, watch, and earbuds.' },
  { id: 30, title: 'Minimalist Sunglasses', price: 110.00, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: true, description: 'Classic matte black sunglasses with polarized lenses.' },
  { id: 31, title: '27" 4K Creator Monitor', price: 450.00, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', category: 'Displays', isNew: false, description: 'Color-accurate 4K display designed for designers and video editors.' },
  { id: 32, title: 'Cashmere Crewneck', price: 155.00, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', category: 'Men\'s Clothing', isNew: true, description: 'Ultra-soft cashmere blend crewneck sweater for elevated comfort.' },
  { id: 33, title: 'Selvedge Denim Jacket', price: 135.00, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800', category: 'Men\'s Clothing', isNew: false, description: 'Classic raw selvedge denim jacket that fades beautifully over time.' },
  { id: 34, title: 'Oversized Linen Blazer', price: 145.00, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800', category: 'Women\'s Clothing', isNew: true, description: 'Lightweight, relaxed-fit linen blazer perfect for warm weather layering.' },
  { id: 35, title: 'Pleated Midi Skirt', price: 85.00, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', category: 'Women\'s Clothing', isNew: false, description: 'Elegant pleated midi skirt offering fluid movement and a soft silhouette.' },
  { id: 36, title: 'Velocity Running Shoes', price: 140.00, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800', category: 'Footwear', isNew: true, description: 'High-performance running shoes with responsive cushioning and a knit upper.' },
  { id: 37, title: 'Leather Penny Loafers', price: 175.00, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', category: 'Footwear', isNew: false, description: 'Classic leather loafers that blend timeless style with modern comfort.' },
  { id: 38, title: 'Classic Trench Coat', price: 245.00, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', category: 'Women\'s Clothing', isNew: true, description: 'A timeless double-breasted trench coat with a water-resistant finish.' },
  { id: 39, title: 'Tailored Wool Suit', price: 450.00, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800', category: 'Men\'s Clothing', isNew: false, description: 'Perfectly tailored slim-fit wool suit for formal occasions.' },
  { id: 40, title: 'Silk Wrap Blouse', price: 125.00, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800', category: 'Women\'s Clothing', isNew: true, description: 'Elegant silk blouse with a flattering wrap silhouette.' },
  { id: 41, title: 'Luxury Automatic Watch', price: 899.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: true, description: 'Premium automatic timepiece with a sapphire crystal face and leather band.' },
  { id: 42, title: 'Designer Leather Handbag', price: 320.00, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false, description: 'Spacious and elegant structured leather tote bag.' },
  { id: 43, title: 'Classic Oxford Shirt', price: 85.00, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', category: 'Men\'s Clothing', isNew: false, description: 'A crisp, breathable cotton oxford shirt for everyday polish.' },
  { id: 44, title: 'Wool Fedora Hat', price: 65.00, image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: true, description: 'Classic wool felt fedora with a grosgrain ribbon band.' },
  { id: 45, title: 'Minimalist Gold Pendant', price: 150.00, image: 'https://images.unsplash.com/photo-1599643478514-4a884e9eb86b?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: true, description: 'Delicate 14k gold chain with a subtle geometric pendant.' },
  { id: 46, title: 'Leather Briefcase', price: 210.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: false, description: 'Professional, slim leather briefcase designed for modern laptops.' },
  { id: 47, title: 'Tortoiseshell Sunglasses', price: 115.00, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800', category: 'Accessories', isNew: true, description: 'Classic tortoiseshell frames with UV400 protection.' }
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
