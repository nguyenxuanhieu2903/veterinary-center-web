/**
 * PETCARE CLINIC - PET MANAGEMENT JS
 */

let currentFilterSpecies = 'all';
let currentSearchTerm = '';
let selectedPetImage = null;
let petImagePreviewUrl = null;
let removePetImage = false;

// Initialize Pets List Page
function initPetsPage() {
  renderPetsList();
  initPetImageUpload();

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

function initPetImageUpload() {
  const input = document.getElementById('pet-image');
  const dropzone = document.getElementById('pet-image-dropzone');
  const modal = document.getElementById('pet-modal');
  if (!input || !dropzone || !modal) return;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) acceptPetImage(file);
    input.value = '';
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, event => {
      event.preventDefault();
      dropzone.classList.add('is-dragging');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, event => {
      event.preventDefault();
      dropzone.classList.remove('is-dragging');
    });
  });

  dropzone.addEventListener('drop', event => {
    const [file] = event.dataTransfer.files;
    if (file) acceptPetImage(file);
  });

  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    if (modal.querySelector('.modal-loading-overlay.active')) {
      event.stopImmediatePropagation();
      return;
    }
    releasePetImagePreview();
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && ModalManager.activeModal?.id === 'pet-modal') {
      if (modal.querySelector('.modal-loading-overlay.active')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      releasePetImagePreview();
    }
  }, true);
}

function acceptPetImage(file) {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showPetImageError('Định dạng ảnh không hợp lệ. Vui lòng chọn PNG, JPG, JPEG hoặc WEBP.');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showPetImageError('Ảnh vượt quá dung lượng tối đa 5MB. Vui lòng chọn ảnh nhỏ hơn.');
    return;
  }

  clearPetImageError();
  selectedPetImage = file;
  removePetImage = false;
  if (petImagePreviewUrl) URL.revokeObjectURL(petImagePreviewUrl);
  petImagePreviewUrl = URL.createObjectURL(file);
  showPetImagePreview(petImagePreviewUrl);
}

function showPetImagePreview(source) {
  const preview = document.getElementById('pet-image-preview');
  preview.src = source;
  preview.hidden = false;
  document.getElementById('pet-image-empty').hidden = true;
  document.getElementById('pet-image-actions').hidden = false;
}

function showEmptyPetImagePreview() {
  document.getElementById('pet-image-preview').hidden = true;
  document.getElementById('pet-image-preview').removeAttribute('src');
  document.getElementById('pet-image-empty').hidden = false;
  document.getElementById('pet-image-actions').hidden = true;
}

function showPetImageError(message) {
  const error = document.getElementById('pet-image-error');
  error.textContent = message;
  error.hidden = false;
  showToast(message, 'error');
}

function clearPetImageError() {
  const error = document.getElementById('pet-image-error');
  error.textContent = '';
  error.hidden = true;
}

function clearPetImage() {
  selectedPetImage = null;
  removePetImage = true;
  const input = document.getElementById('pet-image');
  if (input) input.value = '';
  if (petImagePreviewUrl) {
    URL.revokeObjectURL(petImagePreviewUrl);
    petImagePreviewUrl = null;
  }
  clearPetImageError();
  showEmptyPetImagePreview();
}

function releasePetImagePreview() {
  if (petImagePreviewUrl) URL.revokeObjectURL(petImagePreviewUrl);
  petImagePreviewUrl = null;
  selectedPetImage = null;
  removePetImage = false;
}

function closePetModal() {
  releasePetImagePreview();
  ModalManager.close('pet-modal');
}

// Render Pets List
function renderPetsList() {
  const container = document.getElementById('pets-grid');
  if (!container) return;

  const user = getCurrentUser();
  const allPets = getFromDB(DB_KEYS.PETS);

  // Filter by owner if customer, or show all if admin/doctor
  let pets = allPets;
  if (user && user.role === 'customer' && !document.querySelector('.admin-dashboard')) {
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

  container.innerHTML = filtered.map(pet => {
    const fallbackImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400';
    return `
    <div class="pet-card">
      <div class="pet-card-image-wrap">
        <img src="${pet.image && !pet.image.startsWith(PET_IMAGE_REFERENCE_PREFIX) ? pet.image : fallbackImage}" data-pet-image="${pet.id}" alt="${pet.name}" class="pet-card-image">
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
          <strong>Ghi chú:</strong> ${pet.notes
            ? `<span data-user-content>${pet.notes}</span>`
            : 'Không có ghi chú đặc biệt.'}
        </p>

        <div class="pet-card-actions">
          <a href="pet-detail.html?id=${pet.id}" class="btn btn-outline btn-sm flex-1">📋 Xem hồ sơ y tế</a>
          <button class="btn btn-outline btn-sm" onclick="editPet('${pet.id}')" title="Chỉnh sửa thông tin">✏️</button>
          <button class="btn btn-danger-outline btn-sm" onclick="confirmDeletePet('${pet.id}', '${pet.name}')" title="Xóa hồ sơ">🗑️</button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  filtered.forEach(pet => {
    const image = container.querySelector(`[data-pet-image="${pet.id}"]`);
    if (image) {
      setPetImageSource(image, pet.image, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400');
    }
  });
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
  const imagePreview = document.getElementById('pet-image-preview');
  releasePetImagePreview();
  clearPetImageError();
  document.getElementById('pet-form').reset();
  showEmptyPetImagePreview();

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
    const currentImage = petToEdit.image || '';
    if (currentImage) {
      showPetImagePreview('');
      setPetImageSource(imagePreview, currentImage);
    }
  } else {
    modalTitle.textContent = 'Thêm hồ sơ thú cưng mới';
    petIdInput.value = '';
  }

  ModalManager.open('pet-modal');
}

// Handle Pet Form Submission
async function handlePetFormSubmit(e) {
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
  if (!name || !breed) {
    showToast('Vui lòng nhập tên và giống của thú cưng!', 'warning');
    return;
  }

  ModalManager.setLoading('pet-modal', true, 'Đang lưu hồ sơ thú cưng...');
  try {
    let pets = getFromDB(DB_KEYS.PETS);
    const user = getCurrentUser();
    const existingPet = id ? pets.find(pet => pet.id === id) : null;
    const petId = id || `pet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const oldImage = existingPet?.image || '';
    const defaultImage = species === 'cat'
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500'
      : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500';
    const previousImageId = oldImage.startsWith(PET_IMAGE_REFERENCE_PREFIX)
      ? oldImage.slice(PET_IMAGE_REFERENCE_PREFIX.length)
      : null;
    let image = selectedPetImage
      ? `${PET_IMAGE_REFERENCE_PREFIX}${petId}`
      : removePetImage
        ? ''
        : oldImage || defaultImage;
    const oldStoredImage = previousImageId
      ? await getStoredPetImage(previousImageId)
      : null;
    let imageStoreChanged = false;

    try {
      if (selectedPetImage) {
        await writeStoredPetImage(petId, selectedPetImage);
        imageStoreChanged = true;
      } else if (removePetImage && previousImageId) {
        await deleteStoredPetImage(previousImageId);
        imageStoreChanged = true;
      }

      if (id) {
        const index = pets.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Không tìm thấy hồ sơ thú cưng cần cập nhật.');
        pets[index] = {
          ...pets[index],
          name, species, breed, gender, birthDate,
          weight: weight ? `${weight} kg` : pets[index].weight,
          color, notes, image
        };
      } else {
        pets.unshift({
          id: petId,
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
        });
      }

      saveToDB(DB_KEYS.PETS, pets);
    } catch (error) {
      if (imageStoreChanged) {
        if (previousImageId && oldStoredImage) {
          await writeStoredPetImage(previousImageId, oldStoredImage);
        }
        if (selectedPetImage && petId !== previousImageId) {
          await deleteStoredPetImage(petId);
        } else if (!oldStoredImage) {
          await deleteStoredPetImage(petId);
        }
      }
      throw error;
    }

    if (selectedPetImage && previousImageId && previousImageId !== petId) {
      try {
        await deleteStoredPetImage(previousImageId);
      } catch (error) {
        console.error('Không thể dọn ảnh cũ của hồ sơ thú cưng:', error);
        showToast('Đã lưu hồ sơ nhưng không thể dọn ảnh cũ khỏi bộ nhớ.', 'warning');
      }
    }

    showToast(id ? `Đã cập nhật hồ sơ bé "${name}" thành công!` : `Đã thêm mới hồ sơ bé "${name}"!`, 'success');
    ModalManager.setLoading('pet-modal', false);
    closePetModal();
    renderPetsList();
    if (typeof calculateAdminKPIs === 'function') calculateAdminKPIs();
  } catch (error) {
    console.error('Không thể lưu hồ sơ thú cưng:', error);
    ModalManager.setLoading('pet-modal', false);
    showToast(`Không thể lưu hồ sơ thú cưng: ${error.message}`, 'error');
  }
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
      const pet = pets.find(p => p.id === petId);
      const oldImage = pet?.image || '';
      const storedImage = oldImage.startsWith(PET_IMAGE_REFERENCE_PREFIX)
        ? await getStoredPetImage(oldImage.slice(PET_IMAGE_REFERENCE_PREFIX.length))
        : null;
      pets = pets.filter(p => p.id !== petId);
      try {
        if (storedImage) {
          await deleteStoredPetImage(oldImage.slice(PET_IMAGE_REFERENCE_PREFIX.length));
        }
        saveToDB(DB_KEYS.PETS, pets);
      } catch (error) {
        if (storedImage) {
          await writeStoredPetImage(oldImage.slice(PET_IMAGE_REFERENCE_PREFIX.length), storedImage);
        }
        console.error('Không thể xóa hồ sơ thú cưng:', error);
        showToast(`Không thể xóa hồ sơ thú cưng: ${error.message}`, 'error');
        return;
      }
      showToast(`Đã xóa hồ sơ của "${petName}"`, 'success');
      renderPetsList();
      if (typeof calculateAdminKPIs === 'function') calculateAdminKPIs();
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
  setPetImageSource(
    document.getElementById('detail-pet-image'),
    pet.image,
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400'
  );
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
