/**
 * PETCARE CLINIC - CORE JAVASCRIPT SYSTEM
 * Provides Global State, Mock Database, Auth, Cart Counter & Shared Utilities
 */

(() => {
  const currentScript = document.currentScript;
  if (!currentScript) return;

  const languageScript = document.createElement('script');
  languageScript.src = new URL('i18n.js', currentScript.src).href;
  languageScript.async = true;
  languageScript.onerror = () => console.error('Không thể tải bộ chuyển đổi ngôn ngữ PetCareClinic.');
  document.head.appendChild(languageScript);
})();

// Global App Configuration & Mock Database Keys
const DB_KEYS = {
  USER: 'petcare_current_user',
  PETS: 'petcare_pets',
  PRODUCTS: 'petcare_products',
  SERVICES: 'petcare_services',
  DOCTORS: 'petcare_doctors',
  APPOINTMENTS: 'petcare_appointments',
  ORDERS: 'petcare_orders',
  CART: 'petcare_cart',
  MEDICAL_RECORDS: 'petcare_medical_records'
};

// Initial Mock Data
const INITIAL_DATA = {
  user: {
    id: 'user-01',
    name: 'Nguyễn Văn Nam',
    email: 'nam.nguyen@example.com',
    phone: '0912 345 678',
    role: 'customer', // 'customer' | 'doctor' | 'admin'
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  services: [
    {
      id: 'srv-1',
      name: 'Khám tổng quát & Tư vấn sức khỏe',
      category: 'general',
      price: 150000,
      duration: '30 phút',
      shortDesc: 'Đánh giá toàn diện thể trạng, nghe tim phổi, kiểm tra tai mắt mũi họng và tư vấn dinh dưỡng cho thú cưng.',
      fullDesc: 'Gói khám toàn diện được thiết kế để phát hiện sớm các bệnh lý tiềm ẩn ở thú cưng. Bác sĩ thú y sẽ kiểm tra lâm sàng từ đầu đến chân bao gồm: hệ tim mạch, hô hấp, hệ tiêu hóa, da lông, mắt, tai và kiểm tra cân nặng, chỉ số BMI.',
      process: ['Tiếp đón & Lấy thông tin bệnh sử', 'Đo thân nhiệt, huyết áp, cân nặng', 'Khám lâm sàng các cơ quan', 'Tư vấn phác đồ phòng & chữa bệnh', 'Cấp sổ theo dõi sức khỏe'],
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600',
      popular: true,
      rating: 4.9
    },
    {
      id: 'srv-2',
      name: 'Tiêm phòng Vaccine trọn gói',
      category: 'vaccine',
      price: 250000,
      duration: '20 phút',
      shortDesc: 'Vaccine 5 bệnh, 7 bệnh cho chó mèo, phòng dại nhập khẩu chính hãng kèm sổ tiêm chủng chuẩn quốc tế.',
      fullDesc: 'Dịch vụ tiêm phòng đầy đủ các loại vaccine quan trọng cho chó và mèo: Vaccine phòng dại (Rabies), vaccine 7 bệnh cho chó (Care, Parvo, Viêm gan truyền nhiễm, Ho cũi...), vaccine 4 bệnh cho mèo. Thú cưng được khám sàng lọc kỹ trước khi tiêm.',
      process: ['Kiểm tra thân nhiệt trước tiêm', 'Lựa chọn vaccine phù hợp lứa tuổi', 'Tiêm vô trùng tiêu chuẩn cao', 'Theo dõi phản ứng sốc phản vệ 15-30p', 'Ghi lịch hẹn mũi kế tiếp'],
      image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600',
      popular: true,
      rating: 5.0
    },
    {
      id: 'srv-3',
      name: 'Xét nghiệm máu & Siêu âm màu',
      category: 'lab',
      price: 450000,
      duration: '45 phút',
      shortDesc: 'Hệ thống máy xét nghiệm sinh hóa tự động và siêu âm Doppler chẩn đoán chính xác trong 30 phút.',
      fullDesc: 'Chẩn đoán cận lâm sàng bằng công nghệ kỹ thuật số: Công thức máu (CBC), sinh hóa chức năng gan thận, điện giải đồ, siêu âm màu ổ bụng phát hiện sỏi, viêm tử cung, thai kỳ hoặc khối u sớm.',
      process: ['Lấy mẫu máu/Chuẩn bị vị trí siêu âm', 'Vận hành trên máy phân tích tự động', 'Bác sĩ chuyên khoa hội chẩn hình ảnh', 'Trả kết quả và giải thích chi tiết'],
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600',
      popular: false,
      rating: 4.8
    },
    {
      id: 'srv-4',
      name: 'Spa tắm mát & Grooming tạo kiểu',
      category: 'spa',
      price: 320000,
      duration: '90 phút',
      shortDesc: 'Tắm trị liệu khử mùi hôi, vắt tuyến hôi, cắt tỉa móng, vệ sinh tai và cắt tỉa lông tạo kiểu nghệ thuật.',
      fullDesc: 'Quy trình spa 7 bước chuẩn 5 sao với các sản phẩm sữa tắm dịu nhẹ nhập khẩu từ Châu Âu, giúp thú cưng sạch sẽ, thơm lâu, ngăn ngừa ve rận nấm da và có bộ lông bồng bềnh xinh xắn.',
      process: ['Chải lông & gỡ rối', 'Cắt tỉa móng & vệ sinh tai', 'Vắt tuyến hôi & Tắm 2 lần sữa tắm dưỡng chất', 'Sấy khô & Chải phồng', 'Cắt tỉa tạo kiểu theo yêu cầu'],
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600',
      popular: true,
      rating: 4.9
    },
    {
      id: 'srv-5',
      name: 'Phẫu thuật Ngoại khoa & Triệt sản',
      category: 'surgery',
      price: 650000,
      duration: '60 phút',
      shortDesc: 'Phòng mổ vô trùng áp lực dương, gây mê khí dung an toàn tuyệt đối, mổ nội soi vết thương nhỏ.',
      fullDesc: 'Thực hiện các phẫu thuật triệt sản chó mèo đực/cái, mổ lấy sỏi bàng quang, phẫu thuật chỉnh hình gãy xương, mổ cấp cứu xoắn dạ dày hoặc mổ đẻ. Thiết bị monitor theo dõi sinh tồn liên tục.',
      process: ['Khám tiền phẫu & Xét nghiệm máu', 'Gây mê hồi sức an toàn', 'Tiến hành phẫu thuật phòng vô trùng', 'Chăm sóc hậu phẫu tại phòng lưu chuồng'],
      image: 'https://images.unsplash.com/photo-1583912267550-d44d9c9ccf06?w=600',
      popular: false,
      rating: 4.9
    },
    {
      id: 'srv-6',
      name: 'Cấp cứu & Lưu trú điều trị 24/7',
      category: 'emergency',
      price: 200000,
      duration: '24/7',
      shortDesc: 'Đội ngũ bác sĩ và điều dưỡng trực xuyên đêm, lồng ấp oxy hiện đại, tiếp nhận cấp cứu tức thì.',
      fullDesc: 'Dịch vụ cấp cứu 24/24 cho các trường hợp nguy cấp: ngộ độc thực phẩm/hóa chất, tai nạn chấn thương gãy xương, khó thở, sốc nhiệt, co giật. Phòng lưu bệnh nội trú sạch sẽ, có camera giám sát từ xa cho chủ nuôi.',
      process: ['Tiếp nhận khẩn cấp & Phân loại ca bệnh', 'Hỗ trợ thở oxy/Hồi sức tim phổi', 'Xử lý cầm máu hoặc chống sốc', 'Theo dõi nội trú 24/24'],
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600',
      popular: true,
      rating: 5.0
    }
  ],
  doctors: [
    {
      id: 'doc-1',
      name: 'ThS. BS. Nguyễn Văn An',
      role: 'doctor',
      specialty: 'Trưởng khoa Nội & Chẩn đoán hình ảnh',
      experience: '12 năm kinh nghiệm',
      phone: '0981 123 456',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300',
      bio: 'Tốt nghiệp Đại học Thú y Tokyo (Nhật Bản), chuyên gia đầu ngành trong điều trị các bệnh nội khoa phức tạp và siêu âm tim thú cưng.'
    },
    {
      id: 'doc-2',
      name: 'BS. CKI Trần Mai Chi',
      role: 'doctor',
      specialty: 'Chuyên gia Ngoại khoa & Sản khoa',
      experience: '9 năm kinh nghiệm',
      phone: '0972 654 321',
      avatar: 'https://images.unsplash.com/photo-1594824813637-67e411b41295?w=300',
      bio: 'Thực hiện hơn 3.000 ca phẫu thuật triệt sản, chỉnh hình và mổ cứu sống thú cưng thành công với kỹ thuật xâm lấn tối thiểu.'
    },
    {
      id: 'doc-3',
      name: 'BS. Lê Hoàng Nam',
      role: 'doctor',
      specialty: 'Bác sĩ Tiêm chủng & Da liễu thú cưng',
      experience: '7 năm kinh nghiệm',
      phone: '0934 889 900',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300',
      bio: 'Tận tâm, yêu thương thú cưng hết lòng, chuyên sâu về các bệnh viêm da dị ứng, nấm ghẻ và dinh dưỡng phục hồi sau ốm.'
    }
  ],
  pets: [
    {
      id: 'pet-1',
      name: 'Miu Miu',
      species: 'cat',
      breed: 'Mèo Anh Lông Ngắn',
      gender: 'Cái',
      age: '2 tuổi',
      birthDate: '2024-04-12',
      weight: '4.2 kg',
      color: 'Xám xanh (Blue)',
      microchip: 'VN-9842-CAT',
      ownerId: 'user-01',
      ownerName: 'Nguyễn Văn Nam',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500',
      notes: 'Khá nhút nhát với người lạ, thích ăn hạt Royal Canin Kitten.',
      vaccinated: true
    },
    {
      id: 'pet-2',
      name: 'Bơ (Golden)',
      species: 'dog',
      breed: 'Golden Retriever',
      gender: 'Đực',
      age: '3 tuổi',
      birthDate: '2023-06-18',
      weight: '29.5 kg',
      color: 'Vàng ánh kim',
      microchip: 'VN-1102-DOG',
      ownerId: 'user-01',
      ownerName: 'Nguyễn Văn Nam',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
      notes: 'Thân thiện, ham chơi, cần theo dõi kiểm tra cân nặng tránh béo phì.',
      vaccinated: true
    },
    {
      id: 'pet-3',
      name: 'Mochi',
      species: 'cat',
      breed: 'Mèo Ba Tư Exotic',
      gender: 'Đực',
      age: '1 tuổi',
      birthDate: '2025-05-10',
      weight: '3.6 kg',
      color: 'Trắng kem',
      microchip: 'VN-7741-CAT',
      ownerId: 'user-02',
      ownerName: 'Trần Thị Mai Lan',
      image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500',
      notes: 'Dễ chảy nước mắt do mũi ngắn, cần vệ sinh khóe mắt mỗi ngày.',
      vaccinated: false
    }
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Thức ăn hạt Royal Canin Kitten 2kg cho mèo con',
      category: 'food',
      price: 385000,
      originalPrice: 430000,
      stock: 42,
      rating: 4.9,
      sold: 340,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500',
      description: 'Cung cấp năng lượng cân bằng, hàm lượng protein chất lượng cao giúp xương và cơ bắp mèo con phát triển vượt trội.'
    },
    {
      id: 'prod-2',
      name: 'Snack súp thưởng Ciao Churu vị Cá ngừ (Túi 4 thanh)',
      category: 'food',
      price: 45000,
      originalPrice: 55000,
      stock: 150,
      rating: 5.0,
      sold: 1420,
      image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500',
      description: 'Dạng kem nhuyễn thơm ngon kích thích thèm ăn, bổ sung tinh chất trà xanh giúp khử mùi hôi phân và nước tiểu.'
    },
    {
      id: 'prod-3',
      name: 'Sữa tắm khử mùi dưỡng mượt lông SOS Special 530ml',
      category: 'care',
      price: 125000,
      originalPrice: 160000,
      stock: 38,
      rating: 4.8,
      sold: 260,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500',
      description: 'Chiết xuất thảo dược tự nhiên lưu hương hoa cỏ quyến rũ tới 7 ngày, chống xơ rối và hỗ trợ diệt khuẩn da lông.'
    },
    {
      id: 'prod-4',
      name: 'Thuốc nhỏ gáy trị ve rận bọ chét Frontline Plus cho chó',
      category: 'medicine',
      price: 215000,
      originalPrice: 250000,
      stock: 55,
      rating: 4.9,
      sold: 510,
      image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500',
      description: 'Tiêu diệt 100% bọ chét trưởng thành, ấu trùng và ve trong vòng 24-48 giờ, duy trì hiệu quả bảo vệ liên tục 30 ngày.'
    },
    {
      id: 'prod-5',
      name: 'Đồ chơi gặm sạch mảng bám răng hình xương gai dẻo',
      category: 'toy',
      price: 65000,
      originalPrice: 85000,
      stock: 75,
      rating: 4.7,
      sold: 230,
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500',
      description: 'Chất liệu TPR dẻo dai an toàn không độc hại, kích thích thú cưng vận động và làm sạch vôi răng tự nhiên.'
    },
    {
      id: 'prod-6',
      name: 'Balo phi hành gia vận chuyển thú cưng vòm trong suốt',
      category: 'accessory',
      price: 295000,
      originalPrice: 360000,
      stock: 20,
      rating: 4.8,
      sold: 145,
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
      description: 'Lỗ thoáng khí đối lưu 3 chiều, quai đeo đệm xốp êm ái, chịu lực tốt cho thú cưng dưới 7kg khi đi dạo hay du lịch.'
    }
  ],
  appointments: [
    {
      id: 'AP001',
      customerName: 'Nguyễn Văn Nam',
      customerPhone: '0912 345 678',
      petId: 'pet-1',
      petName: 'Miu Miu',
      petSpecies: 'Mèo Anh Lông Ngắn',
      serviceId: 'srv-1',
      serviceName: 'Khám tổng quát & Tư vấn sức khỏe',
      doctorId: 'doc-1',
      doctorName: 'ThS. BS. Nguyễn Văn An',
      date: '2026-10-22',
      time: '09:00',
      symptom: 'Mèo bỏ ăn 2 bữa, ngủ li bì, hắt hơi nhẹ',
      status: 'pending', // 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
      createdAt: '2026-10-21 14:15'
    },
    {
      id: 'AP002',
      customerName: 'Trần Thị Mai Lan',
      customerPhone: '0987 654 321',
      petId: 'pet-3',
      petName: 'Mochi',
      petSpecies: 'Mèo Ba Tư',
      serviceId: 'srv-2',
      serviceName: 'Tiêm phòng Vaccine trọn gói',
      doctorId: 'doc-3',
      doctorName: 'BS. Lê Hoàng Nam',
      date: '2026-10-22',
      time: '10:30',
      symptom: 'Đến lịch tiêm nhắc lại mũi 4 bệnh định kỳ',
      status: 'confirmed',
      createdAt: '2026-10-21 09:30'
    },
    {
      id: 'AP003',
      customerName: 'Lê Quốc Hưng',
      customerPhone: '0903 112 233',
      petId: 'pet-2',
      petName: 'Bơ (Golden)',
      petSpecies: 'Golden Retriever',
      serviceId: 'srv-4',
      serviceName: 'Spa tắm mát & Grooming tạo kiểu',
      doctorId: 'doc-2',
      doctorName: 'BS. CKI Trần Mai Chi',
      date: '2026-10-22',
      time: '14:00',
      symptom: 'Tắm vệ sinh và cắt tỉa lông gọn gàng đón hè',
      status: 'completed',
      createdAt: '2026-10-20 16:00'
    }
  ],
  medicalRecords: [
    {
      id: 'MR-001',
      appointmentId: 'AP003',
      petId: 'pet-2',
      petName: 'Bơ (Golden)',
      ownerName: 'Nguyễn Văn Nam',
      doctorName: 'BS. CKI Trần Mai Chi',
      date: '2026-10-22',
      weight: '29.5 kg',
      temp: '38.6°C',
      symptoms: 'Khách hàng yêu cầu kiểm tra da và vệ sinh tai móng',
      diagnosis: 'Da hơi ửng đỏ nhẹ kẽ móng do ẩm ướt sau khi tắm ở nhà, không có nấm mủ',
      treatment: 'Vệ sinh sấy khô tuyệt đối kẽ chân, bôi cồn đỏ pha loãng và dung dịch làm khô thảo dược',
      prescription: [
        { name: 'Xịt nấm ngứa DermaCool', dosage: 'Xịt 2 lần/ngày sau khi lau khô chân', days: '5 ngày' }
      ],
      reExamDate: '2026-11-05',
      notes: 'Tránh để thú cưng đi chân ướt vào phòng điều hòa, giữ chân luôn khô thoáng.'
    }
  ],
  orders: [
    {
      id: 'ORD-8821',
      customerName: 'Nguyễn Văn Nam',
      phone: '0912 345 678',
      address: 'Số 18 Hoàng Diệu, Ba Đình, Hà Nội',
      items: [
        { id: 'prod-1', name: 'Thức ăn hạt Royal Canin Kitten 2kg', price: 385000, quantity: 1, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200' },
        { id: 'prod-2', name: 'Snack súp thưởng Ciao Churu vị Cá ngừ', price: 45000, quantity: 2, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=200' }
      ],
      subtotal: 475000,
      shipping: 25000,
      discount: 0,
      total: 500000,
      paymentMethod: 'COD',
      paymentStatus: 'Chờ thanh toán',
      status: 'processing', // 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
      date: '2026-10-21 11:20'
    }
  ]
};

// Initialize Mock Database
function initDatabase() {
  if (!localStorage.getItem(DB_KEYS.SERVICES)) {
    localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(INITIAL_DATA.services));
  }
  if (!localStorage.getItem(DB_KEYS.DOCTORS)) {
    localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify(INITIAL_DATA.doctors));
  }
  if (!localStorage.getItem(DB_KEYS.PETS)) {
    localStorage.setItem(DB_KEYS.PETS, JSON.stringify(INITIAL_DATA.pets));
  }
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_DATA.products));
  }
  if (!localStorage.getItem(DB_KEYS.APPOINTMENTS)) {
    localStorage.setItem(DB_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_DATA.appointments));
  }
  if (!localStorage.getItem(DB_KEYS.ORDERS)) {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(INITIAL_DATA.orders));
  }
  if (!localStorage.getItem(DB_KEYS.MEDICAL_RECORDS)) {
    localStorage.setItem(DB_KEYS.MEDICAL_RECORDS, JSON.stringify(INITIAL_DATA.medicalRecords));
  }
  if (!localStorage.getItem(DB_KEYS.CART)) {
    localStorage.setItem(DB_KEYS.CART, JSON.stringify([
      { id: 'prod-1', name: 'Thức ăn hạt Royal Canin Kitten 2kg', price: 385000, quantity: 1, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300' }
    ]));
  }
  if (!localStorage.getItem(DB_KEYS.USER)) {
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(INITIAL_DATA.user));
  }
}

// User & Role State
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEYS.USER)) || null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(DB_KEYS.USER);
  }
  updateHeaderAuthState();
}

function switchUserRole(role) {
  let user = getCurrentUser();
  if (!user) {
    user = { ...INITIAL_DATA.user };
  }
  user.role = role;
  if (role === 'doctor') {
    user.name = 'ThS. BS. Nguyễn Văn An';
    user.email = 'bs.an@petcareclinic.vn';
  } else if (role === 'admin') {
    user.name = 'Quản trị viên Hệ thống';
    user.email = 'admin@petcareclinic.vn';
  } else {
    user.name = 'Nguyễn Văn Nam';
    user.email = 'nam.nguyen@example.com';
  }
  setCurrentUser(user);
  showToast(`Đã chuyển vai trò sang: ${role.toUpperCase()}`, 'success');

  // Intelligent Redirect based on role
  const isInsidePages = window.location.pathname.includes('/pages/');
  const prefix = isInsidePages ? '' : 'pages/';
  
  if (role === 'admin') {
    setTimeout(() => window.location.href = prefix + 'admin-dashboard.html', 500);
  } else if (role === 'doctor') {
    setTimeout(() => window.location.href = prefix + 'doctor-dashboard.html', 500);
  } else {
    setTimeout(() => window.location.href = isInsidePages ? '../index.html' : 'index.html', 500);
  }
}

function logout() {
  localStorage.removeItem(DB_KEYS.USER);
  showToast('Đã đăng xuất tài khoản thành công', 'success');
  const isInsidePages = window.location.pathname.includes('/pages/');
  setTimeout(() => {
    window.location.href = isInsidePages ? 'login.html' : 'pages/login.html';
  }, 600);
}

// Data Helpers
function getFromDB(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function saveToDB(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Format Currency
function formatCurrency(amount) {
  const locale = window.currentLanguage === 'en' ? 'en-US' : 'vi-VN';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(amount);
}

// Global Toast System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <div style="font-size: 0.9rem; font-weight: 500; color: #1e293b;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Cart Helper Functions
function getCart() {
  return getFromDB(DB_KEYS.CART);
}

function addToCart(productId, quantity = 1) {
  const products = getFromDB(DB_KEYS.PRODUCTS);
  const product = products.find(p => p.id === productId);
  if (!product) {
    showToast('Sản phẩm không tồn tại!', 'error');
    return false;
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    if (cart[existingIndex].quantity + quantity > product.stock) {
      showToast(`Số lượng trong kho chỉ còn ${product.stock} sản phẩm!`, 'warning');
      return false;
    }
    cart[existingIndex].quantity += quantity;
  } else {
    if (quantity > product.stock) {
      showToast(`Số lượng vượt quá tồn kho (${product.stock})!`, 'warning');
      return false;
    }
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });
  }

  saveToDB(DB_KEYS.CART, cart);
  updateCartBadge();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  return true;
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

// Active Nav Link Highlighter
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if link matches current page
    if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html')))) {
      link.classList.add('active');
    } else if (href.includes('/') && currentPath.includes(href.split('/').pop())) {
      link.classList.add('active');
    }
  });
}

// Update Header User Profile Dropdown & Cart
function updateHeaderAuthState() {
  const user = getCurrentUser();
  const userContainer = document.getElementById('header-user-area');
  if (!userContainer) return;

  const isInsidePages = window.location.pathname.includes('/pages/');
  const rootPath = isInsidePages ? '../' : './';
  const pagesPath = isInsidePages ? '' : 'pages/';

  if (user) {
    userContainer.innerHTML = `
      <div class="user-profile-menu">
        <button class="user-avatar-btn" id="btn-user-dropdown" onclick="toggleUserDropdown(event)">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" alt="${user.name}" class="user-avatar">
          <div style="text-align: left; line-height: 1.2;" class="d-none d-md-block">
            <span data-user-content style="font-weight: 700; font-size: 0.88rem; display: block;">${user.name}</span>
            <span class="badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'doctor' ? 'badge-primary' : 'badge-success'}" style="font-size: 0.7rem; padding: 2px 6px;">
              ${user.role === 'admin' ? 'Quản trị viên' : user.role === 'doctor' ? 'Bác sĩ' : 'Khách hàng'}
            </span>
          </div>
          <span style="font-size: 0.8rem; margin-left: 4px;">▼</span>
        </button>
        <div class="user-dropdown" id="user-dropdown-menu">
          ${user.role === 'customer' ? `
            <a href="${pagesPath}pets.html" class="dropdown-item">🐾 Thú cưng của tôi</a>
            <a href="${pagesPath}booking.html" class="dropdown-item">📅 Đặt lịch khám mới</a>
            <a href="${pagesPath}order-history.html" class="dropdown-item">📦 Lịch sử đơn hàng</a>
          ` : ''}
          ${user.role === 'doctor' ? `
            <a href="${pagesPath}doctor-dashboard.html" class="dropdown-item">🩺 Bàn làm việc Bác sĩ</a>
            <a href="${pagesPath}medical-record.html" class="dropdown-item">📋 Hồ sơ bệnh án</a>
          ` : ''}
          ${user.role === 'admin' ? `
            <a href="${pagesPath}admin-dashboard.html" class="dropdown-item">⚡ Bảng quản trị Admin</a>
          ` : ''}
          <div class="dropdown-divider"></div>
          <div style="padding: 6px 14px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">CHUYỂN VAI TRÒ DEMO:</div>
          <button onclick="switchUserRole('customer')" class="dropdown-item" style="font-size: 0.85rem;">👤 Khách hàng</button>
          <button onclick="switchUserRole('doctor')" class="dropdown-item" style="font-size: 0.85rem;">👨‍⚕️ Bác sĩ thú y</button>
          <button onclick="switchUserRole('admin')" class="dropdown-item" style="font-size: 0.85rem;">🛡️ Quản trị viên</button>
          <div class="dropdown-divider"></div>
          <button onclick="logout()" class="dropdown-item" style="color: var(--danger);">🚪 Đăng xuất</button>
        </div>
      </div>
    `;
  } else {
    userContainer.innerHTML = `
      <div class="d-flex items-center gap-2">
        <a href="${pagesPath}login.html" class="btn btn-outline btn-sm">Đăng nhập</a>
        <a href="${pagesPath}register.html" class="btn btn-primary btn-sm">Đăng ký</a>
      </div>
    `;
  }
}

function toggleUserDropdown(e) {
  e.stopPropagation();
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu && menu.classList.contains('show')) {
    menu.classList.remove('show');
  }
});

// Mobile menu toggle
function toggleMobileMenu() {
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.classList.toggle('active');
  }
}

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  const nav = document.getElementById('main-nav');
  const toggleBtn = document.querySelector('.mobile-toggle');
  if (nav && nav.classList.contains('active')) {
    if (!nav.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
      nav.classList.remove('active');
    }
  }
});

/**
 * Universal Go Back Function
 * First attempts to use browser history if valid and within the same site,
 * otherwise redirects safely to the specified fallback URL.
 */
function goBack(fallbackUrl) {
  try {
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;
    const isSameOrigin = referrer && (referrer.startsWith(currentOrigin) || referrer.includes(window.location.host));

    if (isSameOrigin && referrer !== window.location.href && window.history.length > 1) {
      window.history.back();
      return;
    }
  } catch (e) {
    // Continue to fallback
  }

  if (fallbackUrl) {
    window.location.href = fallbackUrl;
  } else {
    const isInsidePages = window.location.pathname.includes('/pages/');
    window.location.href = isInsidePages ? '../index.html' : 'index.html';
  }
}

// Auto Initialize on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  highlightActiveNav();
  updateCartBadge();
  updateHeaderAuthState();
});
