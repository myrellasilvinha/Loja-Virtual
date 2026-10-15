// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('stylehub_cart')) || [];
let currentFilter = 'todos';
let selectedSize = 'M';

// ===== DOM =====
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const toast = document.getElementById('toast');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  setupEventListeners();
});

// ===== PRODUCTS =====
function renderProducts(filter = 'todos') {
  currentFilter = filter;
  const filtered = filter === 'todos'
    ? products
    : products.filter(p => p.category === filter);

  productsGrid.innerHTML = filtered.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <span class="product-category">${formatCategory(p.category)}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price">
          R$ ${p.price.toFixed(2).replace('.', ',')}
          ${p.oldPrice ? `<span class="old">R$ ${p.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="btn btn-outline view-btn" data-id="${p.id}">Ver</button>
          <button class="btn btn-primary add-btn" data-id="${p.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function formatCategory(cat) {
  const map = { feminino: 'Feminino', masculino: 'Masculino', acessorios: 'Acessórios' };
  return map[cat] || cat;
}

// ===== CART =====
function addToCart(productId, size = 'M') {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId && item.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.name} adicionado ao carrinho!`);
  
  // Google Analytics event
  if (typeof gtag === 'function') {
    gtag('event', 'add_to_cart', {
      currency: 'BRL',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: 1 }]
    });
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('stylehub_cart', JSON.stringify(cart));
}

function updateCartUI() {
  // Count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  // Total
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  // Items
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><p>Seu carrinho está vazio</p><p style="font-size:0.9rem;margin-top:0.5rem">Adicione produtos para começar!</p></div>`;
    return;
  }

  cartItems.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="price">R$ ${item.price.toFixed(2).replace('.', ',')} · Tam: ${item.size}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="minus" data-index="${i}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="plus" data-index="${i}">+</button>
        </div>
        <button class="remove-item" data-index="${i}">Remover</button>
      </div>
    </div>
  `).join('');
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  showToast('Carrinho limpo');
}

function checkout() {
  if (cart.length === 0) {
    showToast('Adicione produtos ao carrinho primeiro');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  // Google Analytics purchase event
  if (typeof gtag === 'function') {
    gtag('event', 'purchase', {
      transaction_id: 'DEMO-' + Date.now(),
      value: total,
      currency: 'BRL',
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.qty
      }))
    });
  }

  alert(`🎉 Compra finalizada!\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\n(Esta é uma loja demonstrativa. Nenhum pagamento real foi processado.)`);
  clearCart();
  closeCart();
}

// ===== MODAL =====
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  selectedSize = 'M';

  modalBody.innerHTML = `
    <div class="modal-image">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="modal-info">
      <span class="product-category">${formatCategory(product.category)}</span>
      <h2>${product.name}</h2>
      <div class="price">
        R$ ${product.price.toFixed(2).replace('.', ',')}
        ${product.oldPrice ? `<span class="old" style="font-size:1rem;color:#999;text-decoration:line-through;margin-left:0.5rem">R$ ${product.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
      </div>
      <p class="desc">${product.description}</p>
      <p style="font-weight:500;margin-bottom:0.5rem">Tamanho:</p>
      <div class="sizes">
        ${['P', 'M', 'G', 'GG'].map(s => `
          <button class="size-btn ${s === 'M' ? 'active' : ''}" data-size="${s}">${s}</button>
        `).join('')}
      </div>
      <button class="btn btn-primary btn-block" id="modalAddBtn" data-id="${product.id}">
        Adicionar ao Carrinho
      </button>
    </div>
  `;

  productModal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Size selection
  modalBody.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalBody.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });

  // Add from modal
  document.getElementById('modalAddBtn').addEventListener('click', () => {
    addToCart(product.id, selectedSize);
    closeModal();
  });
}

function closeModal() {
  productModal.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== CART SIDEBAR =====
function openCart() {
  cartSidebar.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  if (!productModal.classList.contains('open')) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ===== TOAST =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === cat);
      });
      renderProducts(cat);
      document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Product buttons (delegation)
  productsGrid.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-btn');
    const addBtn = e.target.closest('.add-btn');
    if (viewBtn) openProductModal(Number(viewBtn.dataset.id));
    if (addBtn) addToCart(Number(addBtn.dataset.id));
  });

  // Cart
  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  overlay.addEventListener('click', () => {
    closeCart();
    closeModal();
  });

  cartItems.addEventListener('click', (e) => {
    const minus = e.target.closest('[data-action="minus"]');
    const plus = e.target.closest('[data-action="plus"]');
    const remove = e.target.closest('.remove-item');
    if (minus) updateQty(Number(minus.dataset.index), -1);
    if (plus) updateQty(Number(plus.dataset.index), 1);
    if (remove) removeFromCart(Number(remove.dataset.index));
  });

  checkoutBtn.addEventListener('click', checkout);
  clearCartBtn.addEventListener('click', clearCart);

  // Modal
  modalClose.addEventListener('click', closeModal);

  // Mobile menu
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close mobile nav on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeModal();
      nav.classList.remove('open');
    }
  });
}
