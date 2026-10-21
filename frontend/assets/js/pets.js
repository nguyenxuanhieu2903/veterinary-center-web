/**
 * PETCARE CLINIC - PET MANAGEMENT JS
 */

let currentFilterSpecies = 'all';
let currentSearchTerm = '';

// Initialize Pets List Page
function initPetsPage() {
  renderPetsList();

  const searchInput = document.getElementById('pet-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value.toLowerCase().trim();
      renderPetsList();
    });
  }

  const filterBtns = document.querySelectorAll('.pet-species-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-primary');
      currentFilterSpecies = btn.dataset.species;
      renderPetsList();
    });
  });
}

// Render Pets List
function renderPetsList() {
  const container = document.getElementById('pets-grid');
  if (!container) return;

  const user = getCurrentUser();
  const allPets = getFromDB(DB_KEYS.PETS);

  // Filter by owner if customer, or show all if admin/doctor
  let pets = allPets;
  if (user && user.role === 'customer') {
    pets = allPets.filter(p => !p.ownerId || p.ownerId === user.id);
  }

  // Filter by species and search term
  const filtered = pets.filter(p => {
    const matchSpecies = (currentFilterSpecies === 'all' || p.species === currentFilterSpecies);
    const matchSearch = (!currentSearchTerm || 
      p.name.toLowerCase().includes(currentSearchTerm) || 
      p.breed.toLowerCase().includes(currentSearchTerm));
    return matchSpecies && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 16px; border: 1px dashed var(--border);">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">🐶🐱</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Chưa có hồ sơ thú cưng nào</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Hãy tạo hồ sơ cho bé yêu của bạn để quản lý sức khỏe và đặt lịch khám dễ dàng.</p>
        <button class="btn btn-primary" onclick="openPetModal()">➕ Thêm thú cưng mới</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(pet => `
    <div class="pet-card">
      <div class="pet-card-image-wrap">
        <img src="${pet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400'}" alt="${pet.name}" class="pet-card-image">
        <span class="badge ${pet.species === 'cat' ? 'badge-primary' : 'badge-warning'} pet-card-badge">
          ${pet.species === 'cat' ? '🐱 Mèo' : '🐶 Chó'}
        </span>
      </div>
      <div class="pet-card-body">
        <div class="d-flex items-center justify-between">
          <h3 class="pet-name">${pet.name}</h3>
          <span class="badge ${pet.vaccinated ? 'badge-success' : 'badge-secondary'}" style="font-size: 0.75rem;">
            ${pet.vaccinated ? '✓ Đã tiêm chủng' : 'Chưa tiêm phòng'}
          </span>
        </div>
        <div class="pet-breed">${pet.breed}</div>
        
        <div class="pet-meta-grid">
          <div class="pet-meta-item">
            <span>Giới tính:</span>
            <strong>${pet.gender || 'Chưa rõ'}</strong>
          </div>
          <div class="pet-meta-item">
            <span>Tuổi:</span>
            <strong>${pet.age || '---'}</strong>
          </div>
          <div class="pet-meta-item">
            <span>Cân nặng:</span>
            <strong>${pet.weight || '---'}</strong>
          </div>
          <div class="pet-meta-item">
            <span>Màu lông:</span>
            <strong>${pet.color || '---'}</strong>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px; flex: 1;">
          <strong>Ghi chú:</strong> ${pet.notes || 'Không có ghi chú đặc biệt.'}
        </p>

        <div class="pet-card-actions">
          <a href="pet-detail.html?id=${pet.id}" class="btn btn-outline btn-sm flex-1">📋 Xem hồ sơ y tế</a>
          <button class="btn btn-outline btn-sm" onclick="editPet('${pet.id}')" title="Chỉnh sửa thông tin">✏️</button>
          <button class="btn btn-danger-outline btn-sm" onclick="confirmDeletePet('${pet.id}', '${pet.name}')" title="Xóa hồ sơ">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Open Modal to Add Pet
function openPetModal(petToEdit = null) {
  const modalTitle = document.getElementById('pet-modal-title');
  const petIdInput = document.getElementById('pet-form-id');
  const nameInput = document.getElementById('pet-name');
  const speciesInput = document.getElementById('pet-species');
  const breedInput = document.getElementById('pet-breed');
  const genderInput = document.getElementById('pet-gender');
  const birthInput = document.getElementById('pet-birth');
  const weightInput = document.getElementById('pet-weight');
  const colorInput = document.getElementById('pet-color');
  const notesInput = document.getElementById('pet-notes');
  const imageInput = document.getElementById('pet-image');
  const imagePreview = document.getElementById('pet-image-preview');

  if (petToEdit) {
    modalTitle.textContent = `Chỉnh sửa hồ sơ: ${petToEdit.name}`;
    petIdInput.value = petToEdit.id;
    nameInput.value = petToEdit.name;
    speciesInput.value = petToEdit.species;
    breedInput.value = petToEdit.breed;
    genderInput.value = petToEdit.gender;
    birthInput.value = petToEdit.birthDate || '';
    weightInput.value = petToEdit.weight ? petToEdit.weight.replace(' kg', '') : '';
    colorInput.value = petToEdit.color || '';
    notesInput.value = petToEdit.notes || '';
    imageInput.value = petToEdit.image || '';
    imagePreview.src = petToEdit.image || '';
    imagePreview.style.display = petToEdit.image ? 'block' : 'none';
  } else {
    modalTitle.textContent = 'Thêm hồ sơ thú cưng mới';
    document.getElementById('pet-form').reset();
    petIdInput.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }

  ModalManager.open('pet-modal');
}

// Handle Pet Form Submission
function handlePetFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('pet-form-id').value;
  const name = document.getElementById('pet-name').value.trim();
  const species = document.getElementById('pet-species').value;
  const breed = document.getElementById('pet-breed').value.trim();
  const gender = document.getElementById('pet-gender').value;
  const birthDate = document.getElementById('pet-birth').value;
  const weight = document.getElementById('pet-weight').value.trim();
  const color = document.getElementById('pet-color').value.trim();
  const notes = document.getElementById('pet-notes').value.trim();
  let image = document.getElementById('pet-image').value.trim();

  if (!name || !breed) {
    showToast('Vui lòng nhập tên và giống của thú cưng!', 'warning');
    return;
  }

  if (!image) {
    // Default placeholder based on species
    image = species === 'cat' 
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500'
      : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500';
  }

  ModalManager.setLoading('pet-modal', true, 'Đang lưu hồ sơ thú cưng...');

  setTimeout(() => {
    let pets = getFromDB(DB_KEYS.PETS);
    const user = getCurrentUser();

    if (id) {
      // Update
      const index = pets.findIndex(p => p.id === id);
      if (index > -1) {
        pets[index] = {
          ...pets[index],
          name, species, breed, gender, birthDate,
          weight: weight ? `${weight} kg` : pets[index].weight,
          color, notes, image
        };
        showToast(`Đã cập nhật hồ sơ bé "${name}" thành công!`, 'success');
      }
    } else {
      // Create new
      const newPet = {
        id: 'pet-' + Date.now().toString().slice(-4),
        name,
        species,
        breed,
        gender,
        birthDate,
        age: birthDate ? `${new Date().getFullYear() - new Date(birthDate).getFullYear()} tuổi` : '1 tuổi',
        weight: weight ? `${weight} kg` : '3.0 kg',
        color,
        notes,
        image,
        microchip: `VN-${Math.floor(1000 + Math.random() * 9000)}-${species.toUpperCase()}`,
        ownerId: user ? user.id : 'user-01',
        ownerName: user ? user.name : 'Khách hàng',
        vaccinated: false
      };
      pets.unshift(newPet);
      showToast(`Đã thêm mới hồ sơ bé "${name}"!`, 'success');
    }

    saveToDB(DB_KEYS.PETS, pets);
    ModalManager.setLoading('pet-modal', false);
    ModalManager.close('pet-modal');
    renderPetsList();
  }, 600);
}

// Edit Pet
function editPet(petId) {
  const pets = getFromDB(DB_KEYS.PETS);
  const pet = pets.find(p => p.id === petId);
  if (pet) {
    openPetModal(pet);
  }
}

// Confirm Delete Pet
function confirmDeletePet(petId, petName) {
  ModalManager.confirm({
    title: 'Xóa hồ sơ thú cưng',
    message: `Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ của bé <strong>"${petName}"</strong>? Dữ liệu lịch sử khám của bé sẽ không thể khôi phục.`,
    confirmText: 'Xác nhận xóa',
    cancelText: 'Giữ lại',
    isDanger: true,
    onConfirm: async () => {
      let pets = getFromDB(DB_KEYS.PETS);
      pets = pets.filter(p => p.id !== petId);
      saveToDB(DB_KEYS.PETS, pets);
      showToast(`Đã xóa hồ sơ của "${petName}"`, 'success');
      renderPetsList();
    }
  });
}

// Render Pet Detail Page (pet-detail.html)
function initPetDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const petId = urlParams.get('id') || 'pet-1';
  const pets = getFromDB(DB_KEYS.PETS);
  const pet = pets.find(p => p.id === petId) || pets[0];

  document.title = `Hồ sơ ${pet.name} - PetCare Clinic`;

  // Basic Info
  document.getElementById('detail-pet-name').textContent = pet.name;
  document.getElementById('detail-pet-breed').textContent = `${pet.breed} • ${pet.gender}`;
  document.getElementById('detail-pet-image').src = pet.image;
  document.getElementById('detail-pet-species').textContent = pet.species === 'cat' ? 'Mèo' : 'Chó';
  document.getElementById('detail-pet-age').textContent = pet.age || '---';
  document.getElementById('detail-pet-weight').textContent = pet.weight || '---';
  document.getElementById('detail-pet-chip').textContent = pet.microchip || 'Chưa cấy chip';
  document.getElementById('detail-pet-notes').textContent = pet.notes || 'Không có tiền sử dị ứng.';
  document.getElementById('btn-book-for-pet').href = `booking.html?petId=${pet.id}`;

  // Medical Records for this pet
  const allRecords = getFromDB(DB_KEYS.MEDICAL_RECORDS);
  const records = allRecords.filter(r => r.petId === pet.id);
  const timelineContainer = document.getElementById('pet-medical-timeline');

  if (timelineContainer) {
    if (records.length === 0) {
      timelineContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">📋</div>
          <p>Chưa có lịch sử bệnh án ghi nhận cho bé.</p>
        </div>
      `;
    } else {
      timelineContainer.innerHTML = records.map(rec => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="d-flex items-center justify-between" style="margin-bottom: 8px;">
              <span style="font-weight: 700; color: var(--dark); font-size: 1.05rem;">Ngày khám: ${rec.date}</span>
              <span class="badge badge-primary">BS. ${rec.doctorName}</span>
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 8px;">
              <strong>Chẩn đoán:</strong> <span style="color: var(--danger); font-weight: 600;">${rec.diagnosis}</span>
            </div>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
              <strong>Phương pháp điều trị:</strong> ${rec.treatment}
            </div>
            ${rec.prescription && rec.prescription.length > 0 ? `
              <div style="background-color: #f8fafc; padding: 10px 14px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 8px;">
                <strong>Đơn thuốc:</strong>
                <ul style="margin-top: 4px; padding-left: 18px; list-style: disc;">
                  ${rec.prescription.map(p => `<li>${p.name} - ${p.dosage} (${p.days})</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            ${rec.reExamDate ? `<div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">📅 Hẹn tái khám: ${rec.reExamDate}</div>` : ''}
          </div>
        </div>
      `).join('');
    }
  }
}

