/**
 * PETCARE CLINIC - DASHBOARD & MEDICAL RECORDS LOGIC
 */

// Toggle Sidebar Collapse
function toggleSidebar() {
  const sidebar = document.getElementById('dashboard-sidebar');
  if (!sidebar) return;

  if (window.matchMedia('(max-width: 768px)').matches) {
    sidebar.classList.toggle('mobile-open');
    return;
  }

  sidebar.classList.toggle('collapsed');
  const isCollapsed = sidebar.classList.contains('collapsed');
  localStorage.setItem('petcare_sidebar_collapsed', isCollapsed ? 'true' : 'false');
}

// Check Sidebar state on load
function checkSidebarState() {
  const sidebar = document.getElementById('dashboard-sidebar');
  if (!sidebar) return;

  const isCollapsed = localStorage.getItem('petcare_sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  }

  // Update User Profile in Sidebar
  const user = getCurrentUser();
  if (user) {
    const nameEl = document.getElementById('sidebar-user-name');
    const roleEl = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-user-avatar');
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) {
      roleEl.textContent = user.role === 'admin' ? 'Quản trị viên' : user.role === 'doctor' ? 'Bác sĩ chuyên khoa' : 'Khách hàng';
      roleEl.className = `badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'doctor' ? 'badge-primary' : 'badge-success'}`;
    }
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;
  }
}

// ==========================================================================
// ADMIN DASHBOARD
// ==========================================================================
let adminAppointmentTable = null;

function initAdminDashboard() {
  checkSidebarState();
  calculateAdminKPIs();

  const appointments = getFromDB(DB_KEYS.APPOINTMENTS);

  adminAppointmentTable = new DataTableHelper({
    tableId: 'admin-appointments-table',
    tbodyId: 'admin-appointments-tbody',
    data: appointments,
    pageSize: 5,
    defaultSortKey: 'date',
    defaultSortOrder: 'desc',
    searchFields: ['id', 'customerName', 'petName', 'serviceName', 'doctorName'],
    paginationContainerId: 'admin-appointments-pagination',
    emptyStateMessage: 'Không tìm thấy lịch khám nào phù hợp.',
    renderRow: (app) => {
      let statusBadge = '<span class="badge badge-warning">Chờ duyệt</span>';
      if (app.status === 'confirmed') statusBadge = '<span class="badge badge-primary">Đã xác nhận</span>';
      if (app.status === 'in_progress') statusBadge = '<span class="badge badge-warning">Đang khám</span>';
      if (app.status === 'completed') statusBadge = '<span class="badge badge-success">Đã hoàn tất</span>';
      if (app.status === 'cancelled') statusBadge = '<span class="badge badge-danger">Đã hủy</span>';

      return `
        <tr>
          <td><strong style="color: var(--primary);">${app.id}</strong></td>
          <td>
            <strong data-user-content>${app.customerName}</strong>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${app.customerPhone}</div>
          </td>
          <td>
            <strong data-user-content>${app.petName}</strong>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${app.petSpecies}</div>
          </td>
          <td>${app.serviceName}</td>
          <td>${app.time} - ${app.date}</td>
          <td data-user-content>${app.doctorName}</td>
          <td>${statusBadge}</td>
          <td class="text-right">
            <div class="d-flex gap-1 justify-end">
              ${app.status === 'pending' ? `
                <button class="btn btn-primary btn-sm" onclick="adminApproveAppointment('${app.id}')" title="Duyệt lịch">✓ Duyệt</button>
              ` : ''}
              ${app.status !== 'cancelled' && app.status !== 'completed' ? `
                <button class="btn btn-outline btn-sm" onclick="adminCancelAppointment('${app.id}')" title="Hủy lịch" style="color: var(--danger);">✕</button>
              ` : ''}
              <button class="btn btn-outline btn-sm" onclick="adminDeleteAppointment('${app.id}')" title="Xóa hẳn">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }
  });

  window.adminAppointmentTable = adminAppointmentTable;

  // Search Input
  const searchInput = document.getElementById('admin-app-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => adminAppointmentTable.setSearch(e.target.value));
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.admin-app-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-primary');
      adminAppointmentTable.setFilter(btn.dataset.status);
    });
  });

  // Render recent orders table
  renderAdminRecentOrders();
  if (typeof initAdminManagement === 'function') initAdminManagement();
}

function calculateAdminKPIs() {
  const appointments = getFromDB(DB_KEYS.APPOINTMENTS);
  const pets = getFromDB(DB_KEYS.PETS);
  const orders = getFromDB(DB_KEYS.ORDERS);

  const today = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter(a => a.date === today);
  const pendingApps = appointments.filter(a => a.status === 'pending');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const kpiRevenue = document.getElementById('kpi-revenue');
  const kpiTodayApps = document.getElementById('kpi-today-apps');
  const kpiPendingApps = document.getElementById('kpi-pending-apps');
  const kpiTotalPets = document.getElementById('kpi-total-pets');

  if (kpiRevenue) kpiRevenue.textContent = formatCurrency(totalRevenue);
  if (kpiTodayApps) kpiTodayApps.textContent = todayApps.length;
  if (kpiPendingApps) kpiPendingApps.textContent = pendingApps.length;
  if (kpiTotalPets) kpiTotalPets.textContent = pets.length;

  // Update badge in sidebar
  const pendingBadge = document.getElementById('sidebar-pending-badge');
  if (pendingBadge) {
    pendingBadge.textContent = pendingApps.length;
    pendingBadge.style.display = pendingApps.length > 0 ? 'inline-flex' : 'none';
  }
}

function adminApproveAppointment(appId) {
  let appointments = getFromDB(DB_KEYS.APPOINTMENTS);
  const index = appointments.findIndex(a => a.id === appId);
  if (index > -1) {
    appointments[index].status = 'confirmed';
    saveToDB(DB_KEYS.APPOINTMENTS, appointments);
    showToast(`Đã duyệt thành công lịch khám ${appId}!`, 'success');
    adminAppointmentTable.setData(appointments);
    calculateAdminKPIs();
  }
}

function adminCancelAppointment(appId) {
  ModalManager.confirm({
    title: 'Hủy lịch khám',
    message: `Bạn có chắc chắn muốn hủy lịch hẹn <strong>${appId}</strong>? Khách hàng sẽ nhận được thông báo qua SMS/Email.`,
    confirmText: 'Xác nhận hủy',
    isDanger: true,
    onConfirm: async () => {
      let appointments = getFromDB(DB_KEYS.APPOINTMENTS);
      const index = appointments.findIndex(a => a.id === appId);
      if (index > -1) {
        appointments[index].status = 'cancelled';
        saveToDB(DB_KEYS.APPOINTMENTS, appointments);
        showToast(`Đã hủy lịch khám ${appId}`, 'info');
        adminAppointmentTable.setData(appointments);
        calculateAdminKPIs();
      }
    }
  });
}

function adminDeleteAppointment(appId) {
  ModalManager.confirm({
    title: 'Xóa vĩnh viễn lịch khám',
    message: `Bạn có chắc chắn muốn xóa dữ liệu lịch <strong>${appId}</strong> khỏi cơ sở dữ liệu?`,
    confirmText: 'Xóa bỏ',
    isDanger: true,
    onConfirm: async () => {
      let appointments = getFromDB(DB_KEYS.APPOINTMENTS);
      appointments = appointments.filter(a => a.id !== appId);
      saveToDB(DB_KEYS.APPOINTMENTS, appointments);
      showToast(`Đã xóa hoàn toàn lịch khám ${appId}`, 'success');
      adminAppointmentTable.setData(appointments);
      calculateAdminKPIs();
    }
  });
}

function renderAdminRecentOrders() {
  const container = document.getElementById('admin-recent-orders-tbody');
  if (!container) return;

  const orders = getFromDB(DB_KEYS.ORDERS).slice(0, 5);

  container.innerHTML = orders.map(ord => `
    <tr>
      <td><strong style="color: var(--primary);">${ord.id}</strong></td>
      <td data-user-content>${ord.customerName}</td>
      <td><strong>${formatCurrency(ord.total)}</strong></td>
      <td><span class="badge ${ord.status === 'completed' ? 'badge-success' : 'badge-primary'}">${ord.status}</span></td>
      <td style="font-size: 0.82rem; color: var(--text-muted);">${ord.date}</td>
    </tr>
  `).join('');
}

// ==========================================================================
// DOCTOR DASHBOARD (doctor-dashboard.html)
// ==========================================================================
function initDoctorDashboard() {
  checkSidebarState();

  const user = getCurrentUser();
  const appointments = getFromDB(DB_KEYS.APPOINTMENTS);

  // Filter appointments for this doctor (or show all if general demo)
  renderDoctorAppointmentsList('all');

  const filterBtns = document.querySelectorAll('.doctor-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-primary');
      renderDoctorAppointmentsList(btn.dataset.status);
    });
  });
}

function renderDoctorAppointmentsList(statusFilter = 'all') {
  const container = document.getElementById('doctor-appointments-tbody');
  if (!container) return;

  const appointments = getFromDB(DB_KEYS.APPOINTMENTS);

  let filtered = appointments;
  if (statusFilter !== 'all') {
    filtered = appointments.filter(a => a.status === statusFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="text-center" style="padding: 40px;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🩺</div>
          <strong>Không có ca khám nào theo bộ lọc này.</strong>
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = filtered.map(app => {
    let statusBadge = '<span class="badge badge-warning">Chờ xác nhận</span>';
    if (app.status === 'confirmed') statusBadge = '<span class="badge badge-primary">Chờ khám</span>';
    if (app.status === 'in_progress') statusBadge = '<span class="badge badge-primary">Đang khám</span>';
    if (app.status === 'completed') statusBadge = '<span class="badge badge-success">Đã hoàn thành</span>';
    if (app.status === 'cancelled') statusBadge = '<span class="badge badge-danger">Đã hủy</span>';

    return `
      <tr>
        <td><strong style="color: var(--primary);">${app.id}</strong></td>
        <td>
          <strong>${app.time}</strong>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${app.date}</div>
        </td>
        <td>
          <strong data-user-content>${app.petName}</strong> (${app.petSpecies})
          <div style="font-size: 0.8rem; color: var(--text-muted);">Chủ: <span data-user-content>${app.customerName}</span> • ${app.customerPhone}</div>
        </td>
        <td>${app.serviceName}</td>
        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${app.symptom}">
          ${app.symptom || 'Khám tổng quát'}
        </td>
        <td>${statusBadge}</td>
        <td class="text-right">
          <div class="d-flex gap-2 justify-end">
            ${app.status !== 'completed' ? `
              <a href="medical-record.html?appId=${app.id}" class="btn btn-primary btn-sm">
                📋 Khám & Kê đơn
              </a>
            ` : `
              <a href="medical-record.html?appId=${app.id}" class="btn btn-outline btn-sm">
                👁️ Xem bệnh án
              </a>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================================================
// MEDICAL RECORD LOGIC (medical-record.html)
// ==========================================================================
let currentPrescriptionItems = [];

function initMedicalRecordPage() {
  checkSidebarState();

  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('appId') || 'AP001';

  const appointments = getFromDB(DB_KEYS.APPOINTMENTS);
  const appointment = appointments.find(a => a.id === appId) || appointments[0];

  // Pre-fill Appointment & Pet Info
  document.getElementById('med-app-id').textContent = appointment.id;
  document.getElementById('med-pet-name').textContent = appointment.petName;
  document.getElementById('med-pet-species').textContent = appointment.petSpecies;
  document.getElementById('med-customer-name').textContent = `${appointment.customerName} (${appointment.customerPhone})`;
  document.getElementById('med-service-name').textContent = appointment.serviceName;
  document.getElementById('med-symptom-input').value = appointment.symptom || '';

  // Check if existing medical record already saved
  const medicalRecords = getFromDB(DB_KEYS.MEDICAL_RECORDS);
  const existingRecord = medicalRecords.find(r => r.appointmentId === appointment.id);

  if (existingRecord) {
    document.getElementById('med-weight').value = existingRecord.weight || '';
    document.getElementById('med-temp').value = existingRecord.temp || '';
    document.getElementById('med-diagnosis').value = existingRecord.diagnosis || '';
    document.getElementById('med-treatment').value = existingRecord.treatment || '';
    document.getElementById('med-reexam-date').value = existingRecord.reExamDate || '';
    document.getElementById('med-notes').value = existingRecord.notes || '';
    currentPrescriptionItems = existingRecord.prescription || [];
  } else {
    currentPrescriptionItems = [
      { name: 'Kháng sinh Amoxicillin 250mg', dosage: '1 viên / lần x 2 lần / ngày sau ăn', days: '5 ngày' }
    ];
  }

  renderPrescriptionList();
}

function addPrescriptionItem() {
  const name = prompt('Nhập tên thuốc / vật tư y tế:');
  if (!name) return;
  const dosage = prompt('Nhập liều lượng & cách dùng (VD: 1 viên/lần x 2 lần/ngày):') || 'Theo chỉ định';
  const days = prompt('Số ngày dùng thuốc (VD: 5 ngày):') || '5 ngày';

  currentPrescriptionItems.push({ name, dosage, days });
  renderPrescriptionList();
}

function removePrescriptionItem(index) {
  currentPrescriptionItems.splice(index, 1);
  renderPrescriptionList();
}

function renderPrescriptionList() {
  const container = document.getElementById('prescription-list-container');
  if (!container) return;

  if (currentPrescriptionItems.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem; padding: 10px 0;">Chưa có loại thuốc nào được thêm. Bấm "+ Thêm thuốc" bên dưới.</div>';
    return;
  }

  container.innerHTML = currentPrescriptionItems.map((item, idx) => `
    <div class="d-flex items-center justify-between" style="padding: 10px 14px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--border);">
      <div>
        <strong data-user-content style="color: var(--dark); font-size: 0.95rem;">${idx + 1}. ${item.name}</strong>
        <div style="font-size: 0.85rem; color: var(--text-muted);">${item.dosage} • Thời gian: <strong>${item.days}</strong></div>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="removePrescriptionItem(${idx})" style="color: var(--danger); border-color: transparent;">✕</button>
    </div>
  `).join('');
}

function handleSaveMedicalRecord(e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('appId') || 'AP001';

  const appointments = getFromDB(DB_KEYS.APPOINTMENTS);
  const appIndex = appointments.findIndex(a => a.id === appId);
  if (appIndex === -1) return;

  const app = appointments[appIndex];
  const weight = document.getElementById('med-weight').value;
  const temp = document.getElementById('med-temp').value;
  const symptom = document.getElementById('med-symptom-input').value;
  const diagnosis = document.getElementById('med-diagnosis').value;
  const treatment = document.getElementById('med-treatment').value;
  const reExamDate = document.getElementById('med-reexam-date').value;
  const notes = document.getElementById('med-notes').value;

  if (!diagnosis || !treatment) {
    showToast('Vui lòng nhập chẩn đoán và phác đồ điều trị!', 'warning');
    return;
  }

  const user = getCurrentUser();
  const doctorName = user ? user.name : 'BS. Thú Y';

  let records = getFromDB(DB_KEYS.MEDICAL_RECORDS);
  const existingIdx = records.findIndex(r => r.appointmentId === appId);

  const recordObj = {
    id: existingIdx > -1 ? records[existingIdx].id : 'MR-' + Math.floor(100 + Math.random() * 900),
    appointmentId: appId,
    petId: app.petId,
    petName: app.petName,
    ownerName: app.customerName,
    doctorName: doctorName,
    date: new Date().toISOString().split('T')[0],
    weight: weight ? `${weight} kg` : '',
    temp: temp ? `${temp} °C` : '',
    symptoms: symptom,
    diagnosis: diagnosis,
    treatment: treatment,
    prescription: currentPrescriptionItems,
    reExamDate: reExamDate,
    notes: notes
  };

  if (existingIdx > -1) {
    records[existingIdx] = recordObj;
  } else {
    records.unshift(recordObj);
  }

  saveToDB(DB_KEYS.MEDICAL_RECORDS, records);

  // Update appointment status to 'completed'
  appointments[appIndex].status = 'completed';
  saveToDB(DB_KEYS.APPOINTMENTS, appointments);

  showToast('Đã lưu hồ sơ bệnh án và cập nhật ca khám hoàn tất!', 'success');

  setTimeout(() => {
    window.location.href = 'doctor-dashboard.html';
  }, 1000);
}
