/**
 * PETCARE CLINIC - 4-STEP BOOKING WIZARD JS
 */

let bookingData = {
  petId: '',
  petName: '',
  petSpecies: '',
  serviceId: '',
  serviceName: '',
  servicePrice: 0,
  doctorId: '',
  doctorName: 'Bác sĩ chuyên khoa bất kỳ',
  date: '',
  time: '',
  symptom: '',
  notes: '',
  customerName: '',
  customerPhone: ''
};

let currentBookingStep = 1;

// Standard working hours slots
const TIME_SLOTS = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

// Initialize Booking Page
function initBookingWizard() {
  // Query param parsing for deep-linking (e.g. booking.html?serviceId=srv-2&petId=pet-1)
  const urlParams = new URLSearchParams(window.location.search);
  const qServiceId = urlParams.get('serviceId');
  const qDoctorId = urlParams.get('doctorId');
  const qPetId = urlParams.get('petId');

  // Load User Info
  const user = getCurrentUser();
  if (user) {
    bookingData.customerName = user.name || '';
    bookingData.customerPhone = user.phone || '';
    const nameInput = document.getElementById('booking-cust-name');
    const phoneInput = document.getElementById('booking-cust-phone');
    if (nameInput) nameInput.value = bookingData.customerName;
    if (phoneInput) phoneInput.value = bookingData.customerPhone;
  }

  // Set min date to today
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    bookingData.date = today;

    dateInput.addEventListener('change', (e) => {
      bookingData.date = e.target.value;
      renderTimeSlots();
    });
  }

  // Populate choices
  renderPetChoices(qPetId);
  renderServiceChoices(qServiceId);
  renderDoctorChoices(qDoctorId);
  renderTimeSlots();

  goToStep(1);
}

// Wizard Step Navigation
function goToStep(step) {
  if (step < 1 || step > 4) return;

  // Validation before advancing
  if (step > currentBookingStep) {
    if (currentBookingStep === 1 && !bookingData.petId) {
      showToast('Vui lòng chọn thú cưng để tiếp tục!', 'warning');
      return;
    }
    if (currentBookingStep === 2 && !bookingData.serviceId) {
      showToast('Vui lòng chọn dịch vụ thăm khám!', 'warning');
      return;
    }
    if (currentBookingStep === 3 && (!bookingData.date || !bookingData.time)) {
      showToast('Vui lòng chọn ngày và khung giờ khám!', 'warning');
      return;
    }
  }

  // Update Stepper Indicators
  for (let i = 1; i <= 4; i++) {
    const indicator = document.getElementById(`step-indicator-${i}`);
    const content = document.getElementById(`booking-step-${i}`);

    if (indicator) {
      indicator.classList.remove('active', 'completed');
      if (i < step) indicator.classList.add('completed');
      if (i === step) indicator.classList.add('active');
    }

    if (content) {
      content.classList.remove('active');
      if (i === step) content.classList.add('active');
    }
  }

  currentBookingStep = step;

  // If entering step 4, refresh recap
  if (step === 4) {
    updateBookingRecap();
  }

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// Render Step 1: Pet Choices
function renderPetChoices(preselectId) {
  const container = document.getElementById('booking-pets-grid');
  if (!container) return;

  const pets = getFromDB(DB_KEYS.PETS);

  container.innerHTML = pets.map(pet => {
    const fallbackImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200';
    return `
    <div class="pet-select-card ${preselectId === pet.id ? 'selected' : ''}" onclick="selectBookingPet('${pet.id}', '${pet.name}', '${pet.species}', this)">
      <img src="${pet.image && !pet.image.startsWith(PET_IMAGE_REFERENCE_PREFIX) ? pet.image : fallbackImage}" data-pet-image="${pet.id}" alt="${pet.name}" class="pet-select-avatar">
      <h4 style="font-weight: 800; font-size: 1.05rem; margin-bottom: 2px;">${pet.name}</h4>
      <div style="font-size: 0.85rem; color: var(--text-muted);">${pet.breed}</div>
      <div style="font-size: 0.8rem; margin-top: 6px;">
        <span class="badge ${pet.species === 'cat' ? 'badge-primary' : 'badge-warning'}">${pet.species === 'cat' ? 'Mèo' : 'Chó'}</span>
      </div>
    </div>
  `;
  }).join('');

  pets.forEach(pet => {
    const image = container.querySelector(`[data-pet-image="${pet.id}"]`);
    if (image) {
      setPetImageSource(image, pet.image, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200');
    }
  });

  if (preselectId) {
    const pet = pets.find(p => p.id === preselectId);
    if (pet) {
      bookingData.petId = pet.id;
      bookingData.petName = pet.name;
      bookingData.petSpecies = pet.species;
    }
  }
}

function selectBookingPet(petId, petName, petSpecies, cardEl) {
  bookingData.petId = petId;
  bookingData.petName = petName;
  bookingData.petSpecies = petSpecies;

  document.querySelectorAll('.pet-select-card').forEach(c => c.classList.remove('selected'));
  if (cardEl) cardEl.classList.add('selected');
}

// Render Step 2: Service & Doctor Choices
function renderServiceChoices(preselectId) {
  const select = document.getElementById('booking-service-select');
  if (!select) return;

  const services = getFromDB(DB_KEYS.SERVICES);

  select.innerHTML = '<option value="">-- Vui lòng chọn dịch vụ --</option>' +
    services.map(s => `
      <option value="${s.id}" data-price="${s.price}" data-name="${s.name}" ${preselectId === s.id ? 'selected' : ''}>
        ${s.name} (${formatCurrency(s.price)} • ${s.duration})
      </option>
    `).join('');

  if (preselectId) {
    const found = services.find(s => s.id === preselectId);
    if (found) {
      bookingData.serviceId = found.id;
      bookingData.serviceName = found.name;
      bookingData.servicePrice = found.price;
    }
  }

  select.addEventListener('change', (e) => {
    const selectedOption = select.options[select.selectedIndex];
    bookingData.serviceId = e.target.value;
    bookingData.serviceName = selectedOption.dataset.name || '';
    bookingData.servicePrice = Number(selectedOption.dataset.price) || 0;
  });
}

function renderDoctorChoices(preselectId) {
  const select = document.getElementById('booking-doctor-select');
  if (!select) return;

  const doctors = getFromDB(DB_KEYS.DOCTORS);

  select.innerHTML = '<option value="">Bác sĩ bất kỳ (Hệ thống tự xếp)</option>' +
    doctors.map(d => `
      <option value="${d.id}" data-name="${d.name}" ${preselectId === d.id ? 'selected' : ''}>
        ${d.name} (${d.specialty})
      </option>
    `).join('');

  if (preselectId) {
    const found = doctors.find(d => d.id === preselectId);
    if (found) {
      bookingData.doctorId = found.id;
      bookingData.doctorName = found.name;
    }
  }

  select.addEventListener('change', (e) => {
    const selectedOption = select.options[select.selectedIndex];
    bookingData.doctorId = e.target.value;
    bookingData.doctorName = e.target.value ? selectedOption.dataset.name : 'Bác sĩ chuyên khoa bất kỳ';
    renderTimeSlots();
  });
}

// Render Step 3: Time Slot Availability
function renderTimeSlots() {
  const container = document.getElementById('booking-time-slots');
  if (!container) return;

  const appointments = getFromDB(DB_KEYS.APPOINTMENTS);
  const selectedDate = bookingData.date;

  // Filter existing appointments on the chosen date to find occupied slots
  const bookedSlots = appointments
    .filter(a => a.date === selectedDate && a.status !== 'cancelled')
    .map(a => a.time);

  container.innerHTML = TIME_SLOTS.map(slot => {
    const isBooked = bookedSlots.includes(slot);
    const isSelected = bookingData.time === slot;

    return `
      <button type="button" 
        class="time-slot-btn ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}" 
        ${isBooked ? 'disabled title="Khung giờ này đã kín lịch"' : ''}
        onclick="selectBookingTimeSlot('${slot}', this)">
        ${slot} ${isBooked ? '(Đầy)' : ''}
      </button>
    `;
  }).join('');
}

function selectBookingTimeSlot(slot, btn) {
  bookingData.time = slot;
  document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
}

// Update Step 4 Recap
function updateBookingRecap() {
  document.getElementById('recap-pet').textContent = bookingData.petName || 'Chưa chọn';
  document.getElementById('recap-service').textContent = bookingData.serviceName || 'Chưa chọn';
  document.getElementById('recap-price').textContent = formatCurrency(bookingData.servicePrice);
  document.getElementById('recap-doctor').textContent = bookingData.doctorName || 'Bác sĩ chuyên khoa bất kỳ';
  document.getElementById('recap-datetime').textContent = `${bookingData.time} - Ngày ${bookingData.date}`;

  const symptomInput = document.getElementById('booking-symptom');
  if (symptomInput) bookingData.symptom = symptomInput.value.trim();

  const notesInput = document.getElementById('booking-notes');
  if (notesInput) bookingData.notes = notesInput.value.trim();

  const nameInput = document.getElementById('booking-cust-name');
  if (nameInput) bookingData.customerName = nameInput.value.trim();

  const phoneInput = document.getElementById('booking-cust-phone');
  if (phoneInput) bookingData.customerPhone = phoneInput.value.trim();

  document.getElementById('recap-customer').textContent = `${bookingData.customerName} (${bookingData.customerPhone})`;
  document.getElementById('recap-symptom').textContent = bookingData.symptom || 'Khám kiểm tra định kỳ';
}

// Submit Appointment
function submitAppointmentBooking() {
  const submitBtn = document.getElementById('btn-submit-booking');

  updateBookingRecap();

  if (!bookingData.customerName || !bookingData.customerPhone) {
    showToast('Vui lòng nhập Họ tên và Số điện thoại liên hệ!', 'warning');
    return;
  }

  // Prevent double submissions & show loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Đang đặt lịch hẹn...';

  setTimeout(() => {
    // Check again if slot is still available
    const appointments = getFromDB(DB_KEYS.APPOINTMENTS);
    const conflict = appointments.some(a => 
      a.date === bookingData.date && 
      a.time === bookingData.time && 
      a.doctorId === bookingData.doctorId &&
      a.status !== 'cancelled'
    );

    if (conflict) {
      showToast('Khung giờ này vừa có người đặt trước, vui lòng chọn giờ khác!', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Xác nhận Đặt Lịch Hẹn';
      goToStep(3);
      return;
    }

    const appointmentId = 'AP' + Math.floor(100 + Math.random() * 900);

    const newAppointment = {
      id: appointmentId,
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      petId: bookingData.petId,
      petName: bookingData.petName,
      petSpecies: bookingData.petSpecies === 'cat' ? 'Mèo' : 'Chó',
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      doctorId: bookingData.doctorId || 'doc-1',
      doctorName: bookingData.doctorName,
      date: bookingData.date,
      time: bookingData.time,
      symptom: bookingData.symptom || 'Khám kiểm tra định kỳ',
      notes: bookingData.notes,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    appointments.unshift(newAppointment);
    saveToDB(DB_KEYS.APPOINTMENTS, appointments);

    // Show confirmation modal
    document.getElementById('modal-app-id').textContent = appointmentId;
    document.getElementById('modal-app-pet').textContent = bookingData.petName;
    document.getElementById('modal-app-service').textContent = bookingData.serviceName;
    document.getElementById('modal-app-time').textContent = `${bookingData.time} - ${bookingData.date}`;

    ModalManager.open('booking-success-modal');

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Đặt lịch thành công!';
  }, 1000);
}
