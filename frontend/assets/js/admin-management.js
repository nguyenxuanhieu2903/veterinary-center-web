/**
 * Admin single-page navigation and catalog management.
 */

let catalogModalType = 'product';
const adminProductCategoryNames = {
  food: 'Thức ăn & Dinh dưỡng',
  care: 'Vệ sinh & Sữa tắm',
  medicine: 'Thuốc & Trị ve rận',
  toy: 'Đồ chơi',
  accessory: 'Phụ kiện'
};
const adminServiceCategoryNames = {
  general: 'Khám tổng quát',
  vaccine: 'Tiêm phòng Vaccine',
  lab: 'Xét nghiệm & Siêu âm',
  spa: 'Spa & Grooming',
  surgery: 'Phẫu thuật',
  emergency: 'Cấp cứu'
};

function initAdminManagement() {
  const links = document.querySelectorAll('[data-admin-section]');
  const sections = [...document.querySelectorAll('.admin-section')];
  const dashboardMain = document.querySelector('.dashboard-main');
  if (!dashboardMain) return;

  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const section = document.getElementById(link.dataset.adminSection);
      if (!section) return;
      history.replaceState(null, '', `#${section.id}`);
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveAdminSection(section.id);
      if (window.matchMedia('(max-width: 768px)').matches) {
        document.getElementById('dashboard-sidebar').classList.remove('mobile-open');
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveAdminSection(visible.target.id);
    }, { root: dashboardMain, rootMargin: '-15% 0px -70% 0px', threshold: [0, 0.1, 0.4] });
    sections.forEach(section => observer.observe(section));
  }

  const search = document.getElementById('pet-search-input');
  if (search) {
    search.addEventListener('input', event => {
      currentSearchTerm = event.target.value.toLowerCase().trim();
      renderPetsList();
    });
  }

  document.querySelectorAll('.pet-species-filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.pet-species-filter-btn').forEach(filter => {
        filter.classList.remove('active', 'btn-primary');
        filter.classList.add('btn-outline');
      });
      button.classList.add('active', 'btn-primary');
      button.classList.remove('btn-outline');
      currentFilterSpecies = button.dataset.species;
      renderPetsList();
    });
  });

  initPetImageUpload();
  renderPetsList();
  renderAdminProducts();
  renderAdminServices();

  const hashTarget = window.location.hash.slice(1);
  if (hashTarget && document.getElementById(hashTarget)) {
    requestAnimationFrame(() => document.getElementById(hashTarget).scrollIntoView({ block: 'start' }));
  }
}

function setActiveAdminSection(sectionId) {
  document.querySelectorAll('[data-admin-section]').forEach(link => {
    const active = link.dataset.adminSection === sectionId;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function escapeAdminHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;
  const products = getFromDB(DB_KEYS.PRODUCTS);
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có sản phẩm nào.</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(product => {
    const image = escapeAdminHtml(product.image || '');
    const name = escapeAdminHtml(product.name);
    const category = escapeAdminHtml(adminProductCategoryNames[product.category] || product.category || '—');
    const stock = Math.max(0, Number(product.stock) || 0);
    const available = stock > 0;
    return `
      <tr>
        <td><div class="admin-product-cell"><img src="${image}" alt="" loading="lazy"><strong data-user-content>${name}</strong></div></td>
        <td>${category}</td>
        <td><strong>${formatCurrency(Number(product.price) || 0)}</strong></td>
        <td>${stock}</td>
        <td><span class="badge ${available ? 'badge-success' : 'badge-secondary'}">${available ? 'Còn hàng' : 'Hết hàng'}</span></td>
        <td class="text-right"><div class="admin-catalog-actions">
          <button type="button" class="admin-stock-toggle ${available ? 'is-available' : ''}" role="switch" aria-checked="${available}" aria-label="${available ? 'Đặt sản phẩm hết hàng' : 'Đánh dấu còn hàng'}" onclick="toggleAdminProductStock('${escapeAdminHtml(product.id)}')"></button>
          <button type="button" class="btn btn-danger-outline btn-sm" aria-label="Xóa ${name}" onclick="deleteAdminProduct('${escapeAdminHtml(product.id)}')">Xóa</button>
        </div></td>
      </tr>
    `;
  }).join('');
}

function toggleAdminProductStock(productId) {
  const products = getFromDB(DB_KEYS.PRODUCTS);
  const product = products.find(item => item.id === productId);
  if (!product) {
    showToast('Không tìm thấy sản phẩm cần cập nhật.', 'error');
    return;
  }

  const currentStock = Math.max(0, Number(product.stock) || 0);
  if (currentStock > 0) {
    product.restockQuantity = currentStock;
    product.stock = 0;
  } else {
    product.stock = Math.max(1, Number(product.restockQuantity) || 1);
    delete product.restockQuantity;
  }
  saveToDB(DB_KEYS.PRODUCTS, products);
  renderAdminProducts();
  showToast(`Đã cập nhật trạng thái tồn kho của "${product.name}".`, 'success');
}

function deleteAdminProduct(productId) {
  const products = getFromDB(DB_KEYS.PRODUCTS);
  const product = products.find(item => item.id === productId);
  if (!product) {
    showToast('Không tìm thấy sản phẩm cần xóa.', 'error');
    return;
  }
  ModalManager.confirm({
    title: 'Xóa sản phẩm',
    message: `Bạn có chắc muốn xóa sản phẩm <strong>${escapeAdminHtml(product.name)}</strong>?`,
    confirmText: 'Xóa sản phẩm',
    isDanger: true,
    onConfirm: async () => {
      saveToDB(DB_KEYS.PRODUCTS, getFromDB(DB_KEYS.PRODUCTS).filter(item => item.id !== productId));
      renderAdminProducts();
      showToast(`Đã xóa sản phẩm "${product.name}".`, 'success');
    }
  });
}

function renderAdminServices() {
  const container = document.getElementById('admin-services-grid');
  if (!container) return;
  const services = getFromDB(DB_KEYS.SERVICES);
  if (services.length === 0) {
    container.innerHTML = '<div class="admin-empty-state">Chưa có dịch vụ nào.</div>';
    return;
  }
  container.innerHTML = services.map(service => `
    <article class="admin-service-card">
      <img src="${escapeAdminHtml(service.image || '')}" alt="" loading="lazy">
      <div class="admin-service-card-content">
        <div class="d-flex items-center justify-between gap-2">
          <span class="badge badge-secondary">${escapeAdminHtml(adminServiceCategoryNames[service.category] || service.category || 'Dịch vụ')}</span>
          <span class="admin-service-duration">⏱ ${escapeAdminHtml(service.duration || '—')}</span>
        </div>
        <h4 data-user-content>${escapeAdminHtml(service.name)}</h4>
        <p>${escapeAdminHtml(service.shortDesc || service.fullDesc || '')}</p>
        <div class="admin-service-card-footer">
          <strong>${formatCurrency(Number(service.price) || 0)}</strong>
          <button type="button" class="btn btn-danger-outline btn-sm" onclick="deleteAdminService('${escapeAdminHtml(service.id)}')">Xóa dịch vụ</button>
        </div>
      </div>
    </article>
  `).join('');
}

function deleteAdminService(serviceId) {
  const services = getFromDB(DB_KEYS.SERVICES);
  const service = services.find(item => item.id === serviceId);
  if (!service) {
    showToast('Không tìm thấy dịch vụ cần xóa.', 'error');
    return;
  }
  ModalManager.confirm({
    title: 'Xóa dịch vụ',
    message: `Bạn có chắc muốn xóa dịch vụ <strong>${escapeAdminHtml(service.name)}</strong>?`,
    confirmText: 'Xóa dịch vụ',
    isDanger: true,
    onConfirm: async () => {
      saveToDB(DB_KEYS.SERVICES, getFromDB(DB_KEYS.SERVICES).filter(item => item.id !== serviceId));
      renderAdminServices();
      showToast(`Đã xóa dịch vụ "${service.name}".`, 'success');
    }
  });
}

function openCatalogModal(type) {
  catalogModalType = type === 'service' ? 'service' : 'product';
  const isProduct = catalogModalType === 'product';
  document.getElementById('catalog-modal-title').textContent = isProduct ? 'Thêm sản phẩm mới' : 'Thêm dịch vụ mới';
  document.getElementById('catalog-form-fields').innerHTML = isProduct ? `
    <div class="form-group"><label class="form-label required" for="catalog-name">Tên sản phẩm</label><input class="form-control" id="catalog-name" required maxlength="120"></div>
    <div class="grid grid-2 gap-3">
      <div class="form-group"><label class="form-label required" for="catalog-price">Giá bán (₫)</label><input class="form-control" id="catalog-price" type="number" min="0" step="1" required></div>
      <div class="form-group"><label class="form-label required" for="catalog-stock">Số lượng tồn</label><input class="form-control" id="catalog-stock" type="number" min="0" step="1" value="1" required></div>
    </div>
    <div class="form-group"><label class="form-label required" for="catalog-category">Danh mục</label><select class="form-control" id="catalog-category"><option value="food">Thức ăn & Dinh dưỡng</option><option value="care">Vệ sinh & Sữa tắm</option><option value="medicine">Thuốc & Trị ve rận</option><option value="toy">Đồ chơi</option><option value="accessory">Phụ kiện</option></select></div>
    <div class="form-group"><label class="form-label" for="catalog-image">Đường dẫn ảnh</label><input class="form-control" id="catalog-image" type="url" placeholder="https://..."></div>
    <div class="form-group"><label class="form-label" for="catalog-description">Mô tả</label><textarea class="form-control" id="catalog-description" rows="3"></textarea></div>
  ` : `
    <div class="form-group"><label class="form-label required" for="catalog-name">Tên dịch vụ</label><input class="form-control" id="catalog-name" required maxlength="120"></div>
    <div class="grid grid-2 gap-3">
      <div class="form-group"><label class="form-label required" for="catalog-duration">Thời gian thực hiện</label><input class="form-control" id="catalog-duration" required placeholder="30 phút"></div>
      <div class="form-group"><label class="form-label required" for="catalog-price">Giá tham khảo (₫)</label><input class="form-control" id="catalog-price" type="number" min="0" step="1" required></div>
    </div>
    <div class="form-group"><label class="form-label required" for="catalog-category">Danh mục</label><select class="form-control" id="catalog-category"><option value="general">Khám tổng quát</option><option value="vaccine">Tiêm phòng Vaccine</option><option value="lab">Xét nghiệm & Siêu âm</option><option value="spa">Spa & Grooming</option><option value="surgery">Phẫu thuật</option><option value="emergency">Cấp cứu</option></select></div>
    <div class="form-group"><label class="form-label" for="catalog-image">Đường dẫn ảnh minh họa</label><input class="form-control" id="catalog-image" type="url" placeholder="https://..."></div>
    <div class="form-group"><label class="form-label" for="catalog-description">Mô tả ngắn</label><textarea class="form-control" id="catalog-description" rows="3"></textarea></div>
  `;
  document.getElementById('catalog-form').reset();
  if (isProduct) document.getElementById('catalog-stock').value = '1';
  ModalManager.open('catalog-modal');
}

function saveCatalogItem(event) {
  event.preventDefault();
  const name = document.getElementById('catalog-name').value.trim();
  const price = Number(document.getElementById('catalog-price').value);
  const category = document.getElementById('catalog-category').value;
  const image = document.getElementById('catalog-image').value.trim();
  const description = document.getElementById('catalog-description').value.trim();
  if (!name || !Number.isFinite(price) || price < 0) {
    showToast('Vui lòng nhập tên hợp lệ và giá không âm.', 'warning');
    return;
  }

  if (catalogModalType === 'product') {
    const stock = Number(document.getElementById('catalog-stock').value);
    if (!Number.isInteger(stock) || stock < 0) {
      showToast('Số lượng tồn phải là số nguyên không âm.', 'warning');
      return;
    }
    const products = getFromDB(DB_KEYS.PRODUCTS);
    products.unshift({
      id: `prod-${Date.now()}`, name, category, price, originalPrice: price,
      stock, rating: 0, sold: 0,
      image: image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500',
      description
    });
    saveToDB(DB_KEYS.PRODUCTS, products);
    renderAdminProducts();
    showToast(`Đã thêm sản phẩm "${name}".`, 'success');
  } else {
    const duration = document.getElementById('catalog-duration').value.trim();
    if (!duration) {
      showToast('Vui lòng nhập thời gian thực hiện dịch vụ.', 'warning');
      return;
    }
    const services = getFromDB(DB_KEYS.SERVICES);
    services.unshift({
      id: `srv-${Date.now()}`, name, category, price, duration,
      shortDesc: description, fullDesc: description, process: [],
      image: image || 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600',
      rating: 5, popular: false
    });
    saveToDB(DB_KEYS.SERVICES, services);
    renderAdminServices();
    showToast(`Đã thêm dịch vụ "${name}".`, 'success');
  }
  ModalManager.close('catalog-modal');
}
