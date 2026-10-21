/**
 * PETCARE CLINIC - PRODUCTS SHOP JS
 */

let shopState = {
  category: 'all',
  search: '',
  priceRange: 'all',
  sortBy: 'featured',
  page: 1,
  pageSize: 6
};

// Initialize Shop Page
function initShopPage() {
  renderProductGrid();

  // Search input
  const searchInput = document.getElementById('shop-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      shopState.search = e.target.value.toLowerCase().trim();
      shopState.page = 1;
      renderProductGrid();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('shop-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      shopState.sortBy = e.target.value;
      renderProductGrid();
    });
  }

  // Price range radios
  const priceRadios = document.querySelectorAll('input[name="price-filter"]');
  priceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      shopState.priceRange = e.target.value;
      shopState.page = 1;
      renderProductGrid();
    });
  });

  // Category filter items
  const catItems = document.querySelectorAll('.category-filter-item');
  catItems.forEach(item => {
    item.addEventListener('click', () => {
      catItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      shopState.category = item.dataset.category;
      shopState.page = 1;
      renderProductGrid();
    });
  });
}

// Render Products Grid
function renderProductGrid() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const allProducts = getFromDB(DB_KEYS.PRODUCTS);

  // Filter
  let filtered = allProducts.filter(prod => {
    // Category
    if (shopState.category !== 'all' && prod.category !== shopState.category) {
      return false;
    }
    // Search
    if (shopState.search && !prod.name.toLowerCase().includes(shopState.search)) {
      return false;
    }
    // Price
    if (shopState.priceRange === 'under-100' && prod.price >= 100000) return false;
    if (shopState.priceRange === '100-300' && (prod.price < 100000 || prod.price > 300000)) return false;
    if (shopState.priceRange === 'above-300' && prod.price <= 300000) return false;

    return true;
  });

  // Sort
  if (shopState.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (shopState.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (shopState.sortBy === 'sold') {
    filtered.sort((a, b) => b.sold - a.sold);
  }

  // Count indicator
  const countEl = document.getElementById('products-count-badge');
  if (countEl) countEl.textContent = `${filtered.length} sản phẩm`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 16px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🛍️</div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--dark);">Không tìm thấy sản phẩm nào</h3>
        <p style="color: var(--text-muted);">Vui lòng thử bỏ bớt bộ lọc hoặc tìm kiếm từ khóa khác.</p>
      </div>
    `;
    return;
  }

  // Pagination slice
  const startIndex = (shopState.page - 1) * shopState.pageSize;
  const paginated = filtered.slice(startIndex, startIndex + shopState.pageSize);

  container.innerHTML = paginated.map(p => `
    <div class="product-card">
      <div class="product-card-image-wrap">
        <a href="product-detail.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}" class="product-card-image">
        </a>
        ${p.originalPrice > p.price ? `
          <span class="product-discount-badge">-${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>
        ` : ''}
        <span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'} product-stock-badge">
          ${p.stock > 0 ? `Còn hàng (${p.stock})` : 'Hết hàng'}
        </span>
      </div>

      <div class="product-card-body">
        <div class="d-flex items-center justify-between" style="margin-bottom: 6px;">
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">
            ${p.category === 'food' ? 'Thức ăn' : p.category === 'care' ? 'Vệ sinh' : p.category === 'medicine' ? 'Y tế' : 'Phụ kiện'}
          </span>
          <span style="font-size: 0.8rem; color: #f59e0b; font-weight: 700;">★ ${p.rating}</span>
        </div>

        <h3 class="product-card-title">
          <a href="product-detail.html?id=${p.id}">${p.name}</a>
        </h3>

        <div class="product-card-price-wrap">
          <span class="product-current-price">${formatCurrency(p.price)}</span>
          ${p.originalPrice > p.price ? `<span class="product-old-price">${formatCurrency(p.originalPrice)}</span>` : ''}
        </div>

        <div class="product-card-actions">
          <a href="product-detail.html?id=${p.id}" class="btn btn-outline btn-sm flex-1">Chi tiết</a>
          <button class="btn btn-primary btn-sm flex-1" onclick="addToCart('${p.id}', 1)" ${p.stock <= 0 ? 'disabled' : ''}>
            🛒 Mua ngay
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Render pagination
  renderShopPagination(filtered.length);
}

function renderShopPagination(total) {
  const container = document.getElementById('shop-pagination');
  if (!container) return;

  const totalPages = Math.ceil(total / shopState.pageSize);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <div class="d-flex items-center justify-center gap-2" style="margin-top: 30px;">
      <button class="page-btn" ${shopState.page === 1 ? 'disabled' : ''} onclick="changeShopPage(${shopState.page - 1})">❮</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${shopState.page === i ? 'active' : ''}" onclick="changeShopPage(${i})">${i}</button>
    `;
  }

  html += `
      <button class="page-btn" ${shopState.page === totalPages ? 'disabled' : ''} onclick="changeShopPage(${shopState.page + 1})">❯</button>
    </div>
  `;

  container.innerHTML = html;
}

function changeShopPage(page) {
  shopState.page = page;
  renderProductGrid();
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

// Product Detail Page Initialization (product-detail.html)
let currentSelectedProduct = null;

function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id') || 'prod-1';
  const products = getFromDB(DB_KEYS.PRODUCTS);
  const product = products.find(p => p.id === prodId) || products[0];
  currentSelectedProduct = product;

  document.title = `${product.name} - Cửa hàng PetCare`;

  // Bind values
  document.getElementById('detail-product-name').textContent = product.name;
  document.getElementById('detail-product-price').textContent = formatCurrency(product.price);
  if (product.originalPrice > product.price) {
    document.getElementById('detail-product-old-price').textContent = formatCurrency(product.originalPrice);
  }
  document.getElementById('detail-product-stock').textContent = product.stock;
  document.getElementById('detail-product-desc').textContent = product.description;
  document.getElementById('detail-main-img').src = product.image;
  document.getElementById('detail-product-sold').textContent = product.sold;
  document.getElementById('detail-product-rating').textContent = product.rating;

  // Quantity input restrictions
  const qtyInput = document.getElementById('detail-product-qty');
  if (qtyInput) {
    qtyInput.max = product.stock;
    qtyInput.value = 1;
  }

  // Related products
  const relatedContainer = document.getElementById('related-products-grid');
  if (relatedContainer) {
    const related = products.filter(p => p.id !== product.id).slice(0, 4);
    relatedContainer.innerHTML = related.map(r => `
      <div class="product-card">
        <a href="product-detail.html?id=${r.id}">
          <img src="${r.image}" alt="${r.name}" style="height: 160px; width: 100%; object-fit: cover;">
        </a>
        <div style="padding: 14px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px;">
            <a href="product-detail.html?id=${r.id}">${r.name}</a>
          </h4>
          <div style="font-weight: 800; color: var(--primary); margin-bottom: 10px;">${formatCurrency(r.price)}</div>
          <button class="btn btn-outline btn-sm btn-block" onclick="addToCart('${r.id}', 1)">+ Thêm giỏ</button>
        </div>
      </div>
    `).join('');
  }
}

function adjustDetailQuantity(delta) {
  const qtyInput = document.getElementById('detail-product-qty');
  if (!qtyInput || !currentSelectedProduct) return;

  let currentVal = parseInt(qtyInput.value) || 1;
  let newVal = currentVal + delta;

  if (newVal < 1) newVal = 1;
  if (newVal > currentSelectedProduct.stock) {
    showToast(`Kho hàng hiện chỉ còn ${currentSelectedProduct.stock} sản phẩm!`, 'warning');
    newVal = currentSelectedProduct.stock;
  }

  qtyInput.value = newVal;
}

function addCurrentProductToCart() {
  if (!currentSelectedProduct) return;
  const qty = parseInt(document.getElementById('detail-product-qty').value) || 1;
  addToCart(currentSelectedProduct.id, qty);
}

function buyCurrentProductNow() {
  if (!currentSelectedProduct) return;
  const qty = parseInt(document.getElementById('detail-product-qty').value) || 1;
  const added = addToCart(currentSelectedProduct.id, qty);
  if (added) {
    window.location.href = 'checkout.html';
  }
}

