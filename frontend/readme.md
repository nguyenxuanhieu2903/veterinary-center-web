# PetCareClinic -- Frontend

## 1. Giới thiệu
PetCareClinic là giao diện web dành cho hệ thống quản lý phòng khám thú y. Frontend cung cấp các trang cho khách hàng, bác sĩ và quản trị viên, hỗ trợ xem dịch vụ, quản lý hồ sơ thú cưng, đặt lịch khám, mua sản phẩm và theo dõi đơn hàng.

README này mô tả phạm vi giao diện và các chức năng đã được xác định trong quá trình xây dựng dự án. Một số chức năng cần Backend/API để hoạt động đầy đủ; nếu chưa tích hợp Backend, có thể dùng dữ liệu mẫu để phát triển và kiểm thử giao diện.

## 2. Công nghệ và quy ước

- HTML5: cấu trúc trang.
- CSS3: bố cục, responsive và hiệu ứng giao diện.
- JavaScript: tương tác, kiểm tra form, chuyển đổi ngôn ngữ và xử lý trạng thái giao diện.
- Bootstrap hoặc Tailwind CSS: chỉ sử dụng theo lựa chọn thống nhất của dự án; tránh kết hợp tùy tiện gây xung đột style.
- `localStorage` hoặc `IndexedDB`: dùng cho dữ liệu demo và lưu trữ cài đặt người dùng (ví dụ: ngôn ngữ ưa thích) ở phía trình duyệt.
- Backend/API: dùng để xác thực, lưu hồ sơ, quản lý lịch khám, sản phẩm, đơn hàng và tải ảnh thực tế khi được tích hợp.

### Quy ước chung

- Tên file và thư mục dùng chữ thường, ưu tiên dấu gạch ngang.
- Tách CSS và JavaScript theo module khi hợp lý.
- Tái sử dụng component giao diện chung.
- Không lưu `blob:` URL tạo bởi `URL.createObjectURL()` làm đường dẫn ảnh lâu dài.
- Không xem dữ liệu ở phía trình duyệt là cơ chế bảo mật hoặc phân quyền đáng tin cậy.
- Kiểm tra đường dẫn tương đối khi liên kết giữa `frontend/` và `frontend/pages/`.

## 3. Cấu trúc thư mục tham khảo

frontend/
├── index.html
├── base.html
├── components/
│   ├── header.html
│   ├── footer.html
│   ├── sidebar.html
│   └── modal.html
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── about.html
│   ├── services.html
│   ├── service-detail.html
│   ├── pets.html
│   ├── pet-detail.html
│   ├── booking.html
│   ├── products.html
│   ├── product-detail.html
│   ├── cart.html
│   ├── checkout.html
│   ├── order-history.html
│   ├── admin-dashboard.html
│   ├── doctor-dashboard.html
│   └── medical-record.html
└── assets/
├── css/
├── js/
│   └── lang.js
├── images/
└── icons/

Đây là cấu trúc tham khảo dựa trên các trang đã đề cập. Hãy giữ nguyên tên file và cấu trúc thực tế của repository nếu chúng đã khác; không tạo file trùng hoặc di chuyển file khi chưa kiểm tra các liên kết hiện có.

## 4. Phạm vi giao diện

### 4.1. Trang chủ -- `index.html`

- Header có logo PetCareClinic, giỏ hàng, tài khoản, chuyển đổi ngôn ngữ và menu điều hướng.
- Giới thiệu phòng khám, dịch vụ nổi bật, bác sĩ, sản phẩm và thông tin liên hệ.
- Các chỉ số thống kê: `15+` bác sĩ chuyên khoa, `25.000+` thú cưng được khám và chữa khỏi, `100%` thuốc và vaccine chính hãng, `24/7` trực cấp cứu và lưu chuồng.
- Các chỉ số thống kê có thể sử dụng hiệu ứng Count Up khi khu vực đi vào vùng nhìn thấy. Hiệu ứng tăng dần đến đúng giá trị cuối, chỉ chạy một lần mỗi lần tải trang và tôn trọng `prefers-reduced-motion`.
- Các liên kết điều hướng phải mở đúng trang.

### 4.2. Trang Giới thiệu -- `pages/about.html`

- **Bố cục tổng thể:** Thiết kế theo phong cách hiện đại, tinh tế với tông màu xanh ngọc (teal) chủ đạo.
- **Hero Section:** Tiêu đề "Câu Chuyện Về PetCareClinic" nổi bật cùng icon dấu chân thú cưng và đoạn văn ngắn mô tả sứ mệnh chăm sóc sức khỏe toàn diện cho thú cưng.
- **Nội dung chính (Lưới 2 cột xen kẽ):** 
  - Khối hình ảnh được cắt khung tròn/oval độc đáo nằm trên mảng màu nền mềm mại (blob organic shapes) màu xanh nhạt.
  - Phía đối diện kết hợp icon chức năng, tiêu đề và đoạn văn trình bày lần lượt về: Lịch sử phát triển bệnh viện, Trang thiết bị hiện đại (phòng mổ áp lực dương, chẩn đoán hình ảnh), Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm và Lời cam kết cùng phản hồi từ khách hàng.
- **Chỉ số & CTA:** Hiển thị bộ chỉ số thống kê với hiệu ứng Count Up dùng chung và nút kêu gọi đặt lịch khám ngay cuối trang.

### 4.3. Chức năng Đa ngôn ngữ (Tiếng Việt & Tiếng Anh - Mỹ)

- **Vị trí tích hợp:** Nút chuyển đổi ngôn ngữ đặt trên Header (`header.html`) góc phải phía trên, gần khu vực tài khoản và giỏ hàng, tối ưu hiển thị cho cả desktop và mobile.
- **Giao diện bộ chọn:** Dạng nút bấm gọn nhẹ hoặc menu xổ xuống (dropdown) có icon lá cờ tương ứng (🇺🇸 Mỹ cho `English` và 🇻🇳 Việt Nam cho `Tiếng Việt`) kèm mã ngôn ngữ ngắn (`VIE` / `ENG`).
- **Cơ chế hoạt động:** 
  - Tự động cập nhật toàn bộ văn bản trên giao diện (menu, tiêu đề, nhãn form, nút bấm, thông báo lỗi/thành công) bằng chuỗi đa ngôn ngữ (i18n).
  - Trạng thái ngôn ngữ được lưu bền vững vào `localStorage` của trình duyệt để duy trì cài đặt cho các lần truy cập sau.

### 4.4. Khung giao diện và điều hướng
Các thành phần dùng chung có thể gồm:

- `base.html`: khung bố cục tổng thể nếu cách tổ chức dự án hỗ trợ template.
- `header.html`: logo, menu, giỏ hàng, chuyển đổi ngôn ngữ và tài khoản.
- `footer.html`: thông tin liên hệ, liên kết và bản quyền.
- `sidebar.html`: menu cho Admin/Doctor nếu cần.
- `modal.html`: hộp thoại xác nhận và thông báo.
- CSS/JavaScript chung: quy tắc giao diện và hành vi được tái sử dụng.
Menu cần gọn gàng, ưu tiên thanh điều hướng ngang trên desktop và hamburger/menu thu gọn trên màn hình nhỏ. Tránh menu chiếm quá nhiều chiều cao hoặc che nội dung.

Các trang con nên có nút **← Quay lại** ở phía trên nội dung. Ưu tiên `history.back()` khi có trang trước phù hợp; nếu người dùng mở trực tiếp trang, điều hướng về trang mặc định hợp lý, ví dụ:

- Chi tiết dịch vụ → danh sách dịch vụ.
- Chi tiết sản phẩm → cửa hàng.
- Chi tiết thú cưng → danh sách hồ sơ thú cưng.
- Thanh toán → giỏ hàng.
- Chi tiết đơn hàng → lịch sử đơn hàng.
Trang chủ có thể không cần nút quay lại. Với trang quản trị, có thể dùng nút về Dashboard hoặc quay lại danh sách tương ứng.

### 4.5. Đăng nhập và đăng ký
Các trang `login.html` và `register.html` cần có:

- Form nhập thông tin và kiểm tra trường bắt buộc.
- Hiển thị/ẩn mật khẩu.
- Kiểm tra định dạng email và xác nhận mật khẩu.
- Thông báo lỗi, loading, thành công hoặc thất bại.
- Kết nối API xác thực khi Backend sẵn sàng.
- Vai trò Customer, Doctor và Admin phải được xác minh bởi Backend; không chỉ dựa vào JavaScript hoặc việc ẩn nút trên giao diện.

### 4.6. Dịch vụ -- `services.html`, `service-detail.html`
Trang danh sách dịch vụ hiển thị ảnh, tên, mô tả, giá tham khảo và nút xem chi tiết/đặt lịch.

Trang chi tiết dịch vụ hiển thị:

- Tên, ảnh và mô tả dịch vụ.
- Mô tả chuyên môn và lời khuyên nếu có.
- Giá dự kiến.
- Thời gian thực hiện.
- Hình thức khám và thông tin bác sĩ phụ trách.
- Nút đặt lịch dịch vụ và thông tin liên hệ.
**Khung giá dịch vụ:** khung thông tin ở cột bên phải phải nằm đúng trong bố cục trang và cuộn theo nội dung bình thường. Không sử dụng `position: fixed` hoặc `position: sticky` nếu không có yêu cầu rõ ràng. Kiểm tra cả phần tử cha và các quy tắc responsive để tránh khung bị bám vào viewport hoặc chồng lấn. Trên màn hình nhỏ, hai cột cần xếp chồng và không tràn ngang.

### 4.7. Hồ sơ thú cưng -- `pets.html`, `pet-detail.html`
Danh sách hồ sơ cần hỗ trợ xem, tìm kiếm và thao tác thêm/sửa/xóa theo phạm vi hệ thống. Thông tin có thể gồm:

- Tên, loài, giống, giới tính.
- Ngày sinh, cân nặng, màu lông.
- Ảnh đại diện.
- Ghi chú sức khỏe/dị ứng.
- Lịch sử khám hoặc tiêm phòng khi có dữ liệu.

#### Tải ảnh từ máy tính
Thay ô nhập URL ảnh bằng chức năng chọn ảnh:

- Dùng `<input type="file">` với các định dạng PNG, JPG/JPEG và WEBP.
- Giới hạn dung lượng đề xuất: tối đa 5 MB.
- Hỗ trợ chọn ảnh và kéo thả nếu phù hợp.
- Hiển thị ảnh xem trước trong khung, không làm méo ảnh.
- Có thao tác thay ảnh và xóa ảnh.
- Khi sửa hồ sơ, hiển thị ảnh hiện tại nếu có.
- Báo lỗi rõ ràng khi file sai định dạng hoặc vượt dung lượng.
- Giải phóng object URL khi thay ảnh hoặc đóng form.
- Ảnh phải được lưu bền vững bằng cơ chế thực tế của dự án: API tải ảnh, IndexedDB hoặc phương án lưu trữ phù hợp. Không lưu `blob:` URL tạm làm dữ liệu lâu dài.
Chỉ cho người dùng xem và sửa các hồ sơ thuộc quyền truy cập của họ; kiểm tra quyền ở Backend khi tích hợp.

### 4.8. Đặt lịch khám -- `booking.html`
Form đặt lịch có thể chia thành các bước:

1. Chọn hồ sơ thú cưng.
2. Chọn dịch vụ và bác sĩ nếu được phép.
3. Chọn ngày và khung giờ còn trống.
4. Kiểm tra thông tin và xác nhận đặt lịch.
Trường dữ liệu có thể gồm thú cưng, dịch vụ, bác sĩ, ngày/giờ, lý do khám, triệu chứng và ghi chú.

Yêu cầu:

- Không cho chọn ngày trong quá khứ.
- Kiểm tra trường bắt buộc.
- Giờ trống phải dựa trên dữ liệu hệ thống.
- Backend cần kiểm tra lại khả năng đặt lịch để tránh trùng khung giờ.
- Sau khi tạo lịch thành công, hiển thị mã lịch và trạng thái.
- Không báo thành công khi API thất bại.

### 4.9. Cửa hàng -- `products.html`, `product-detail.html`
Trang sản phẩm hiển thị ảnh, tên, giá, danh mục, tồn kho và nút xem chi tiết/thêm vào giỏ.

Các chức năng đề xuất:

- Tìm kiếm theo tên.
- Lọc danh mục hoặc khoảng giá.
- Sắp xếp theo giá.
- Phân trang khi danh sách dài.
- Xem ảnh, mô tả và thông tin chi tiết.
- Chọn số lượng và kiểm tra tồn kho.
Giá và số lượng tồn kho cần được Backend xác minh khi tạo đơn hàng.

### 4.10. Giỏ hàng, thanh toán và đơn hàng
Các trang gồm `cart.html`, `checkout.html`, `order-history.html` và trang chi tiết đơn hàng nếu dự án có.

**Giỏ hàng:**

- Hiển thị sản phẩm, đơn giá, số lượng và thành tiền.
- Tăng/giảm số lượng, xóa sản phẩm.
- Tính tổng tiền hàng, phí vận chuyển, giảm giá và tổng thanh toán nếu có.
- Lưu trạng thái giỏ hàng theo kiến trúc hiện tại.

**Thanh toán:**

- Nhập người nhận, số điện thoại, địa chỉ và ghi chú.
- Chọn phương thức thanh toán được hỗ trợ.
- Kiểm tra dữ liệu và giỏ hàng.
- Hiển thị trạng thái đang xử lý, thành công hoặc thất bại.
- Chống gửi đơn lặp khi nhấn nút nhiều lần.
- Chỉ hiển thị mã đơn sau khi Backend xác nhận tạo đơn thành công.

**Lịch sử đơn hàng:**

- Hiển thị mã đơn, ngày đặt, tổng tiền, trạng thái thanh toán và giao hàng.
- Cho phép xem chi tiết và lọc theo trạng thái nếu được hỗ trợ.
Nếu chưa có Backend, dữ liệu demo ở trình duyệt chỉ phục vụ phát triển; không dùng để mô phỏng giao dịch thật hoặc đảm bảo tính toàn vẹn đơn hàng.

### 4.11. Admin Dashboard và Doctor Dashboard
**Admin Dashboard** (`pages/admin-dashboard.html`) dùng một trang duy nhất. Sidebar cuộn mượt tới các section tổng quan, lịch khám, đơn hàng, thú cưng, sản phẩm và dịch vụ. Quản lý thú cưng dùng chung hồ sơ và luồng ảnh IndexedDB; danh sách có lọc loài/tìm kiếm, thêm, sửa và xóa. Quản lý sản phẩm hỗ trợ thêm, xóa có xác nhận và bật/tắt tồn kho; quản lý dịch vụ hỗ trợ thêm và xóa có xác nhận. Các danh mục dùng chung khóa localStorage với phần cửa hàng/dịch vụ của khách hàng.

Frontend hiện lưu dữ liệu quản trị trong trình duyệt để phục vụ bản demo. Kiểm tra quyền và lưu trữ an toàn cần được thực hiện ở Backend trước khi dùng thực tế.

**Doctor Dashboard** có thể hiển thị lịch khám hôm nay, lịch sắp tới, thông tin thú cưng/khách hàng, trạng thái lượt khám và liên kết đến hồ sơ bệnh án.

Các chức năng cập nhật lịch khám và bệnh án cần được kiểm soát quyền truy cập, lưu dữ liệu qua Backend và hiển thị thông báo khi thao tác thành công/thất bại.

### 4.12. UI components
Các thành phần nên tái sử dụng:

- Form và trường nhập liệu.
- Button với trạng thái mặc định, hover, disabled và loading.
- Modal xác nhận.
- Table có tìm kiếm, lọc, sắp xếp và phân trang khi cần.
- Badge trạng thái.
- Thông báo lỗi/thành công.
- Trạng thái rỗng và loading.
- Nút quay lại dùng chung.
- Bộ chọn ngôn ngữ (Language Switcher).
- Header, footer và sidebar.

## 5. Responsive và trải nghiệm người dùng

- Desktop: bố cục tận dụng chiều rộng, menu gọn, các cột hiển thị hợp lý.
- Tablet: giảm khoảng cách và điều chỉnh số cột.
- Mobile: menu thu gọn, form xếp dọc, nút dễ bấm và không tràn ngang.
- Ảnh cần có kích thước phù hợp, dùng `object-fit` khi cần.
- Có trạng thái focus dễ nhìn để hỗ trợ thao tác bằng bàn phím.
- Không để modal hoặc menu che khuất nội dung theo cách gây khó thao tác.
- Tôn trọng cài đặt `prefers-reduced-motion` cho các hiệu ứng chuyển động.

## 6. Tài liệu báo cáo
Có thể chuẩn bị mẫu báo cáo Word với các mục:

1. Trang bìa và thông tin thành viên.
2. Giới thiệu đề tài và mục tiêu.
3. Phạm vi và phân công công việc.
4. Công nghệ sử dụng.
5. Thiết kế kiến trúc và dữ liệu.
6. Wireframe và ảnh chụp giao diện.
7. Mô tả chức năng từng module.
8. Kết quả kiểm thử.
9. Hạn chế và hướng phát triển.
10. Tài liệu tham khảo và phụ lục.

## 7. Checklist kiểm thử

- Menu hiển thị gọn trên desktop và mobile.
- Các liên kết điều hướng đúng.
- Chuyển đổi ngôn ngữ Tiếng Việt / Tiếng Anh hoạt động chuẩn xác và giữ nguyên cài đặt khi chuyển trang.
- Nút quay lại có hành vi hợp lý khi mở trang trực tiếp.
- Form đăng nhập/đăng ký kiểm tra dữ liệu.
- Trang giới thiệu (`about.html`) hiển thị đúng bố cục xen kẽ, hình ảnh cắt khung tròn/oval đẹp mắt và responsive tốt.
- Danh sách và chi tiết dịch vụ hiển thị đúng.
- Khung giá dịch vụ không bị ghim hoặc trôi sai khi cuộn.
- Hiệu ứng số thống kê chạy đến đúng giá trị và không chạy lặp liên tục.
- Thêm/sửa/xóa hồ sơ thú cưng hoạt động theo thiết kế.
- Tải ảnh có kiểm tra định dạng và dung lượng.
- Ảnh đã lưu vẫn hiển thị sau khi tải lại trang.
- Đặt lịch kiểm tra dữ liệu và trạng thái API.
- Sản phẩm, giỏ hàng và tổng tiền hiển thị chính xác.
- Checkout không tạo đơn trùng do nhấn nhiều lần.
- Admin/Doctor chỉ truy cập chức năng được cấp quyền.
- Không có lỗi JavaScript hoặc đường dẫn tài nguyên.
- Báo cáo Word có cấu trúc thống nhất.

## 8. Thứ tự triển khai đề xuất

1. Kiểm tra cấu trúc dự án và thống nhất design system.
2. Hoàn thiện header (tích hợp chọn ngôn ngữ), menu, footer, layout và nút quay lại.
3. Cấu hình module đa ngôn ngữ (i18n) lưu trữ bằng `localStorage`.
4. Hoàn thiện Login/Register và các component dùng chung.
5. Xây dựng trang chủ, trang giới thiệu (`pages/about.html`) và dịch vụ.
6. Hoàn thiện hồ sơ thú cưng và tải ảnh.
7. Xây dựng đặt lịch và Doctor Portal.
8. Xây dựng cửa hàng, giỏ hàng và checkout.
9. Hoàn thiện Admin Dashboard.
10. Kiểm thử responsive, chuyển đổi ngôn ngữ, trạng thái lỗi và tích hợp API.
11. Cập nhật tài liệu và báo cáo.

---
**Ghi chú:** Tài liệu này là đặc tả Frontend dựa trên phạm vi đã trao đổi. Trước khi triển khai, hãy đối chiếu với các file thực tế trong repository, giữ nguyên chức năng đang chạy và cập nhật README nếu tên file, framework hoặc API thực tế khác với mô tả.