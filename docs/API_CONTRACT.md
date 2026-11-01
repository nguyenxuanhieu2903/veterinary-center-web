# API CONTRACT — VETERINARY CENTER SYSTEM

**Document Type:** Technical API Specification & Contract  
**Project:** Website Trung tâm Thú y (Veterinary Center Web Application)  
**Base URL:** `http://127.0.0.1:8000/api/v1/`  
**Data Format:** `application/json`  

---

## 1. CHUẨN ĐỊNH DẠNG RESPONSE (STANDARD RESPONSE FORMAT)

Tất cả các API Response từ Backend Django DRF gửi về cho Client (Frontend) BẮT BUỘC tuân thủ cấu trúc JSON chuẩn sau:

### 1.1. Response Thành công (HTTP Status 200/201)
```json
{
  "success": true,
  "code": 200,
  "message": "Thao tác thực hiện thành công.",
  "data": { ... }
}
```

### 1.2. Response Thất bại (HTTP Status 400/401/403/404/500)
```json
{
  "success": false,
  "code": 400,
  "message": "Thông tin nhập vào không hợp lệ.",
  "errors": {
    "field_name": ["Thông báo lỗi chi tiết của trường"]
  }
}
```

---

## 2. DANH SÁCH ENDPOINTS CHÍNH (CORE ENDPOINTS)

### 2.1. Xác thực & Tài khoản (`/api/v1/accounts/`)
- `POST /api/v1/accounts/register/` — Đăng ký tài khoản Khách hàng mới (`CUSTOMER`).
- `POST /api/v1/accounts/token/` — Đăng nhập, nhận JWT `access_token` và `refresh_token`.
- `POST /api/v1/accounts/token/refresh/` — Lấy `access_token` mới từ `refresh_token`.
- `GET /api/v1/accounts/profile/` — Xem thông tin cá nhân hiện tại.
- `PUT/PATCH /api/v1/accounts/profile/` — Cập nhật thông tin cá nhân.

### 2.2. Hồ sơ Thú cưng (`/api/v1/pets/`)
- `GET /api/v1/pets/` — Danh sách thú cưng của Khách hàng hiện tại.
- `POST /api/v1/pets/` — Thêm hồ sơ thú cưng mới (Upload ảnh multipart form).
- `GET /api/v1/pets/{id}/` — Chi tiết thú cưng.
- `PUT/PATCH /api/v1/pets/{id}/` — Cập nhật hồ sơ thú cưng.
- `DELETE /api/v1/pets/{id}/` — Xóa thú cưng.

### 2.3. Dịch vụ & Đặt lịch khám (`/api/v1/bookings/`)
- `GET /api/v1/bookings/services/` — Xem danh sách các Dịch vụ thú y.
- `GET /api/v1/bookings/doctors/` — Danh sách Bác sĩ khả dụng.
- `POST /api/v1/bookings/appointments/` — Đặt lịch khám mới (Tự động trigger Celery Email ngầm).
- `GET /api/v1/bookings/appointments/` — Xem lịch hẹn của Khách hàng hoặc Lịch được phân công của Bác sĩ.
- `PATCH /api/v1/bookings/appointments/{id}/cancel/` — Hủy lịch khám.

### 2.4. Cửa hàng & Đơn hàng COD (`/api/v1/shop/`, `/api/v1/orders/`)
- `GET /api/v1/shop/products/` — Danh sách sản phẩm (Hỗ trợ filter `category`, `search`).
- `GET /api/v1/shop/products/{id}/` — Chi tiết sản phẩm.
- `POST /api/v1/orders/checkout/` — Tạo đơn hàng COD (Backend tự tính tổng tiền `total_amount_vnd`).
- `GET /api/v1/orders/` — Lịch sử đơn hàng của Khách hàng hoặc Danh sách đơn hàng cho Staff/Admin.
- `PATCH /api/v1/orders/{id}/status/` — Staff/Admin chuyển trạng thái đơn hàng (`PENDING` -> `PROCESSING` -> `SHIPPED` -> `COMPLETED`).

### 2.5. Portal Bác sĩ & Bệnh án (`/api/v1/medical/`)
- `GET /api/v1/medical/records/` — Xem bệnh án theo thú cưng hoặc ca khám.
- `POST /api/v1/medical/records/` — Bác sĩ tạo/cập nhật Bệnh án, Chẩn đoán, Kê đơn thuốc và Hẹn tái khám.