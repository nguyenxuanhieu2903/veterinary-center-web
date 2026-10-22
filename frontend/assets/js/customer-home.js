/**
 * PETCARE CLINIC - CUSTOMER PORTAL & SERVICE JS
 */

function initStatsCountUp() {
  const statsSection = document.querySelector('.stats-ribbon');
  if (!statsSection) return;

  const counters = statsSection.querySelectorAll('[data-count-target]');
  if (counters.length === 0) return;

  let hasAnimated = false;
  const renderValue = (counter, value) => {
    const locale = window.currentLanguage === 'en' ? 'en-US' : 'vi-VN';
    const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    counter.textContent = `${formatter.format(value)}${counter.dataset.countSuffix || ''}`;
  };
  const renderFinalValues = () => {
    counters.forEach(counter => {
      renderValue(counter, Number(counter.dataset.countTarget));
    });
  };

  window.addEventListener('petcare:languagechange', () => {
    if (hasAnimated) renderFinalValues();
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    hasAnimated = true;
    renderFinalValues();
    return;
  }

  counters.forEach(counter => renderValue(counter, 0));

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;

    observer.disconnect();
    const duration = 1800;
    const startTime = performance.now();

    const updateCounters = currentTime => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      counters.forEach(counter => {
        const target = Number(counter.dataset.countTarget);
        renderValue(counter, Math.floor(target * easedProgress));
      });

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      } else {
        hasAnimated = true;
        renderFinalValues();
      }
    };

    requestAnimationFrame(updateCounters);
  }, { threshold: 0.1 });

  observer.observe(statsSection);
}

// Render Home Page Dynamic Content
function initHomePage() {
  initStatsCountUp();
  renderFeaturedServices();
  renderDoctorsList();
  renderFeaturedProducts();
}

// Render Featured Services on Home Page
function renderFeaturedServices() {
  const container = document.getElementById('featured-services-grid');
  if (!container) return;

  const services = getFromDB(DB_KEYS.SERVICES);
  const featured = services.slice(0, 3); // Top 3

  container.innerHTML = featured.map(srv => `
    <div class="service-card">
      <div class="service-card-img-wrap">
        <img src="${srv.image}" alt="${srv.name}" class="service-card-img">
        <span class="badge badge-primary service-card-badge">⭐ ${srv.rating}</span>
      </div>
      <div class="service-card-body">
        <h3 class="service-card-title">${srv.name}</h3>
        <p class="service-card-desc">${srv.shortDesc}</p>
        <div class="service-card-footer">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Chi phí từ</span>
            <span class="service-price">${formatCurrency(srv.price)}</span>
          </div>
          <div class="d-flex gap-2">
            <a href="pages/service-detail.html?id=${srv.id}" class="btn btn-outline btn-sm">Chi tiết</a>
            <a href="pages/booking.html?serviceId=${srv.id}" class="btn btn-primary btn-sm">Đặt lịch</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Doctors List on Home Page
function renderDoctorsList() {
  const container = document.getElementById('doctors-grid');
  if (!container) return;

  const doctors = getFromDB(DB_KEYS.DOCTORS);

  container.innerHTML = doctors.map(doc => `
    <div class="doctor-card">
      <div class="doctor-avatar-wrap">
        <img src="${doc.avatar}" alt="${doc.name}" class="doctor-avatar">
      </div>
      <h3 class="doctor-name">${doc.name}</h3>
      <div class="doctor-specialty">${doc.specialty}</div>
      <p class="doctor-bio">${doc.bio}</p>
      <div class="d-flex justify-center gap-2">
        <a href="pages/booking.html?doctorId=${doc.id}" class="btn btn-primary btn-sm btn-block">Đặt lịch với bác sĩ</a>
      </div>
    </div>
  `).join('');
}

// Render Featured Products on Home Page
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  const products = getFromDB(DB_KEYS.PRODUCTS);
  const featured = products.slice(0, 4);

  container.innerHTML = featured.map(prod => `
    <div class="card" style="padding: 16px; display: flex; flex-direction: column;">
      <div style="position: relative; border-radius: 12px; overflow: hidden; margin-bottom: 14px;">
        <img src="${prod.image}" alt="${prod.name}" style="width: 100%; height: 180px; object-fit: cover;">
        ${prod.originalPrice > prod.price ? `<span class="badge badge-danger" style="position: absolute; top: 10px; left: 10px;">Giảm ${Math.round((1 - prod.price/prod.originalPrice)*100)}%</span>` : ''}
      </div>
      <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px; flex: 1;">
        <a href="pages/product-detail.html?id=${prod.id}">${prod.name}</a>
      </h4>
      <div class="d-flex items-center justify-between" style="margin-bottom: 14px;">
        <div>
          <span style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">${formatCurrency(prod.price)}</span>
          ${prod.originalPrice > prod.price ? `<span style="font-size: 0.82rem; text-decoration: line-through; color: var(--text-muted); margin-left: 6px;">${formatCurrency(prod.originalPrice)}</span>` : ''}
        </div>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Đã bán ${prod.sold}</span>
      </div>
      <button class="btn btn-primary btn-sm btn-block" onclick="addToCart('${prod.id}', 1)">
        🛒 Thêm vào giỏ
      </button>
    </div>
  `).join('');
}

// Render Services on services.html
function initServicesPage() {
  renderServicesFilterList('all');

  const filterButtons = document.querySelectorAll('.service-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterButtons.forEach(b => b.classList.add('btn-outline'));
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-primary');
      renderServicesFilterList(btn.dataset.category);
    });
  });

  const searchInput = document.getElementById('service-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderServicesFilterList('all', q);
    });
  }
}

function renderServicesFilterList(category = 'all', searchQuery = '') {
  const container = document.getElementById('services-list-container');
  if (!container) return;

  const services = getFromDB(DB_KEYS.SERVICES);
  const filtered = services.filter(srv => {
    const matchCat = (category === 'all' || srv.category === category);
    const matchSearch = (!searchQuery || srv.name.toLowerCase().includes(searchQuery) || srv.shortDesc.toLowerCase().includes(searchQuery));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🐾</div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--dark);">Không tìm thấy dịch vụ phù hợp</h3>
        <p style="color: var(--text-muted);">Vui lòng thử tìm với từ khóa khác hoặc liên hệ hotline để được tư vấn.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(srv => `
    <div class="service-card">
      <div class="service-card-img-wrap">
        <img src="${srv.image}" alt="${srv.name}" class="service-card-img">
        <span class="badge badge-primary service-card-badge">⏱️ ${srv.duration}</span>
      </div>
      <div class="service-card-body">
        <div class="d-flex items-center justify-between" style="margin-bottom: 8px;">
          <span class="badge badge-secondary" style="text-transform: uppercase;">${srv.category}</span>
          <span style="font-size: 0.85rem; font-weight: 700; color: #f59e0b;">★ ${srv.rating}</span>
        </div>
        <h3 class="service-card-title">${srv.name}</h3>
        <p class="service-card-desc">${srv.shortDesc}</p>
        <div class="service-card-footer">
          <div>
            <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">Chi phí dịch vụ</span>
            <span class="service-price">${formatCurrency(srv.price)}</span>
          </div>
          <div class="d-flex gap-2">
            <a href="service-detail.html?id=${srv.id}" class="btn btn-outline btn-sm">Xem chi tiết</a>
            <a href="booking.html?serviceId=${srv.id}" class="btn btn-primary btn-sm">Đặt lịch ngay</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Service Detail on service-detail.html
function initServiceDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('id') || 'srv-1';
  const services = getFromDB(DB_KEYS.SERVICES);
  const service = services.find(s => s.id === serviceId) || services[0];

  document.title = `${service.name} - PetCare Clinic`;

  const titleEl = document.getElementById('service-detail-title');
  const priceEl = document.getElementById('service-detail-price');
  const durationEl = document.getElementById('service-detail-duration');
  const descEl = document.getElementById('service-detail-desc');
  const fullDescEl = document.getElementById('service-detail-full-desc');
  const imageEl = document.getElementById('service-detail-image');
  const bookBtnEl = document.getElementById('service-detail-book-btn');
  const processEl = document.getElementById('service-detail-process');

  if (titleEl) titleEl.textContent = service.name;
  if (priceEl) priceEl.textContent = formatCurrency(service.price);
  if (durationEl) durationEl.textContent = service.duration;
  if (descEl) descEl.textContent = service.shortDesc;
  if (fullDescEl) fullDescEl.textContent = service.fullDesc;
  if (imageEl) imageEl.src = service.image;
  if (bookBtnEl) bookBtnEl.href = `booking.html?serviceId=${service.id}`;

  if (processEl && service.process) {
    processEl.innerHTML = service.process.map((step, idx) => `
      <div style="display: flex; gap: 14px; margin-bottom: 16px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); color: var(--primary); font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          ${idx + 1}
        </div>
        <div>
          <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 2px;">Bước ${idx + 1}: ${step}</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Được thực hiện bởi bác sĩ thú y có chứng chỉ hành nghề theo quy chuẩn quốc tế.</p>
        </div>
      </div>
    `).join('');
  }

  // Related Services
  const relatedContainer = document.getElementById('related-services-container');
  if (relatedContainer) {
    const related = services.filter(s => s.id !== service.id).slice(0, 3);
    relatedContainer.innerHTML = related.map(s => `
      <div class="card" style="padding: 16px;">
        <img src="${s.image}" alt="${s.name}" style="height: 140px; width: 100%; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px;">${s.name}</h4>
        <div class="d-flex items-center justify-between">
          <span style="font-weight: 800; color: var(--primary);">${formatCurrency(s.price)}</span>
          <a href="service-detail.html?id=${s.id}" class="btn btn-outline btn-sm">Xem</a>
        </div>
      </div>
    `).join('');
  }
}
