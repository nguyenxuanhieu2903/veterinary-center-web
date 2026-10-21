/**
 * PETCARE CLINIC - CART, CHECKOUT & ORDER HISTORY JS
 */

let appliedDiscountPercent = 0;
let appliedDiscountCode = '';

// Initialize Cart Page (cart.html)
function initCartPage() {
  renderCartList();

  const voucherInput = document.getElementById('voucher-code-input');
  if (voucherInput) {
    voucherInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyVoucher();
      }
    });
  }
}

// Render Cart Items
function renderCartList() {
  const container = document.getElementById('cart-items-container');
  const summaryContainer = document.getElementById('cart-summary-section');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: #fff; border-radius: 16px;">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">🛒</div>
        <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--dark); margin-bottom: 8px;">Giỏ hàng của bạn đang trống</h3>
        <p style="color: var(--text-muted); margin-bottom: 24px;">Hãy khám phá các sản phẩm dinh dưỡng và phụ kiện chất lượng cho bé yêu nhé.</p>
        <a href="products.html" class="btn btn-primary btn-lg">🛍️ Khám phá sản phẩm ngay</a>
      </div>
    `;
    if (summaryContainer) summaryContainer.style.display = 'none';
    return;
  }

  if (summaryContainer) summaryContainer.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div>
        <h4 class="cart-item-title"><a href="product-detail.html?id=${item.id}">${item.name}</a></h4>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
      </div>
      <div>
        <div class="quantity-selector">
          <button type="button" class="quantity-btn" onclick="updateCartItemQty('${item.id}', -1)">−</button>
          <input type="text" class="quantity-input" value="${item.quantity}" readonly>
          <button type="button" class="quantity-btn" onclick="updateCartItemQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <div class="cart-item-subtotal">
        ${formatCurrency(item.price * item.quantity)}
      </div>
      <div style="text-align: right;">
        <button class="btn btn-outline btn-sm" onclick="removeCartItem('${item.id}')" title="Xóa món này" style="color: var(--danger); border-color: transparent;">✕</button>
      </div>
    </div>
  `).join('');

  updateCartSummaryCalculations();
}

// Update Cart Item Quantity
function updateCartItemQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  const products = getFromDB(DB_KEYS.PRODUCTS);
  const original = products.find(p => p.id === productId);

  let newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeCartItem(productId);
    return;
  }

  if (original && newQty > original.stock) {
    showToast(`Kho chỉ còn ${original.stock} sản phẩm!`, 'warning');
    return;
  }

  item.quantity = newQty;
  saveToDB(DB_KEYS.CART, cart);
  updateCartBadge();
  renderCartList();
}

// Remove Single Item from Cart
function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveToDB(DB_KEYS.CART, cart);
  updateCartBadge();
  showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  renderCartList();
}

// Clear all items in cart
function clearAllCart() {
  ModalManager.confirm({
    title: 'Xóa toàn bộ giỏ hàng',
    message: 'Bạn có chắc muốn xóa tất cả sản phẩm đang có trong giỏ?',
    confirmText: 'Xóa hết',
    isDanger: true,
    onConfirm: async () => {
      saveToDB(DB_KEYS.CART, []);
      updateCartBadge();
      showToast('Đã làm trống giỏ hàng', 'info');
      renderCartList();
    }
  });
}

// Apply Voucher Code
function applyVoucher() {
  const codeInput = document.getElementById('voucher-code-input');
  if (!codeInput) return;

  const code = codeInput.value.trim().toUpperCase();
  if (!code) {
    showToast('Vui lòng nhập mã giảm giá!', 'warning');
    return;
  }

  if (code === 'PETCARE10' || code === 'WELCOME10') {
    appliedDiscountPercent = 10;
    appliedDiscountCode = code;
    showToast(`Áp dụng thành công mã "${code}" - Giảm 10%!`, 'success');
  } else if (code === 'PETVIP20') {
    appliedDiscountPercent = 20;
    appliedDiscountCode = code;
    showToast(`Áp dụng thành công mã VIP "${code}" - Giảm 20%!`, 'success');
  } else {
    showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn (Thử: PETCARE10)', 'error');
    appliedDiscountPercent = 0;
    appliedDiscountCode = '';
  }

  updateCartSummaryCalculations();
}

// Calculate and Update Cart Summaries
function updateCartSummaryCalculations() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = (subtotal >= 500000 || subtotal === 0) ? 0 : 30000;
  const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount-amount');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (shippingEl) {
    shippingEl.textContent = shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee);
    shippingEl.style.color = shippingFee === 0 ? 'var(--success)' : 'inherit';
  }

  if (discountRow && discountEl) {
    if (appliedDiscountPercent > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `- ${formatCurrency(discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (totalEl) totalEl.textContent = formatCurrency(total);

  return { subtotal, shippingFee, discountAmount, total };
}

// ==========================================================================
// CHECKOUT LOGIC (checkout.html)
// ==========================================================================
let selectedPaymentMethod = 'COD';

function initCheckoutPage() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Giỏ hàng của bạn đang trống! Đang quay lại cửa hàng...');
    window.location.href = 'products.html';
    return;
  }

  // Pre-fill user data if logged in
  const user = getCurrentUser();
  if (user) {
    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const emailInput = document.getElementById('checkout-email');
    if (nameInput) nameInput.value = user.name || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (emailInput) emailInput.value = user.email || '';
  }

  renderCheckoutOrderSummary();
}

function selectPaymentMethod(method, element) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
  if (element) element.classList.add('selected');

  const qrBox = document.getElementById('vietqr-box');
  if (qrBox) {
    qrBox.className = method === 'VIETQR' ? 'vietqr-box show' : 'vietqr-box';
  }
}

function renderCheckoutOrderSummary() {
  const container = document.getElementById('checkout-items-list');
  if (!container) return;

  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = (subtotal >= 500000 || subtotal === 0) ? 0 : 30000;
  const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  container.innerHTML = cart.map(item => `
    <div class="d-flex items-center justify-between" style="padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 0.92rem;">
      <div class="d-flex items-center gap-3">
        <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;">
        <div>
          <div style="font-weight: 600; color: var(--dark);">${item.name}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">SL: ${item.quantity} x ${formatCurrency(item.price)}</div>
        </div>
      </div>
      <strong style="color: var(--dark);">${formatCurrency(item.price * item.quantity)}</strong>
    </div>
  `).join('');

  document.getElementById('checkout-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('checkout-shipping').textContent = shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee);
  if (appliedDiscountPercent > 0) {
    document.getElementById('checkout-discount-row').style.display = 'flex';
    document.getElementById('checkout-discount').textContent = `- ${formatCurrency(discountAmount)}`;
  }
  document.getElementById('checkout-total').textContent = formatCurrency(total);
}

// Handle Checkout Submission
function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const notes = document.getElementById('checkout-notes') ? document.getElementById('checkout-notes').value.trim() : '';
  const submitBtn = document.getElementById('btn-place-order');

  if (!name || !phone || !address) {
    showToast('Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ nhận hàng!', 'warning');
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Giỏ hàng trống!', 'error');
    return;
  }

  // Double click protection & loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Đang xác nhận đơn hàng...';

  setTimeout(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = (subtotal >= 500000 || subtotal === 0) ? 0 : 30000;
    const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
    const total = Math.max(0, subtotal - discountAmount + shippingFee);

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
      id: orderId,
      customerName: name,
      phone: phone,
      address: address,
      notes: notes,
      items: cart,
      subtotal: subtotal,
      shipping: shippingFee,
      discount: discountAmount,
      total: total,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: selectedPaymentMethod === 'COD' ? 'Chưa thanh toán' : 'Đã thanh toán',
      status: 'pending', // 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Save to orders db
    const orders = getFromDB(DB_KEYS.ORDERS);
    orders.unshift(newOrder);
    saveToDB(DB_KEYS.ORDERS, orders);

    // Clear cart
    saveToDB(DB_KEYS.CART, []);
    updateCartBadge();

    // Show Success Modal
    document.getElementById('order-success-code').textContent = orderId;
    document.getElementById('order-success-total').textContent = formatCurrency(total);
    document.getElementById('order-success-payment').textContent = selectedPaymentMethod;
    ModalManager.open('order-success-modal');

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Đặt hàng thành công!';
  }, 1200);
}

// ==========================================================================
// ORDER HISTORY LOGIC (order-history.html)
// ==========================================================================
let orderTableHelper = null;

function initOrderHistoryPage() {
  const orders = getFromDB(DB_KEYS.ORDERS);

  orderTableHelper = new DataTableHelper({
    tableId: 'orders-table',
    tbodyId: 'orders-tbody',
    data: orders,
    pageSize: 6,
    defaultSortKey: 'date',
    defaultSortOrder: 'desc',
    searchFields: ['id', 'customerName', 'phone'],
    paginationContainerId: 'orders-pagination',
    emptyStateMessage: 'Bạn chưa có đơn hàng nào hoặc không tìm thấy đơn phù hợp.',
    renderRow: (order) => {
      let statusBadge = '<span class="badge badge-warning">Chờ xác nhận</span>';
      if (order.status === 'processing') statusBadge = '<span class="badge badge-primary">Đang xử lý</span>';
      if (order.status === 'shipping') statusBadge = '<span class="badge badge-primary">Đang giao hàng</span>';
      if (order.status === 'completed') statusBadge = '<span class="badge badge-success">Giao thành công</span>';
      if (order.status === 'cancelled') statusBadge = '<span class="badge badge-danger">Đã hủy</span>';

      const itemsSummary = order.items.map(i => `${i.name} (x${i.quantity})`).join(', ');

      return `
        <tr>
          <td><strong style="color: var(--primary);">${order.id}</strong></td>
          <td style="white-space: nowrap;">${order.date}</td>
          <td style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsSummary}">
            ${itemsSummary}
          </td>
          <td><strong style="color: var(--dark);">${formatCurrency(order.total)}</strong></td>
          <td>${statusBadge}</td>
          <td>
            <span class="badge ${order.paymentStatus === 'Đã thanh toán' ? 'badge-success' : 'badge-secondary'}">
              ${order.paymentStatus} (${order.paymentMethod})
            </span>
          </td>
          <td class="text-right">
            <button class="btn btn-outline btn-sm" onclick="viewOrderDetail('${order.id}')">Xem chi tiết</button>
          </td>
        </tr>
      `;
    }
  });

  window.ordersTableHelper = orderTableHelper;

  // Search input
  const searchInput = document.getElementById('order-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => orderTableHelper.setSearch(e.target.value));
  }

  // Filter status buttons
  const filterBtns = document.querySelectorAll('.order-status-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-primary');
      orderTableHelper.setFilter(btn.dataset.status);
    });
  });
}

function viewOrderDetail(orderId) {
  const orders = getFromDB(DB_KEYS.ORDERS);
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('modal-order-id').textContent = order.id;
  document.getElementById('modal-order-date').textContent = order.date;
  document.getElementById('modal-order-receiver').textContent = `${order.customerName} • ${order.phone}`;
  document.getElementById('modal-order-address').textContent = order.address;
  document.getElementById('modal-order-status').textContent = order.status;
  document.getElementById('modal-order-payment').textContent = `${order.paymentStatus} (${order.paymentMethod})`;

  const itemsContainer = document.getElementById('modal-order-items');
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(item => `
      <div class="d-flex items-center justify-between" style="padding: 10px 0; border-bottom: 1px solid var(--border);">
        <div class="d-flex items-center gap-3">
          <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;">
          <div>
            <div style="font-weight: 700;">${item.name}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${formatCurrency(item.price)} x ${item.quantity}</div>
          </div>
        </div>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
      </div>
    `).join('');
  }

  document.getElementById('modal-order-subtotal').textContent = formatCurrency(order.subtotal);
  document.getElementById('modal-order-shipping').textContent = formatCurrency(order.shipping);
  document.getElementById('modal-order-total').textContent = formatCurrency(order.total);

  ModalManager.open('order-detail-modal');
}

