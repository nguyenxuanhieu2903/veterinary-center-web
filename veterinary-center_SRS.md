# Veterinary Center – Hệ thống Website Quản lý & Đặt lịch Trung tâm Thú y

## Tài liệu Đặc tả Yêu cầu Hệ thống (SRS)

| Hạng mục | Nội dung |
| :--- | :--- |
| **Tên dự án** | **Website Trung tâm Thú y (Veterinary Center Web Application)** |
| **Học phần** | Lập trình Website (Mã HP: 012012103105) |
| **Trường** | Đại học Giao thông vận tải TP. Hồ Chí Minh (UTH) |
| **Tập thể thực hiện** | Nhóm 2 |
| **Thời gian** | TP. Hồ Chí Minh – Năm 2026 |

---

## Mục lục

1. [Chương 1. Giới thiệu](#chương-1-giới-thiệu-introduction)
2. [Chương 2. Mô tả tổng quan](#chương-2-mô-tả-tổng-quan-overall-description)
3. [Chương 3. Yêu cầu chức năng](#chương-3-yêu-cầu-chức-năng-functional-requirements)
4. [Chương 4. Yêu cầu phi chức năng](#chương-4-yêu-cầu-phi-chức-năng-non-functional-requirements)
5. [Chương 5. Quy tắc nghiệp vụ, triển khai và ràng buộc](#chương-5-quy-tắc-nghiệp-vụ-triển-khai-và-ràng-buộc)
6. [Chương 6. Tiêu chí nghiệm thu](#chương-6-tiêu-chí-nghiệm-thu-acceptance-criteria)
7. [Phụ lục](#phụ-lục-appendices)

---

## CHƯƠNG 1. GIỚI THIỆU (INTRODUCTION)

### 1.1. Mục đích tài liệu

Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này mô tả toàn bộ **yêu cầu chức năng**, **yêu cầu phi chức năng**, **mô hình dữ liệu**, **quy tắc nghiệp vụ**, **phương án triển khai deployment** và **tiêu chí nghiệm thu** cho hệ thống Website Trung tâm Thú y. Tài liệu đóng vai trò làm căn cứ kỹ thuật chuẩn hóa cho tất cả 6 thành viên trong nhóm phát triển, kiểm thử, cũng như làm cơ sở nghiệm thu cho giảng viên hướng dẫn môn Lập trình Website.

### 1.2. Tổng quan dự án

Website Trung tâm Thú y là hệ thống ứng dụng web đa chức năng, giúp nâng cao trải nghiệm chăm sóc thú cưng của khách hàng và tối ưu hóa quy trình quản lý khám chữa bệnh, bán hàng của trung tâm thú y.

Hệ thống kết hợp nền tảng công nghệ:

- **Backend:** Python + Django Framework (triển khai theo mô hình MVT - Model-View-Template).
- **Cơ sở dữ liệu:** MySQL 8.0 đóng gói container.
- **Bộ đệm & Hàng đợi:** Redis & Celery Task Queue (xử lý gửi Email thông báo/nhắc lịch tự động bất đồng bộ).
- **Frontend:** HTML5, CSS3 (Bootstrap 5 / Tailwind CSS), JavaScript (Vanilla JS / Fetch API).
- **Hạ tầng & Đóng gói:** Docker & Docker Compose.

### 1.3. Phạm vi dự án

| Phạm vi | Nội dung |
| :--- | :--- |
| **In-Scope (Trong phạm vi đồ án)** | • Đăng ký/Đăng nhập & Phân quyền 4 vai trò độc lập (`Customer`, `Doctor`, `Staff`, `Admin`).<br>• Quản lý hồ sơ thú cưng cá nhân.<br>• Đặt lịch khám trực tuyến, phân công Bác sĩ và chọn ca.<br>• Cửa hàng thú cưng (Shop), Giỏ hàng (Session Cart) & Checkout tạo đơn hàng (Thanh toán COD).<br>• Portal Bác sĩ: Quản lý ca khám, cập nhật hồ sơ y tế/chẩn đoán/kê đơn thuốc/lịch tái khám.<br>• Tự động hóa gửi Email xác nhận & nhắc lịch khám ngầm qua Celery Worker & Redis.<br>• Portal Admin/Staff: Quản lý người dùng, danh mục dịch vụ, sản phẩm, tồn kho và trạng thái đơn hàng.<br>• Đóng gói toàn bộ ứng dụng trên Docker Container & Nạp dữ liệu mẫu (Data Seeding). |
| **Out-of-Scope (Định hướng mở rộng)** | • Cổng thanh toán trực tuyến thực tế (Momo/VNPAY - thanh toán mô phỏng/COD trong phạm vi chính).<br>• Tích hợp Google Maps tra cứu vị trí chi nhánh.<br>• Mã QR Code truy cập nhanh hồ sơ thú cưng.<br>• Đa ngôn ngữ (Tiếng Việt / Tiếng Anh). |

### 1.4. Đối tượng sử dụng tài liệu

Giảng viên hướng dẫn môn Lập trình Web, Trưởng nhóm (Leader/DevOps), Các Lập trình viên Backend/Frontend trong nhóm (TV1 → TV6), và Người kiểm thử hệ thống (Tester).

---

## CHƯƠNG 2. MÔ TẢ TỔNG QUAN (OVERALL DESCRIPTION)

### 2.1. Tổng quan hệ thống

Hệ thống được thiết kế theo kiến trúc Client - Server tổ chức dưới mô hình MVT (Model-View-Template) của Django Web Framework:

- **Frontend Components:** Đảm nhiệm hiển thị thông tin, nhận tương tác người dùng qua các giao diện Responsive (Customer Portal, Doctor Portal, Admin Dashboard).
- **Django Core Application:** Xử lý toàn bộ Business Logic, Authentication, Authorization, Form Validation, và Routing.
- **Database Layer (MySQL 8.0):** Lưu trữ tập trung dữ liệu tài khoản, thú cưng, lịch hẹn, hồ sơ y tế, sản phẩm và đơn hàng.
- **Asynchronous Task Queue (Celery + Redis):**
  - **Redis (Broker/Cache):** Đóng vai trò làm hàng đợi tin nhắn (Message Queue) lưu giữ các task được đẩy từ Django.
  - **Celery Worker:** Chạy dưới dạng process/container ngầm lắng nghe Redis để thực hiện các tác vụ tốn thời gian như gửi Email xác nhận đặt lịch, gửi Email nhắc lịch tái khám tự động định kỳ mà không gây đơ/treo giao diện Web chính.

### 2.2. Đối tượng sử dụng và vai trò (4 Roles)

Website chốt mô hình **4 vai trò độc lập** (không gộp Bác sĩ vào Nhân viên):

| # | Vai trò (Role) | Mã vai trò | Quyền hạn & Trách nhiệm chính | Giới hạn |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Customer** (Khách hàng / Chủ thú cưng) | `CUSTOMER` | Xem dịch vụ/sản phẩm; quản lý hồ sơ thú cưng cá nhân; đặt lịch khám trực tuyến; quản lý giỏ hàng & tạo đơn hàng COD; xem lịch sử khám và lịch sử đơn hàng cá nhân. | Chỉ truy cập dữ liệu của chính mình. Không thể xem hồ sơ của khách hàng khác bằng cách sửa URL. |
| 2 | **Doctor** (Bác sĩ thú y) | `DOCTOR` | Đăng nhập Portal Bác sĩ; xem lịch khám được phân công; cập nhật hồ sơ khám bệnh (triệu chứng, chẩn đoán), kê đơn thuốc và đặt lịch tái khám. | Chỉ cập nhật bệnh án thuộc ca khám được phân công. Không chỉnh sửa giá sản phẩm/dịch vụ. |
| 3 | **Staff** (Nhân viên trung tâm) | `STAFF` | Quản lý danh mục sản phẩm, dịch vụ; tiếp nhận và chuyển trạng thái đơn hàng (Chờ duyệt, Đang giao, Complete); hỗ trợ duyệt lịch khám tại quầy. | Không có quyền quản trị hệ thống sâu hoặc phân quyền tài khoản. |
| 4 | **Admin** (Quản trị viên) | `ADMIN` | Quản lý toàn bộ người dùng và gán vai trò; quản lý danh mục toàn hệ thống; xem báo cáo thống kê doanh thu/lịch hẹn; cấu hình hệ thống. | Thao tác nhạy cảm được kiểm soát nghiêm ngặt. |

### 2.3. Môi trường hoạt động

| Nhóm | Thành phần |
| :--- | :--- |
| **Backend & Web Server** | Python 3.11+, Django 4.2+, WSGI/ASGI Server, WhiteNoise (Static files) |
| **Cơ sở dữ liệu** | MySQL 8.0 (Containerized) |
| **Task Queue & Cache** | Celery 5.x + Redis 7.x |
| **Frontend Framework** | HTML5, CSS3, Bootstrap 5 / Tailwind CSS, JavaScript (AJAX/Fetch API) |
| **Đóng gói & Hạ tầng** | Docker Desktop, Docker Compose v2, Linux/VPS Server (HTTPS/SSL) |

### 2.4. Giới hạn triển khai

| Hạng mục | Giới hạn |
| :--- | :--- |
| **Thời gian** | 5 tuần phát triển và triển khai theo tiến độ WBS |
| **Kiến trúc mã nguồn** | Django MVT chuẩn, tương tác trang chính qua Templates & Forms; AJAX bổ sung tương tác động |
| **Phương thức thanh toán** | COD (Thanh toán khi nhận hàng / Khám trực tiếp); chưa bắt buộc tích hợp cổng thanh toán trực tuyến thật |

---

## CHƯƠNG 3. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 3.1. Quản lý Người dùng & Xác thực (Auth & Account Management)

#### 3.1.1. Bảng yêu cầu chức năng

| Mã yêu cầu | Chức năng | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| :--- | :--- | :--- | :--- | :--- |
| FR-AUT-01 | Register Account | Đăng ký tài khoản Khách hàng mới với validation | Customer | High |
| FR-AUT-02 | Login / Logout | Đăng nhập và Đăng xuất với phân quyền 4 vai trò | All Roles | High |
| FR-AUT-03 | Profile Management | Xem và cập nhật thông tin cá nhân (Họ tên, SĐT, Địa chỉ, Email) | All Roles | High |
| FR-AUT-04 | Password Reset | Khôi phục mật khẩu qua Email | All Roles | Medium |
| FR-AUT-05 | RBAC Access Control | Kiểm soát quyền truy cập URL theo vai trò tại Middleware/Decorators | System | High |

---

### 3.2. Phân hệ Quản lý Thú cưng (Pet Management)

#### 3.2.1. Bảng yêu cầu chức năng

| Mã yêu cầu | Chức năng | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| :--- | :--- | :--- | :--- | :--- |
| FR-PET-01 | View Pet List | Hiển thị danh sách thú cưng do Khách hàng sở hữu | Customer | High |
| FR-PET-02 | Add Pet Profile | Thêm mới hồ sơ thú cưng (Tên, loài, giống, giới tính, ngày sinh, tình trạng sức khỏe, ảnh) | Customer | High |
| FR-PET-03 | Update Pet Profile | Cập nhật thông tin chi tiết thú cưng | Customer | High |
| FR-PET-04 | Delete Pet Profile | Xóa hồ sơ thú cưng (chỉ khi không có lịch khám đang xử lý) | Customer | Medium |
| FR-PET-05 | View Pet Medical History | Xem lịch sử khám chữa bệnh chi tiết của từng thú cưng | Customer, Doctor | High |

---

### 3.3. Phân hệ Đặt lịch khám & Quản lý Y tế (Appointment & Medical Records)

#### 3.3.1. Bảng yêu cầu chức năng

| Mã yêu cầu | Chức năng | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| :--- | :--- | :--- | :--- | :--- |
| FR-APP-01 | View Services List | Hiển thị danh sách dịch vụ thú y (Khám tổng quát, Tiêm phòng, Phẫu thuật, Grooming...) | Customer | High |
| FR-APP-02 | Book Appointment | Đặt lịch khám trực tuyến (Chọn thú cưng, Dịch vụ, Bác sĩ, Ngày/Giờ khám) | Customer | High |
| FR-APP-03 | Validate Booking Slot | Kiểm tra trùng lịch Bác sĩ và ca khám khả dụng | System | High |
| FR-APP-04 | Send Booking Email | Tự động gửi Email xác nhận đặt lịch ngầm qua Celery | System | High |
| FR-APP-05 | Doctor Schedule View | Bác sĩ xem danh sách các ca khám được phân công theo ngày | Doctor | High |
| FR-MED-01 | Create Medical Record | Bác sĩ cập nhật Bệnh án (Triệu chứng, Chẩn đoán, Kết quả khám) | Doctor | High |
| FR-MED-02 | Prescribe Medication | Bác sĩ kê đơn thuốc (Tên thuốc, liều dùng, ghi chú) | Doctor | High |
| FR-MED-03 | Set Revisit Date | Bác sĩ hẹn lịch tái khám / tiêm phòng đợt sau | Doctor | High |
| FR-APP-06 | Send Reminder Email | Celery Beat/Task chạy ngầm tự động gửi Email nhắc lịch trước 24h | System | High |

#### 3.3.2. Bảng trạng thái Lịch hẹn (Appointment Status)

| Trạng thái | Ý nghĩa |
| :--- | :--- |
| `PENDING` | Mới đặt, chờ trung tâm xác nhận |
| `CONFIRMED` | Đã xác nhận lịch, sẵn sàng khám |
| `COMPLETED` | Khám hoàn tất, đã cập nhật bệnh án |
| `CANCELLED` | Lịch hẹn đã bị hủy |

---

### 3.4. Phân hệ Cửa hàng, Giỏ hàng & Đơn hàng (Shop, Cart & Order)

#### 3.4.1. Bảng yêu cầu chức năng

| Mã yêu cầu | Chức năng | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| :--- | :--- | :--- | :--- | :--- |
| FR-SHP-01 | Product Catalog | Display danh sách sản phẩm theo danh mục, giá, tồn kho và tìm kiếm | Customer | High |
| FR-SHP-02 | Product Detail | Xem thông tin chi tiết sản phẩm và hình ảnh | Customer | High |
| FR-CRT-01 | Session Cart Operations | Thêm, sửa số lượng, xóa sản phẩm trong Giỏ hàng (Session Cart) | Customer | High |
| FR-ORD-01 | Checkout Order | Đặt hàng COD (Nhập địa chỉ giao hàng, SĐT nhận hàng, ghi chú) | Customer | High |
| FR-ORD-02 | Calculate Total Price | Backend tự động tính tổng tiền từ Database (tránh gian lận giá Client) | System | High |
| FR-ORD-03 | Manage Order Status | Staff/Admin chuyển trạng thái đơn (Chờ duyệt -> Đang giao -> Completed / Cancelled) | Staff, Admin | High |
| FR-ORD-04 | View Order History | Khách hàng xem lịch sử đơn hàng và chi tiết từng đơn | Customer | High |

#### 3.4.2. Bảng trạng thái Đơn hàng (Order Status)

| Trạng thái | Ý nghĩa |
| :--- | :--- |
| `PENDING` | Đơn hàng mới tạo, chờ Staff duyệt |
| `PROCESSING` | Đang đóng gói và chuẩn bị giao |
| `SHIPPED` | Đang giao hàng |
| `COMPLETED` | Giao hàng và thu tiền COD thành công |
| `CANCELLED` | Đơn hàng đã bị hủy |

---

### 3.5. Phân hệ Quản trị & Báo cáo (Admin & Operations Dashboard)

#### 3.5.1. Bảng yêu cầu chức năng

| Mã yêu cầu | Chức năng | Mô tả yêu cầu | Tác nhân | Ưu tiên |
| :--- | :--- | :--- | :--- | :--- |
| FR-ADM-01 | User CRUD & Role Assign | Quản lý người dùng, tạo tài khoản Bác sĩ/Nhân viên, phân quyền | Admin | High |
| FR-ADM-02 | Product & Service CRUD | Thêm, sửa, ngưng kinh doanh Sản phẩm và Dịch vụ thú y | Admin, Staff | High |
| FR-ADM-03 | Inventory Management | Cập nhật số lượng tồn kho sản phẩm | Admin, Staff | High |
| FR-ADM-04 | Revenue & Order Report | Xem báo cáo thống kê doanh thu đơn hàng, số lượt đặt lịch | Admin | Medium |
| FR-ADM-05 | Data Seeding Script | Script tự động nạp dữ liệu mẫu sinh động cho Demo | Admin / System | High |

---

## CHƯƠNG 4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

### 4.1. Hiệu năng (Performance)

| Mã | Tên | Mô tả |
| :--- | :--- | :--- |
| `NFR-PER-01` | Response Time | Thời gian phản hồi trang Web < 2s cho 95% số lượng request trong điều kiện bình thường. |
| `NFR-PER-02` | Database Query | Tối ưu truy vấn ORM (dùng `select_related`, `prefetch_related`) để tránh lỗi N+1 Query. |
| `NFR-PER-03` | Async Email | Gửi Email qua Celery Worker ngầm không làm gián đoạn hoặc tắc nghẽn luồng xử lý HTTP Request chính. |

### 4.2. Bảo mật & Phân quyền (Security)

| Mã | Tên | Mô tả |
| :--- | :--- | :--- |
| `NFR-SEC-01` | URL Access Security | Kiểm tra phân quyền URL nghiêm ngặt tại Backend. Khách hàng không thể đổi ID trên URL để xem hồ sơ của người khác. |
| `NFR-SEC-02` | Password Hashing | Mật khẩu lưu trữ băm bằng thuật toán mặc định PBKDF2 / SHA256 của Django. |
| `NFR-SEC-03` | CSRF & XSS Protection | Bắt buộc kiểm tra CSRF Token cho tất cả các Form POST và sanitize dữ liệu đầu vào. |
| `NFR-SEC-04` | Admin Security | Kiểm soát chặt chẽ các quyền truy cập vào trang Django Admin và Admin Dashboard. |

### 4.3. Đóng gói & Triển khai (Deployment & Containerization)

| Mã | Tên | Mô tả |
| :--- | :--- | :--- |
| `NFR-DEP-01` | Docker Standardization | Toàn bộ ứng dụng (Web Django, DB MySQL, Redis, Celery) khởi chạy đồng bộ chỉ bằng câu lệnh `docker compose up`. |
| `NFR-DEP-02` | Production Server | Sẵn sàng triển khai lên VPS (Render/Railway/Ubuntu VPS) tích hợp chứng chỉ bảo mật HTTPS/TLS. |

---

## CHƯƠNG 5. QUY TẮC NGHIỆP VỤ, TRIỂN KHAI VÀ RÀNG BUỘC

### 5.1. Quy tắc Đặt lịch & Y tế

| Mã | Quy tắc |
| :--- | :--- |
| BR-APP-01 | Khách hàng chỉ được đặt lịch khám cho Thú cưng do mình sở hữu. |
| BR-APP-02 | Một Bác sĩ không thể nhận 2 lịch khám trùng nhau trong cùng một ca/khung giờ. |
| BR-APP-03 | Chỉ Bác sĩ được phân công ca khám mới có quyền tạo và chỉnh sửa Bệnh án, Đơn thuốc cho ca đó. |
| BR-APP-04 | Bệnh án đã lưu sau khi hoàn tất ca khám chỉ được sửa bởi Bác sĩ phụ trách hoặc Admin. |

### 5.2. Quy tắc Mua hàng & Giỏ hàng

| Mã | Quy tắc |
| :--- | :--- |
| BR-ORD-01 | Tổng tiền đơn hàng BẮT BUỘC do Backend tự tính toán dựa trên giá niêm yết trong DB, tuyệt đối không tin tưởng tổng tiền gửi từ Client. |
| BR-ORD-02 | Không cho phép đặt mua sản phẩm có số lượng tồn kho = 0 hoặc đã ngưng kinh doanh. |
| BR-ORD-03 | Số lượng tồn kho sản phẩm sẽ được tự động trừ khi đơn hàng chuyển sang trạng thái `PROCESSING` hoặc `SHIPPED`. |

### 5.3. Quy tắc Phân quyền (RBAC)

| Mã | Quy tắc |
| :--- | :--- |
| BR-ACL-01 | `CUSTOMER`: Không được truy cập vào Portal Bác sĩ, Dashboard Nhân viên hay trang Admin. |
| BR-ACL-02 | `DOCTOR`: Được xem lịch làm việc, cập nhật bệnh án nhưng không được sửa giá dịch vụ hay xem doanh thu cửa hàng. |
| BR-ACL-03 | `STAFF`: Được duyệt đơn hàng, cập nhật kho nhưng không được đổi vai trò của người dùng khác. |
| BR-ACL-04 | Phân quyền phải thực thi nghiêm ngặt tại Backend (Decorators / Middleware), không được chỉ ẩn nút trên UI. |

### 5.4. Quy trình và Đặc tả Triển khai (Deployment Specification)

Hệ thống được quy định triển khai chuẩn hóa theo phương án sau:

- **Máy chủ (Hosting):** Thuê máy chủ ảo riêng (VPS - Virtual Private Server OS Linux/Ubuntu Server) để tự quản lý toàn bộ môi trường triển khai.
- **Ứng dụng chính:** Python 3.11+ kết hợp Django Framework.
- **Đóng gói & Quản lý Container:** Sử dụng Docker & Docker Compose chạy 4 Services độc lập (`web`, `db`, `redis`, `celery`).
- **Tên miền & DNS:** Thuê tên miền chính thức (Domain) và cấu hình các bản ghi DNS trỏ trực tiếp IP về VPS.
- **Bảo mật kết nối:** Bắt buộc áp dụng mã hóa giao thức HTTPS/TLS (Cấu hình chứng chỉ SSL/TLS miễn phí qua Let's Encrypt / Certbot).
- **Nhà cung cấp VPS & Chi phí:** Để mở, nhóm sẽ so sánh chi tiết giữa các bên (VietNix, AZDIGI, Render, Railway, Vultr...) trước khi chọn mua ở giai đoạn triển khai Tuần 5.

---

## CHƯƠNG 6. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)

### 6.1. Bảng Tiêu chí Nghiệm thu Chức năng

| ID | Hạng mục kiểm thử | Tiêu chí nghiệm thu | Kết quả mong đợi |
| :--- | :--- | :--- | :--- |
| AC-FUN-01 | Khởi chạy Docker | Chạy `docker compose up` trên máy sạch | Các Container (Web, MySQL, Redis, Celery) khởi chạy mượt mà, không báo lỗi. |
| AC-FUN-02 | Đăng ký/Đăng nhập | Tạo tài khoản Khách hàng mới và đăng nhập | Đăng nhập thành công, session được khởi tạo, chuyển hướng đúng Dashboard. |
| AC-FUN-03 | Quản lý Thú cưng | Thêm mới 1 thú cưng kèm hình ảnh | Dữ liệu lưu vào MySQL, hiển thị đúng trên danh sách thú cưng cá nhân. |
| AC-FUN-04 | Đặt lịch khám | Chọn dịch vụ, chọn Bác sĩ và chọn khung giờ | Tạo lịch thành công (`PENDING`), Celery gửi Email xác nhận ngầm về hộp thư Khách hàng. |
| AC-FUN-05 | Portal Bác sĩ | Bác sĩ đăng nhập, chọn ca khám và nhập Bệnh án | Lưu thành công chẩn đoán, đơn thuốc; lịch chuyển trạng thái `COMPLETED`. |
| AC-FUN-06 | Mua hàng & Giỏ hàng | Thêm sản phẩm vào giỏ, thực hiện Checkout COD | Tạo đơn hàng thành công trong DB, giỏ hàng Session được làm sạch. |
| AC-FUN-07 | Bảo mật URL | Khách hàng đổi ID trên URL để truy cập bệnh án người khác | Hệ thống trả về lỗi 403 Forbidden hoặc 404 Not Found. |
| AC-FUN-08 | Email Nhắc lịch | Chạy Task Celery nhắc lịch hẹn | Email nhắc lịch được gửi tự động tới các khách hàng có lịch khám ngày kế tiếp. |

---

## PHỤ LỤC (APPENDICES)

### Phụ lục A. Danh sách mã yêu cầu

| Nhóm mã | Phạm vi |
| :--- | :--- |
| `FR-AUT-*` | Quản lý Xác thực & Tài khoản |
| `FR-PET-*` | Quản lý Thú cưng |
| `FR-APP-*` / `FR-MED-*` | Quản lý Đặt lịch & Bệnh án Y tế |
| `FR-SHP-*` / `FR-CRT-*` / `FR-ORD-*` | Quản lý Cửa hàng, Giỏ hàng & Đơn hàng |
| `FR-ADM-*` | Quản trị Hệ thống & Dashboard |
| `NFR-*` | Yêu cầu Phi chức năng (Performance, Security, Deployment) |
| `BR-*` | Quy tắc nghiệp vụ bắt buộc |

### Phụ lục B. Bảng thuật ngữ

| Thuật ngữ | Giải thích |
| :--- | :--- |
| **MVT** | Model-View-Template – Pattern kiến trúc thiết kế mặc định của Django Framework |
| **RBAC** | Role-Based Access Control – Kiểm soát truy cập dựa trên vai trò |
| **Celery** | Distributed Task Queue dùng để xử lý tác vụ bất đồng bộ ngầm |
| **Redis** | In-memory Data Structure Store dùng làm Message Broker cho Celery |
| **COD** | Cash On Delivery – Thanh toán tiền mặt khi nhận hàng/khám trực tiếp |
| **Data Seeding** | Kịch bản khởi tạo tự động dữ liệu mẫu vào Cơ sở dữ liệu |
