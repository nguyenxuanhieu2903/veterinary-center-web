/**
 * PETCARE CLINIC - AUTHENTICATION LOGIC (LOGIN & REGISTER)
 */

// Toggle Password Visibility
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '👁️';
    btn.setAttribute('title', 'Ẩn mật khẩu');
  } else {
    input.type = 'password';
    btn.textContent = '👁️‍🗨️';
    btn.setAttribute('title', 'Hiện mật khẩu');
  }
}

// Email Validator
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Display Input Error
function setFieldError(fieldId, errorMsg) {
  const field = document.getElementById(fieldId);
  const feedback = document.getElementById(`${fieldId}-error`);
  
  if (field) {
    if (errorMsg) {
      field.classList.add('is-invalid');
    } else {
      field.classList.remove('is-invalid');
    }
  }

  if (feedback) {
    feedback.textContent = errorMsg || '';
  }
}

// Clear all errors
function clearAllErrors(fields) {
  fields.forEach(fieldId => setFieldError(fieldId, ''));
  const alertBox = document.getElementById('auth-alert');
  if (alertBox) {
    alertBox.className = 'auth-alert';
    alertBox.textContent = '';
  }
}

// Show Top Alert Box
function showAuthAlert(message, type = 'danger') {
  const alertBox = document.getElementById('auth-alert');
  if (!alertBox) return;

  alertBox.className = `auth-alert alert-${type} show`;
  alertBox.innerHTML = `
    <span>${type === 'danger' ? '⚠️' : '✅'}</span>
    <div>${message}</div>
  `;
}

// Handle Login Submission
async function handleLoginSubmit(event) {
  event.preventDefault();

  const emailField = document.getElementById('login-email');
  const passwordField = document.getElementById('login-password');
  const submitBtn = document.getElementById('btn-login-submit');

  const email = emailField.value.trim();
  const password = passwordField.value;

  clearAllErrors(['login-email', 'login-password']);

  let hasError = false;

  // Validation
  if (!email) {
    setFieldError('login-email', 'Vui lòng nhập email hoặc tên đăng nhập');
    hasError = true;
  } else if (!isValidEmail(email) && !email.includes('admin') && !email.includes('doctor')) {
    setFieldError('login-email', 'Email không đúng định dạng (VD: name@example.com)');
    hasError = true;
  }

  if (!password) {
    setFieldError('login-password', 'Vui lòng nhập mật khẩu');
    hasError = true;
  } else if (password.length < 6) {
    setFieldError('login-password', 'Mật khẩu phải chứa ít nhất 6 ký tự');
    hasError = true;
  }

  if (hasError) return;

  // Simulate API authentication call
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Đang xác thực...</span>';

  setTimeout(() => {
    // Check credentials (Simulated)
    let role = 'customer';
    let name = 'Nguyễn Văn Nam';
    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

    if (email.includes('admin')) {
      role = 'admin';
      name = 'Quản trị viên Hệ thống';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150';
    } else if (email.includes('doctor') || email.includes('bs.')) {
      role = 'doctor';
      name = 'ThS. BS. Nguyễn Văn An';
      avatar = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150';
    }

    const userObj = {
      id: 'usr-' + Date.now().toString().slice(-4),
      email: email,
      name: name,
      role: role,
      avatar: avatar,
      phone: '0912 345 678'
    };

    setCurrentUser(userObj);
    showAuthAlert(`Đăng nhập thành công với vai trò: ${role.toUpperCase()}`, 'success');

    // Redirect according to verified role
    setTimeout(() => {
      if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else if (role === 'doctor') {
        window.location.href = 'doctor-dashboard.html';
      } else {
        window.location.href = '../index.html';
      }
    }, 800);
  }, 1000);
}

// Quick Login Demo Trigger
function fillDemoAccount(role) {
  const emailField = document.getElementById('login-email');
  const passwordField = document.getElementById('login-password');
  if (!emailField || !passwordField) return;

  if (role === 'admin') {
    emailField.value = 'admin@petcareclinic.vn';
    passwordField.value = 'admin123';
  } else if (role === 'doctor') {
    emailField.value = 'doctor@petcareclinic.vn';
    passwordField.value = 'doctor123';
  } else {
    emailField.value = 'customer@petcareclinic.vn';
    passwordField.value = 'customer123';
  }

  showToast(`Đã điền thông tin tài khoản demo: ${role.toUpperCase()}`, 'info');
}

// Handle Register Submission
async function handleRegisterSubmit(event) {
  event.preventDefault();

  const nameField = document.getElementById('reg-name');
  const emailField = document.getElementById('reg-email');
  const phoneField = document.getElementById('reg-phone');
  const passwordField = document.getElementById('reg-password');
  const confirmPasswordField = document.getElementById('reg-confirm-password');
  const termsCheckbox = document.getElementById('reg-terms');
  const submitBtn = document.getElementById('btn-register-submit');

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const phone = phoneField.value.trim();
  const password = passwordField.value;
  const confirmPassword = confirmPasswordField.value;

  clearAllErrors(['reg-name', 'reg-email', 'reg-phone', 'reg-password', 'reg-confirm-password']);

  let hasError = false;

  if (!name) {
    setFieldError('reg-name', 'Vui lòng nhập họ và tên của bạn');
    hasError = true;
  }

  if (!email) {
    setFieldError('reg-email', 'Vui lòng nhập địa chỉ email');
    hasError = true;
  } else if (!isValidEmail(email)) {
    setFieldError('reg-email', 'Định dạng email không hợp lệ');
    hasError = true;
  }

  if (!phone) {
    setFieldError('reg-phone', 'Vui lòng nhập số điện thoại');
    hasError = true;
  } else if (!/^[0-9]{9,11}$/.test(phone.replace(/\s+/g, ''))) {
    setFieldError('reg-phone', 'Số điện thoại phải từ 10 - 11 chữ số');
    hasError = true;
  }

  if (!password) {
    setFieldError('reg-password', 'Vui lòng nhập mật khẩu');
    hasError = true;
  } else if (password.length < 6) {
    setFieldError('reg-password', 'Mật khẩu phải chứa ít nhất 6 ký tự');
    hasError = true;
  }

  if (!confirmPassword) {
    setFieldError('reg-confirm-password', 'Vui lòng xác nhận lại mật khẩu');
    hasError = true;
  } else if (password !== confirmPassword) {
    setFieldError('reg-confirm-password', 'Hai mật khẩu không trùng khớp');
    hasError = true;
  }

  if (!termsCheckbox.checked) {
    showAuthAlert('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật!', 'danger');
    return;
  }

  if (hasError) return;

  // Simulate API registration call
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Đang khởi tạo tài khoản...</span>';

  setTimeout(() => {
    const newUser = {
      id: 'usr-' + Date.now().toString().slice(-4),
      name: name,
      email: email,
      phone: phone,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    setCurrentUser(newUser);
    showAuthAlert('Đăng ký tài khoản thành công! Đang chuyển hướng...', 'success');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
  }, 1000);
}

