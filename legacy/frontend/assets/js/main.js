// Minimal frontend logic for prototype cart in localStorage
const PRODUCTS = {
  "1": { id: 1, title: 'Classic Sneakers', price: 69.00, desc: 'Comfortable everyday sneakers in multiple colors.', category: 'apparel' },
  "2": { id: 2, title: 'Minimal Watch', price: 129.00, desc: 'Timeless design with a leather strap.', category: 'accessories' },
  "3": { id: 3, title: 'Leather Backpack', price: 179.00, desc: 'Durable leather backpack for work and travel.', category: 'bags' },
  "4": { id: 4, title: 'Wireless Headphones', price: 219.00, desc: 'Noise-cancelling with long battery life.', category: 'electronics' }
};

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '{}'); } catch(e) { return {}; }
}
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

// Auth helpers
function getUser() {
  try { return JSON.parse(localStorage.getItem('cagura_user') || 'null'); } catch(e) { return null; }
}
function setUser(user) {
  localStorage.setItem('cagura_user', JSON.stringify(user));
  renderAuthLinks();
}
function logoutUser() {
  localStorage.removeItem('cagura_user');
  renderAuthLinks();
}

function renderAuthLinks() {
  const container = document.getElementById('auth-links');
  if (!container) return;
  const user = getUser();
  if (user && user.name) {
    container.innerHTML = `
      <div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-light" href="#" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">${escapeHtml(user.name)}</a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
          <li><a class="dropdown-item" href="profile.html">Profile</a></li>
          <li><a class="dropdown-item" href="#" id="logout-link">Logout</a></li>
        </ul>
      </div>
    `;
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });
  } else {
    container.innerHTML = `
      <div class="d-flex gap-2">
        <a class="btn btn-sm btn-outline-light" href="login.html">Login</a>
        <a class="btn btn-sm btn-light" href="register.html">Register</a>
      </div>
    `;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]; });
}

function addToCart(productId, qty=1) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  // small UI feedback
  const brand = document.querySelector('.navbar-brand');
  if (brand) brand.classList.add('text-success');
  setTimeout(() => brand && brand.classList.remove('text-success'), 400);
}

// product details rendering
function renderProductDetails() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '1';
  const p = PRODUCTS[id];
  if (!p) return;
  const titleEl = document.getElementById('p-title');
  const descEl = document.getElementById('p-desc');
  const priceEl = document.getElementById('p-price');
  const imgEl = document.getElementById('p-img');
  titleEl && (titleEl.textContent = p.title);
  descEl && (descEl.textContent = p.desc);
  priceEl && (priceEl.textContent = `$${p.price.toFixed(2)}`);
  imgEl && (imgEl.src = `https://picsum.photos/seed/p${id}/900/600`);
  const addBtn = document.getElementById('add-to-cart');
  addBtn && (addBtn.onclick = () => {
    const qtyInput = document.getElementById('qty');
    const qty = Math.max(1, parseInt(qtyInput.value || '1'));
    addToCart(id, qty);
    alert(`${p.title} added to cart`);
  });
}

function renderCartPage() {
  const cart = getCart();
  const tableBody = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  if (!tableBody) return;
  tableBody.innerHTML = '';
  let total = 0;
  Object.keys(cart).forEach(id => {
    const qty = cart[id];
    const p = PRODUCTS[id] || { title: 'Unknown', price: 0 };
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.title}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td><input type="number" min="1" value="${qty}" class="form-control qty-input" data-id="${id}" style="width:90px"></td>
      <td class="item-sub">$${(p.price * qty).toFixed(2)}</td>
      <td><button class="btn btn-sm btn-outline-danger remove-btn" data-id="${id}">Remove</button></td>
    `;
    tableBody.appendChild(row);
    total += p.price * qty;
  });
  totalEl && (totalEl.textContent = `$${total.toFixed(2)}`);

  // attach events
  document.querySelectorAll('.qty-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      let v = Math.max(1, parseInt(e.target.value || '1'));
      const cart = getCart();
      cart[id] = v;
      saveCart(cart);
      renderCartPage();
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const cart = getCart();
      delete cart[id];
      saveCart(cart);
      renderCartPage();
    });
  });
}

function renderCheckoutSummary() {
  const cart = getCart();
  const list = document.getElementById('checkout-list');
  const totalEl = document.getElementById('checkout-total');
  if (!list) return;
  list.innerHTML = '';
  let total = 0;
  Object.keys(cart).forEach(id => {
    const qty = cart[id];
    const p = PRODUCTS[id] || { title: 'Unknown', price: 0 };
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${p.title} x ${qty}`;
    const badge = document.createElement('span');
    badge.className = 'badge bg-primary rounded-pill';
    badge.textContent = `$${(p.price * qty).toFixed(2)}`;
    li.appendChild(badge);
    list.appendChild(li);
    total += p.price * qty;
  });
  totalEl && (totalEl.textContent = `$${total.toFixed(2)}`);
}

function placeOrder() {
  localStorage.removeItem('cart');
  alert('Order placed (prototype)');
  location.href = 'index.html';
}

// NEW: filtering/searching
function updateVisibleCount() {
  const visible = document.querySelectorAll('#products-grid .product-card:not([hidden])').length;
  const el = document.getElementById('visible-count');
  if (el) el.textContent = visible;
}

function applyFilters() {
  const q = (document.getElementById('search-input')?.value || '').trim().toLowerCase();
  const activeCatBtn = document.querySelector('#category-filter .btn.active');
  const cat = activeCatBtn ? activeCatBtn.dataset.cat : 'all';
  document.querySelectorAll('#products-grid .product-card').forEach(card => {
    const title = (card.dataset.title || '').toLowerCase();
    const category = (card.dataset.category || 'all');
    let matches = true;
    if (cat && cat !== 'all' && category !== cat) matches = false;
    if (q && !title.includes(q)) matches = false;
    card.hidden = !matches;
  });
  updateVisibleCount();
}

// Auth form handlers (login/register pages)
function handleLoginForm(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('login-name');
  const emailInput = document.getElementById('login-email');
  const name = (nameInput?.value || emailInput?.value || 'Guest').trim();
  setUser({ name });
  // allow access to whoever — redirect to home
  location.href = 'index.html';
}

function handleRegisterForm(e) {
  if (e) e.preventDefault();
  // In prototype, simply create user and redirect to login
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const name = (nameInput?.value || emailInput?.value || 'Guest').trim();
  alert('Registration successful (prototype). You can now login.');
  location.href = 'login.html';
}

// sanitize simple input for display

window.addEventListener('DOMContentLoaded', () => {
  renderProductDetails();
  renderCartPage();
  renderCheckoutSummary();
  renderAuthLinks();
  const placeBtn = document.getElementById('place-order');
  if (placeBtn) placeBtn.addEventListener('click', (e) => { e.preventDefault(); placeOrder(); });

  // search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => applyFilters());
  }
  // category buttons
  document.querySelectorAll('#category-filter .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#category-filter .btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      applyFilters();
    });
  });

  // attach login/register forms if present
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLoginForm);
  const regForm = document.getElementById('register-form');
  if (regForm) regForm.addEventListener('submit', handleRegisterForm);

  // initial filter application
  applyFilters();
});
