# PRODUCT SPECIFICATION — VETERINARY CENTER SYSTEM

**Document Type:** Technical & Product Specification  
**Project Name:** Website Trung tâm Thú y (Veterinary Center Web Application)  
**Course:** Lập trình Website (Mã HP: 012012103105) – ĐH Giao thông vận tải TP.HCM (UTH)  
**Target Window:** 5 Tuần (Phát triển cá nhân / Nhóm)  
**Development Approach:** AI-Assisted (Antigravity/Cursor), Phased Implementation, Native First (Docker Last)  
**Primary Architecture:** Decoupled Architecture (`/backend` Django REST API + `/frontend` Independent UI)  

---

## 1. GIỚI THIỆU & MỤC TIÊU SẢN PHẨM

### 1.1. Mục tiêu dự án
Xây dựng hệ thống ứng dụng Web đa chức năng phục vụ quản lý và vận hành Trung tâm Thú y, bao gồm:
1. **Quản lý Thú cưng**: Đăng ký và theo dõi hồ sơ sức khỏe thú cưng cá nhân.
2. **Đặt lịch khám trực tuyến**: Đặt ca khám với dịch vụ và bác sĩ mong muốn, tự động kiểm tra trùng lịch và gửi email xác nhận ngầm.
3. **Quản lý Y tế (Portal Bác sĩ)**: Bác sĩ xem ca khám được phân công, cập nhật bệnh án (triệu chứng, chẩn đoán), kê đơn thuốc và hẹn lịch tái khám.
4. **Cửa hàng Thú cưng & Giỏ hàng**: Bán sản phẩm thú cưng, quản lý giỏ hàng Session/DB, và thực hiện Checkout đơn hàng COD.
5. **Dashboard Quản trị & Nhân viên**: Quản lý người dùng, phân quyền 4 vai trò, quản lý danh mục dịch vụ/sản phẩm, tồn kho và duyệt đơn hàng.

### 1.2. Quyết định Kỹ thuật & Hạ tầng (Confirmed Architectural Decisions)

| Thành phần | Công nghệ / Phương án | Ghi chú & Ràng buộc |
| :--- | :--- | :--- |
| **Phát triển Môi trường** | **Native Local First** (Tuần 1–4) $\rightarrow$ **Docker Containerize** (Tuần 5) | Phát triển trực tiếp trên Python 3.11+ local, MySQL 8.0 local và Redis local. Đóng gói Docker Compose tại Giai đoạn 5. |
| **Cấu trúc Thư mục** | Tách biệt 2 thư mục gốc: `/backend` và `/frontend` | Đảm bảo AI Agent không sửa đè chéo module. Giao tiếp qua HTTP REST API (JSON). |
| **Backend Framework** | Python 3.11+, Django 4.2+, Django REST Framework (DRF) | Đảm nhận Business Logic, Auth (SimpleJWT), RBAC Authorization và REST APIs. |
| **Database** | MySQL 8.0 | Quản lý dữ liệu tập trung qua Django ORM, kết nối qua `python-decouple` reading `.env`. |
| **Task Queue & Cache** | Celery 5.x + Redis 7.x | Xử lý các tác vụ ngầm: Gửi Email xác nhận đặt lịch và Email nhắc lịch tái khám tự động bất đồng bộ. |
| **Frontend Framework** | HTML5, CSS3 (Bootstrap 5 / Tailwind CSS), JavaScript (Vanilla JS / Fetch API) | Xây dựng các giao diện Responsive độc lập, gọi API về Backend bằng JWT Token. |
| **Phương thức Thanh toán** | COD (Cash On Delivery - Thanh toán tiền mặt khi nhận hàng/khám trực tiếp) | Không tích hợp cổng thanh toán trực tuyến thật trong MVP chính. |

---

## 2. QUY TẮC NGHIỆP VỤ BẮT BUỘC (CRITICAL BUSINESS RULES)

Mọi dòng code được viết bởi AI Agent hoặc lập trình viên đều phải tuân thủ tuyệt đối các quy tắc sau:

1. **BR-ORD-01 (Backend Total Calculation):** Tổng tiền đơn hàng (`total_amount`) BẮT BUỘC phải do Backend tự tính toán dựa trên đơn giá niêm yết lưu trong Database tại thời điểm tạo đơn. Tuyệt đối KHÔNG tin tưởng tổng tiền do Client/Frontend gửi lên.
2. **BR-ACL-01 (Strict Backend RBAC):** Kiểm soát phân quyền 4 vai trò (`CUSTOMER`, `DOCTOR`, `STAFF`, `ADMIN`) bắt buộc phải thực thi tại Backend bằng Custom Permission Classes (`IsCustomer`, `IsDoctor`, `IsStaff`, `IsAdmin`). Không được chỉ ẩn/hiện nút trên giao diện UI. Ngăn chặn tình trạng Khách hàng thay đổi ID trên URL để xem hồ sơ/bệnh án của người khác.
3. **BR-APP-01 (Booking & Doctor Conflict Validation):** Hệ thống phải kiểm tra thời gian thực: Một Bác sĩ không thể nhận 2 ca khám trùng nhau trong cùng một khung giờ/ca khám (`appointment_date` và `time_slot`). Khách hàng chỉ được đặt lịch cho Thú cưng do chính mình sở hữu (`owner = request.user`).
4. **BR-APP-02 (Async Email Execution):** Thao tác gửi Email xác nhận đặt lịch và nhắc lịch hẹn BẮT BUỘC phải đẩy vào Celery Worker ngầm qua Redis Broker. Tuyệt đối KHÔNG gửi email trực tiếp trong luồng xử lý HTTP Request/Response chính để tránh lag/timeout giao diện.
5. **BR-INV-01 (Inventory Transactional Safety):** Số lượng tồn kho của sản phẩm phải được cập nhật và khấu trừ tự động bằng Database Transaction (`transaction.atomic()`) khi đơn hàng chuyển sang trạng thái xử lý (`PROCESSING`) hoặc giao hàng (`SHIPPED`). Không cho phép đặt hàng sản phẩm đã hết hàng (`stock_quantity = 0`).

---

## 3. ĐỐI TƯỢNG SỬ DỤNG VÀ PHÂN QUYỀN 4 VAI TRÒ (RBAC MATRIX)

Hệ thống thiết lập 4 vai trò độc lập:

| Mã Vai Trò | Vai Trò | Quyền Hạn & Phạm Vi Truy Cập | Giới Hạn Nghiệp Vụ |
| :---: | :--- | :--- | :--- |
| `CUSTOMER` | Khách hàng | Xem sản phẩm/dịch vụ; quản lý thú cưng cá nhân; đặt lịch khám; giỏ hàng & tạo đơn hàng COD; xem lịch sử khám và đơn hàng của mình. | Chỉ xem/sửa dữ liệu chính mình sở hữu. Không truy cập được trang Admin/Doctor. |
| `DOCTOR` | Bác sĩ thú y | Đăng nhập Doctor Portal; xem lịch khám được phân công; tạo/cập nhật Bệnh án (triệu chứng, chẩn đoán, kê đơn), đặt lịch tái khám. | Chỉ chỉnh sửa ca khám được phân công. Không xem/sửa doanh thu shop hoặc giá cả. |
| `STAFF` | Nhân viên | Quản lý danh mục sản phẩm/dịch vụ; tiếp nhận và chuyển trạng thái đơn hàng (`PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SHIPPED` $\rightarrow$ `COMPLETED`); duyệt lịch tại quầy. | Không có quyền quản trị phân quyền tài khoản hoặc cấu hình hệ thống sâu. |
| `ADMIN` | Quản trị viên | Quản lý người dùng và gán vai trò (CRUD User & Roles); xem báo cáo thống kê doanh thu và lịch hẹn; cấu hình toàn bộ hệ thống. | Thao tác nhạy cảm được ghi log đầy đủ. |

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN MỤC TIÊU (REPOS ARCHITECTURE)

Dự án được phân tách thành 2 thư mục độc lập để AI Agent xử lý chính xác:

```text
veterinary-center/
├── PROJECT_SPEC.md              # Đặc tả Yêu cầu & Quy tắc Sản phẩm
├── IMPLEMENTATION_PLAN.md       # Kế hoạch Kỹ thuật triển khai 5 Giai đoạn
├── README.md                    # Hướng dẫn chạy Native & Docker
├── .gitignore                   # Cấu hình bỏ qua (.env, venv/, __pycache__, media/)
├── .env.example                 # Mẫu khai báo biến môi trường (KHÔNG chứa secret)
├── docker-compose.yml           # Cấu hình Docker 4 Container (Sử dụng ở Giai đoạn 5)
├── Dockerfile                   # Dockerfile cho Backend Django (Sử dụng ở Giai đoạn 5)
│
├── backend/                     # THƯ MỤC BACKEND (DJANGO REST FRAMEWORK)
│   ├── manage.py
│   ├── requirements.txt         # Danh sách Python packages
│   ├── config/                  # Root Settings & Configurations
│   │   ├── __init__.py
│   │   ├── settings.py          # Cấu hình đọc .env qua python-decouple
│   │   ├── urls.py              # Root Routing
│   │   ├── wsgi.py
│   │   └── celery.py            # Cấu hình Celery App & Redis Broker
│   └── apps/                    # Django Business Apps
│       ├── accounts/            # Custom User Model, Authentication & RBAC Permissions
│       ├── pets/                # Pet Profile CRUD & Medical History API
│       ├── bookings/            # Services Catalog, Booking Logic & Time Slot Validation
│       ├── medical/             # Doctor Portal, Medical Records, Prescriptions & Revisit
│       ├── shop/                # Product Catalog & Category Management
│       └── orders/              # Cart Management, COD Checkout & Inventory Deduction
│
├── frontend/                    # THƯ MỤC FRONTEND (INDEPENDENT UI TEMPLATES & JS)
│   ├── css/                     # Tailwind / Bootstrap compiled CSS & Custom styles
│   ├── js/                      # Fetch API Clients, Auth Storage & Dynamic Handlers
│   ├── images/                  # Assets, Placeholders & Static Logos
│   └── pages/                   # HTML Views chia theo phân hệ
│       ├── client/              # Giao diện Khách hàng (Trang chủ, Thú cưng, Đặt lịch)
│       ├── doctor/              # Giao diện Portal Bác sĩ (Lịch khám, Nhập bệnh án)
│       ├── shop/                # Giao diện Shop, Chi tiết sản phẩm, Giỏ hàng, Checkout
│       └── admin/               # Giao diện Dashboard Quản trị & Quản lý đơn hàng
│
└── docs/                        # TÀI LIỆU KỸ THUẬT BỔ TRỢ
    ├── API_CONTRACT.md          # Hợp đồng Giao tiếp REST API giữa Client & Server
    └── DATABASE_SCHEMA.md       # Sơ đồ Cơ sở Dữ liệu & ERD Blueprint
```

---

## 5. MÔ HÌNH DỮ LIỆU CỐT LÕI (CORE DATA MODELS BLUEPRINT)

Backend sử dụng Django ORM trên MySQL 8.0. Tên Model và các Trường (Fields) được chuẩn hóa như sau:

1. **User Model (`apps.accounts.models.User`)**:
   - Extends `AbstractUser`.
   - `role`: CharField (`CUSTOMER`, `DOCTOR`, `STAFF`, `ADMIN`), default=`CUSTOMER`.
   - `phone_number`: CharField(max_length=15), `address`: TextField(blank=True), `avatar`: ImageField(upload_to='avatars/', null=True).
2. **Pet Model (`apps.pets.models.Pet`)**:
   - `owner`: ForeignKey -> `User` (`on_delete=models.CASCADE`, related_name='pets').
   - `name`: CharField, `species`: CharField (Chó, Mèo, ...), `breed`: CharField, `gender`: CharField, `birth_date`: DateField, `weight`: DecimalField, `notes`: TextField, `avatar`: ImageField.
3. **Service Model (`apps.bookings.models.Service`)**:
   - `name`: CharField, `description`: TextField, `price_vnd`: DecimalField(max_digits=12, decimal_places=0), `duration_minutes`: IntegerField, `is_active`: BooleanField(default=True).
4. **Appointment Model (`apps.bookings.models.Appointment`)**:
   - `customer`: ForeignKey -> `User`, `pet`: ForeignKey -> `Pet`, `service`: ForeignKey -> `Service`.
   - `doctor`: ForeignKey -> `User` (`limit_choices_to={'role': 'DOCTOR'}`).
   - `appointment_date`: DateField, `time_slot`: CharField (vd: `"09:00-10:00"`), `status`: CharField (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
5. **MedicalRecord Model (`apps.medical.models.MedicalRecord`)**:
   - `appointment`: OneToOneField -> `Appointment` (`on_delete=models.CASCADE`).
   - `doctor`: ForeignKey -> `User`, `symptoms`: TextField, `diagnosis`: TextField, `treatment_plan`: TextField, `prescriptions`: JSONField/TextField, `revisit_date`: DateField(null=True).
6. **Product & Order Models (`apps.shop`, `apps.orders`)**:
   - `Product`: `name`, `category`, `price_vnd`, `stock_quantity`, `description`, `image`, `is_active`.
   - `Order`: `customer`: ForeignKey -> `User`, `total_amount_vnd`: DecimalField, `status`: CharField (`PENDING`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELLED`), `shipping_address`, `shipping_phone`, `notes`.
   - `OrderItem`: `order`: ForeignKey -> `Order`, `product`: ForeignKey -> `Product`, `quantity`: IntegerField, `unit_price_vnd`: DecimalField.