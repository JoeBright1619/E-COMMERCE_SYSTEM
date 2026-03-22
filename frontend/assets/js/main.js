// Minimal frontend logic for prototype cart in localStorage
const PRODUCTS = {
  "1": { id: 1, title: 'Classic Sneakers', price: 69.00, desc: 'Comfortable everyday sneakers in multiple colors.' },
  "2": { id: 2, title: 'Minimal Watch', price: 129.00, desc: 'Timeless design with a leather strap.' },
  "3": { id: 3, title: 'Leather Backpack', price: 179.00, desc: 'Durable leather backpack for work and travel.' },
  "4": { id: 4, title: 'Wireless Headphones', price: 219.00, desc: 'Noise-cancelling with long battery life.' }
};

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '{}'); } catch(e) { return {}; }
}
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(productId, qty=1) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  alert('Added to cart');
}

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

// auto-run functions depending on page contents
window.addEventListener('DOMContentLoaded', () => {
  renderProductDetails();
  renderCartPage();
  renderCheckoutSummary();
  const placeBtn = document.getElementById('place-order');
  if (placeBtn) placeBtn.addEventListener('click', (e) => { e.preventDefault(); placeOrder(); });
});
