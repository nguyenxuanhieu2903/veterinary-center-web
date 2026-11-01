# IMPLEMENTATION PLAN — VETERINARY CENTER SYSTEM

# Kế hoạch Triển khai Kỹ thuật & Luồng Làm việc với AI Agent

## 1. MỤC TIÊU & QUY TẮC LÀM VIỆC BẮT BUỘC

Tài liệu này định nghĩa chi tiết lộ trình phát triển 5 Giai đoạn, phân chia ranh giới module rõ ràng, và thiết lập quy trình làm việc nghiêm ngặt cho AI Agent (Antigravity/Cursor) nhằm đảm bảo dự án vận hành ổn định.

### 1.1. Đọc tài liệu trước khi lập trình

Trước khi thực hiện bất kỳ lệnh sửa code nào, AI Agent BẮT BUỘC phải:

1. Đọc toàn bộ `PRODUCT_SPECIFICATION.md`.

2. Đọc toàn bộ `IMPLEMENTATION_PLAN.md`.

3. Đọc toàn bộ `veterinary-center_SRS.md`.

4. Kiểm tra cây thư mục và trạng thái Git hiện tại (`git status`).

5. Kiểm tra sự tồn tại của file cấu hình môi trường `.env`.

### 1.2. Nguyên tắc "Chỉ một Giai đoạn mỗi lần"

* AI Agent CHỈ ĐƯỢC THỰC HIỆN Giai đoạn được chỉ định trong prompt hiện tại.

* KHÔNG tự ý chuyển sang Giai đoạn tiếp theo khi chưa được người dùng kiểm thử và xác nhận bằng câu lệnh.

* KHÔNG tạo trước các tính năng thừa ngoài phạm vi Giai đoạn hiện tại.

* Sau khi hoàn thành một Giai đoạn, phải báo cáo theo Mẫu tại Mục 4 và dừng lại chờ xác nhận.

### 1.3. Phân chia ranh giới Module

* **Backend Code:** Nằm hoàn toàn trong thư mục `/backend/`.

* **Frontend Code:** Nằm hoàn toàn trong thư mục `/frontend/`.

* Giao tiếp giữa 2 phân hệ bắt buộc tuân theo hợp đồng REST API tại `docs/API_CONTRACT.md`.

* AI Agent tuyệt đối không tự ý thay đổi cấu trúc dữ liệu JSON response hoặc URL endpoint mà chưa ghi nhận vào `API_CONTRACT.md`.

### 1.4. Bảo vệ thông tin nhạy cảm

* KHÔNG hardcode mật khẩu MySQL, Secret Key, Email Password vào code hoặc Git repository.

* Sử dụng biến môi trường qua file `.env` local.

* File `.env.example` phải cung cấp các giá trị mẫu an toàn.

* File `.env` bắt buộc phải nằm trong `.gitignore`.

## 2. KẾ HOẠCH PHÁT TRIỂN NATIVE CHI TIẾT (5 GIAI ĐOẠN)

### 🚀 Giai đoạn 0 — Kiểm tra Môi trường Local & Khởi tạo Cấu trúc

**Mục tiêu:** Thiết lập nền tảng dự án Native, kiểm tra các công cụ local và thống nhất API Contract.

**Công việc:**

1. Tạo cây thư mục chuẩn: `/backend`, `/frontend`, `/docs`.

2. Khởi tạo `.gitignore` và file `.env.example` với các biến chuẩn:

   ```
   SECRET_KEY=your-django-secret-key
   DEBUG=True
   DB_NAME=veterinary_db
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_HOST=127.0.0.1
   DB_PORT=3306
   REDIS_URL=redis://127.0.0.1:6379/0
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   
   ```

3. Khởi tạo tài liệu `docs/API_CONTRACT.md` định nghĩa chuẩn định dạng Response (Code, Message, Data, Errors).

4. Kiểm tra các dịch vụ Native trên máy local: Python 3.11+, MySQL Server 8.0 (hoặc XAMPP/Workbench) và Redis Server local.

5. Tạo Virtual Environment (`venv`) trong `/backend` và cài đặt các package cơ bản: `django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `mysqlclient`, `python-decouple`, `celery`, `redis`.

**Điều kiện hoàn thành:**

* Cây thư mục được tạo đúng cấu trúc.

* Backend Django kết nối thành công tới MySQL Local thông qua biến môi trường trong `.env`.

* Redis Server local phản hồi lệnh `ping`.

* Chưa có code nghiệp vụ nâng cao được tạo ra.

**Git Checkpoint:** `chore: initialize native project structure, env config, and api contract`

### 🔐 Giai đoạn 1 — Backend Core: Auth, Custom User & Phân quyền 4 Roles

**Mục tiêu:** Xây dựng Custom User Model và cơ chế phân quyền RBAC 4 vai trò độc lập tại Backend (`/backend/apps/accounts`) sử dụng SimpleJWT Authentication.

**Công việc:**

1. Tạo Django App `apps.accounts`.

2. Định nghĩa Custom User Model thừa kế `AbstractUser` chứa các field: `role` (`CUSTOMER`, `DOCTOR`, `STAFF`, `ADMIN`), `phone_number`, `address`, `avatar`.

3. Đăng ký Custom User Model trong `settings.py` (`AUTH_USER_MODEL = 'accounts.User'`).

4. Viết APIs cho: Đăng ký tài khoản Khách hàng (`FR-AUT-01`), Đăng nhập nhận JWT Access/Refresh Token (`FR-AUT-02`), Cập nhật Profile (`FR-AUT-03`).

5. Viết Custom Permission Classes (`IsCustomer`, `IsDoctor`, `IsStaff`, `IsAdmin`) để thực thi `BR-ACL-01`.

6. Thực hiện Django Migrations vào MySQL Local.

**Điều kiện hoàn thành:**

* Đăng ký và Đăng nhập trả về JWT Token thành công.

* Kiểm thử phân quyền: Tài khoản `CUSTOMER` truy cập API dành cho `DOCTOR` hoặc `ADMIN` phải bị chặn với mã lỗi `403 Forbidden` (`NFR-SEC-01`).

* Mật khẩu được mã hóa an toàn bằng thuật toán mặc định của Django.

**Git Checkpoint:** `feat(backend): implement custom user model and 4-role rbac authorization`

### 🩺 Giai đoạn 2 — Backend Modules: Thú cưng, Đặt lịch & Celery Email

**Mục tiêu:** Hoàn thiện APIs Quản lý Thú cưng, Dịch vụ y tế, Đặt lịch khám và gửi Email bất đồng bộ (`/backend/apps/pets`, `/backend/apps/bookings`).

**Công việc:**

1. App `apps.pets`: Viết CRUD APIs cho Hồ sơ thú cưng (`FR-PET-01` $\rightarrow$ `FR-PET-04`). Ràng buộc khách hàng chỉ xem/sửa được thú cưng do mình sở hữu.

2. App `apps.bookings`: Viết APIs Danh mục Dịch vụ y tế (`FR-APP-01`).

3. Đặt lịch khám (`FR-APP-02`): Viết logic kiểm tra trùng lịch Bác sĩ (`BR-APP-01`, `BR-APP-02`). Không cho phép 1 Bác sĩ nhận 2 ca trùng khung giờ.

4. Cấu hình Celery Worker & Redis Broker trong `config/celery.py`.

5. Viết Celery Task ngầm gửi Email xác nhận đặt lịch ngầm (`FR-APP-04`) và Email nhắc lịch hẹn trước 24h (`FR-APP-06`).
   *(Lưu ý chạy Celery ở Windows Local: Sử dụng cờ `--pool=solo`)*

**Điều kiện hoàn thành:**

* Đặt lịch khám thành công, kiểm tra trùng lịch hoạt động chính xác.

* Khi đặt lịch thành công, HTTP Response trả về ngay lập tức (< 2s), tác vụ gửi Email được Celery Worker thực hiện ngầm dưới nền mà không gây đơ giao diện.

* Viết bài test cho logic kiểm tra trùng lịch Bác sĩ.

**Git Checkpoint:** `feat(backend): implement pet management, appointment booking logic, and celery email tasks`

### 🛒 Giai đoạn 3 — Backend Modules: Shop, Đơn hàng COD & Portal Bác sĩ

**Mục tiêu:** Hoàn thiện phân hệ Bán hàng COD, Giỏ hàng, Tồn kho và Portal Y tế Bác sĩ (`/backend/apps/shop`, `/backend/apps/orders`, `/backend/apps/medical`).

**Công việc:**

1. App `apps.shop`: APIs Danh mục sản phẩm, xem chi tiết, tìm kiếm và quản lý tồn kho (`FR-SHP-01`, `FR-SHP-02`).

2. App `apps.orders`: Quản lý Giỏ hàng. Viết API Checkout COD (`FR-ORD-01`).

3. Thực thi `BR-ORD-01`: Backend tự động truy vấn giá trong DB và tính `total_amount_vnd`.

4. Khấu trừ tồn kho an toàn bằng `transaction.atomic()` khi đơn hàng chuyển trạng thái (`BR-INV-01`).

5. App `apps.medical`: APIs dành cho Doctor Portal – Bác sĩ xem ca khám được phân công (`FR-APP-05`), cập nhật Bệnh án, kê đơn thuốc và đặt lịch tái khám (`FR-MED-01` $\rightarrow$ `FR-MED-03`).

6. Viết script `seed_data.py` nạp dữ liệu mẫu sinh động: Tạo sẵn tài khoản mẫu cho 4 vai trò (Mật khẩu mặc định: `Password123@`), Dịch vụ, Sản phẩm kèm ảnh, Thú cưng mẫu.

**Điều kiện hoàn thành:**

* Luồng Checkout COD hoàn tất, tổng tiền được tính chính xác từ Backend.

* Tồn kho sản phẩm trừ chính xác khi đơn hàng duyệt sang `PROCESSING`.

* Bác sĩ cập nhật bệnh án thành công và lịch khám chuyển trạng thái `COMPLETED`.

* Script Data Seeding chạy mượt mà không lỗi khóa ngoại.

**Git Checkpoint:** `feat(backend): implement shop, order checkout cod, doctor medical portal, and seed data`

### 🎨 Giai đoạn 4 — Frontend Development & Tích hợp REST API

**Mục tiêu:** Dựng toàn bộ giao diện UI trong `/frontend/` và tích hợp Fetch API kết nối với Backend Django.

**Công việc:**

1. Dựng Master Layout Responsive (`header`, `footer`, `navigation`, `sidebar`) sử dụng HTML5 + Tailwind CSS / Bootstrap 5.

2. Customer Portal UI: Dựng trang Đăng ký/Đăng nhập, Trang chủ, Danh sách & Chi tiết dịch vụ, Quản lý Thú cưng cá nhân, Form Đặt lịch khám trực tuyến.

3. Shop & Checkout UI: Dựng trang Cửa hàng, Chi tiết sản phẩm, Giỏ hàng động, Trang Checkout COD và Lịch sử đơn hàng.

4. Doctor Portal UI: Giao diện Bác sĩ xem ca khám theo ngày, Modal/Form nhập Bệnh án, kê đơn thuốc và hẹn tái khám.

5. Admin/Staff Dashboard UI: Giao diện quản lý người dùng, duyệt lịch khám, duyệt đơn hàng và cập nhật tồn kho.

6. Tích hợp JavaScript (Fetch API) gọi đến Backend REST APIs, quản lý JWT Token trong `localStorage`, hiển thị thông báo lỗi và trạng thái loading.

7. Xây dựng file `frontend/js/api_client.js` xử lý tự động refresh token khi gặp HTTP 401.

**Điều kiện hoàn thành:**

* Giao diện hiển thị chuẩn responsive trên Desktop và Mobile.

* Luồng nghiệp vụ tương tác mượt mà từ Frontend xuống Backend.

* Không hardcode dữ liệu giả trên Frontend; mọi dữ liệu đều được load từ Backend REST APIs.

* Kiểm tra bảo mật Frontend: Không lưu trữ bí mật (Secret keys) tại client code.

**Git Checkpoint:** `feat(frontend): complete ui templates and integrate REST APIs with backend`

### 🐳 Giai đoạn 5 — Tích hợp Docker, Kiểm thử Security & Đóng gói Thuyết trình (Tuần 5)

**Mục tiêu:** Đóng gói toàn bộ ứng dụng bằng Docker Compose, chạy kiểm thử tổng duyệt và hoàn thiện tài liệu nộp đồ án.

**Công việc:**

1. Viết `Dockerfile` cho ứng dụng Django Backend.

2. Viết file `docker-compose.yml` định nghĩa 4 Services containerized: `web` (Django), `db` (MySQL 8.0), `redis` (Redis 7.x), `celery` (Celery Worker).

3. Kiểm thử chạy lệnh `docker compose up` trên môi trường sạch, đảm bảo database tự động migrate và nạp seed data.

4. Kiểm thử Security & Performance: Kiểm tra ngăn chặn lỗi URL Tampering (đổi ID trên URL), tối ưu truy vấn ORM (`select_related`, `prefetch_related`) để tránh lỗi N+1 Query.

5. Triển khai demo thử nghiệm lên VPS/Server (nếu có) tích hợp chứng chỉ bảo mật HTTPS/SSL.

6. Hoàn thiện File Báo cáo đồ án Word/PDF và Slide thuyết trình chuyên nghiệp.

**Điều kiện hoàn thành:**

* Câu lệnh `docker compose up` khởi chạy thành công toàn bộ hệ thống mượt mà không có lỗi container.

* Tất cả 8 Tiêu chí Nghiệm thu Chức năng trong tài liệu SRS (AC-FUN-01 $\rightarrow$ AC-FUN-08) đều PASS thành công.

* Báo cáo đồ án Word và Slide hoàn thiện đầy đủ nội dung.

**Git Checkpoint:** `deploy: finalize docker containerization, production configs, and submission docs`

## 3. PROMPT KHUNG CHUẨN GIAO VIỆC CHO AI AGENT

Khi bắt đầu một Giai đoạn, bạn hãy sao chép mẫu Prompt dưới đây, thay thế thông tin trong ngoặc vuông và gửi cho AI Agent (Antigravity / Cursor):

> *"Hãy thực hiện **Giai đoạn \[SỐ VÀ TÊN GIAI ĐOẠN\]** theo đúng quy định trong `IMPLEMENTATION_PLAN.md`, `PRODUCT_SPECIFICATION.md` và `veterinary-center_SRS_3.md`.*
>
> *Trước khi viết hoặc sửa bất kỳ dòng code nào, hãy:*
> *1. Đọc lại kĩ cả 3 tài liệu: `PRODUCT_SPECIFICATION.md`, `IMPLEMENTATION_PLAN.md` và `veterinary-center_SRS_3.md`.*
> *2. Kiểm tra trạng thái Git (`git status`) và cấu trúc thư mục hiện tại.*
> *3. Đảm bảo tuân thủ ranh giới module: Code backend chỉ nằm trong `/backend/`, code frontend chỉ nằm trong `/frontend/`.*
>
> *Chỉ thực hiện đúng phạm vi công việc của Giai đoạn này. Không tự ý chuyển sang Giai đoạn tiếp theo. Không hardcode secret vào source code.*
>
> *Sau khi hoàn thành, hãy chạy các lệnh test/build phù hợp và báo cáo đầy đủ theo **Mẫu báo cáo bắt buộc tại Mục 4 của IMPLEMENTATION_PLAN.md**. Dừng lại và chờ tôi xác nhận trước khi làm tiếp."*

## 4. MẪU BÁO CÁO BẮT BUỘC SAU MỖI GIAI ĐOẠN

Sau khi thực hiện xong một Giai đoạn, AI Agent BẮT BUỘC phải đưa ra báo cáo theo định dạng sau:

```
### A. Kết quả thực hiện
- Giai đoạn: [Tên Giai đoạn]
- Trạng thái: [HOÀN THÀNH / CHƯA HOÀN THÀNH / BỊ CHẶN]
- Các chức năng đã hoàn thành:

### B. Danh sách File đã thay đổi
- File mới tạo:
- File chỉnh sửa:
- File đã xóa (nếu có):

### C. Lệnh đã chạy & Kết quả thực tế
- Lệnh: python manage.py test
  Kết quả: PASS (Mô tả chi tiết kết quả)

### D. Kiểm tra Tuân thủ Quy tắc Nghiệp vụ (Business Rules)
- BR-ORD-01 (Backend tính tổng tiền): [ĐẠT / KHÔNG ÁP DỤNG]
- BR-ACL-01 (Phân quyền RBAC Backend): [ĐẠT / KHÔNG ÁP DỤNG]
- BR-APP-01 (Kiểm tra trùng lịch Bác sĩ): [ĐẠT / KHÔNG ÁP DỤNG]
- BR-APP-02 (Gửi Email ngầm Celery): [ĐẠT / KHÔNG ÁP DỤNG]

### E. Vấn đề tồn đọng & Việc cần làm tiếp theo
- Lỗi/Rủi ro còn lại (nếu có):
- Việc cần người dùng kiểm thử thủ công:
- Đề xuất cho Giai đoạn tiếp theo:

---
Báo cáo hoàn tất. Dừng lại và chờ Người dùng kiểm thử, xác nhận trước khi chuyển sang Giai đoạn tiếp theo.

```