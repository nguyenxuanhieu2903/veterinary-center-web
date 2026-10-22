/**
 * Lightweight Vietnamese/English localization for the PetCareClinic frontend.
 */

(() => {
  const STORAGE_KEY = 'petcare_language';
  const translations = {
    'PetCare Clinic - Hệ Thống Bệnh Viện Thú Y & Chăm Sóc Thú Cưng 24/7': 'PetCare Clinic - Veterinary Hospital & Pet Care 24/7',
    'Dịch vụ Y tế Thú Y - PetCare Clinic': 'Veterinary Services - PetCare Clinic',
    'Chi tiết dịch vụ - PetCare Clinic': 'Service Details - PetCare Clinic',
    'Giới thiệu PetCareClinic - Câu chuyện chăm sóc thú cưng': 'About PetCareClinic - Our Story',
    'Chi tiết Hồ sơ Thú cưng - PetCare Clinic': 'Pet Profile Details - PetCare Clinic',
    'Quản lý Hồ sơ Thú cưng - PetCare Clinic': 'Pet Profile Management - PetCare Clinic',
    'Cửa Hàng Thú Cưng - PetCare Clinic': 'Pet Shop - PetCare Clinic',
    'Chi tiết sản phẩm - PetCare Clinic': 'Product Details - PetCare Clinic',
    'Đặt Lịch Khám Thú Y Trực Tuyến - PetCare Clinic': 'Book a Veterinary Appointment - PetCare Clinic',
    'Giỏ Hàng Của Bạn - PetCare Clinic': 'Your Shopping Cart - PetCare Clinic',
    'Thanh Toán Đơn Hàng - PetCare Clinic': 'Checkout - PetCare Clinic',
    'Lịch Sử Đơn Hàng - PetCare Clinic': 'Order History - PetCare Clinic',
    'Đăng nhập tài khoản - PetCare Clinic': 'Sign In - PetCare Clinic',
    'Đăng ký tài khoản - PetCare Clinic': 'Create an Account - PetCare Clinic',
    'Quản trị Dashboard - PetCare Clinic': 'Admin Dashboard - PetCare Clinic',
    'Bảng Quản Trị Hệ Thống - PetCare Admin': 'System Administration - PetCare Admin',
    'Bác sĩ Dashboard - PetCare Clinic': 'Doctor Dashboard - PetCare Clinic',
    'Bàn Làm Việc Bác Sĩ - PetCare Doctor': 'Doctor Dashboard - PetCare Doctor',
    'Hồ sơ Bệnh án - PetCare Clinic': 'Medical Record - PetCare Clinic',
    'Hồ Sơ Bệnh Án Điện Tử - PetCare Clinic': 'Digital Medical Record - PetCare Clinic',
    'PetCare Clinic': 'PetCare Clinic',
    'PetCareClinic': 'PetCareClinic',
    'PetCare': 'PetCare',
    'Clinic': 'Clinic',
    'BÁC SĨ THÚ Y 24/7': 'VETERINARY CARE 24/7',
    'Trang chủ': 'Home',
    'Giới thiệu': 'About',
    'Giới thiệu PetCareClinic': 'About PetCareClinic',
    'Dịch vụ y tế': 'Veterinary Services',
    'Dịch vụ thú y': 'Veterinary Services',
    'Cửa hàng Pet': 'Pet Shop',
    'Sản phẩm chăm sóc': 'Pet Supplies',
    'Đặt lịch khám': 'Book an Appointment',
    'Đặt lịch khám bệnh': 'Book an Appointment',
    'Đặt lịch': 'Book an Appointment',
    'Hồ sơ thú cưng': 'Pet Profiles',
    'Quay lại': 'Back',
    '← Quay lại': '← Back',
    'Đăng nhập': 'Sign In',
    'Đăng ký': 'Sign Up',
    'Đăng ký miễn phí': 'Sign Up Free',
    'Đăng xuất': 'Sign Out',
    'Giỏ hàng của bạn': 'Your cart',
    'CHUYỂN VAI TRÒ DEMO:': 'SWITCH DEMO ROLE:',
    'Khách hàng': 'Customer',
    'Bác sĩ': 'Doctor',
    'Bác sĩ thú y': 'Veterinarian',
    'Quản trị viên': 'Administrator',
    'Thú cưng của tôi': 'My Pets',
    'Đặt lịch khám mới': 'Book an Appointment',
    'Lịch sử đơn hàng': 'Order History',
    'Bàn làm việc Bác sĩ': 'Doctor Dashboard',
    'Hồ sơ bệnh án': 'Medical Records',
    'Bảng quản trị Admin': 'Admin Dashboard',

    '🏥 TIÊU CHUẨN Y KHOA QUỐC TẾ': '🏥 INTERNATIONAL VETERINARY STANDARDS',
    'Bệnh viện & Phòng khám Thú y Đẳng cấp Toàn diện': 'Comprehensive Veterinary Hospital & Clinic',
    'Đội ngũ Thạc sĩ, Bác sĩ thú y hơn 10 năm kinh nghiệm cùng hệ thống trang thiết bị chẩn đoán hình ảnh, phòng mổ áp lực dương hiện đại bậc nhất. Sẵn sàng phục vụ và cấp cứu 24/7.': 'Our experienced veterinary team and advanced diagnostic equipment and positive-pressure operating room provide comprehensive care. We are ready to help 24/7.',
    '📅 Đặt lịch khám ngay': '📅 Book an Appointment',
    '🩺 Xem tất cả dịch vụ': '🩺 Explore All Services',
    'Cấp cứu khẩn 24/7': 'Emergency Care 24/7',
    'Hotline trực:': 'Emergency hotline:',
    '4.9 / 5.0 Điểm': '4.9 / 5.0 Rating',
    'Hơn 12.000 lượt hài lòng': 'Over 12,000 happy visits',
    'Bác sĩ chuyên khoa đầu ngành': 'Specialist veterinarians',
    'Thú cưng được khám & chữa khỏi': 'Pets treated and cared for',
    'Thuốc & Vaccine chính hãng': 'Authentic medicine & vaccines',
    'Trực cấp cứu & Lưu chuồng': 'Emergency & inpatient care',
    'DỊCH VỤ TRỌNG TÂM': 'OUR SERVICES',
    'Chăm sóc toàn diện cho bé yêu': 'Complete care for your beloved pet',
    'Từ khám bệnh tổng quát, tiêm vaccine đến phẫu thuật ngoại khoa và spa tạo kiểu chuyên nghiệp.': 'From wellness exams and vaccinations to surgery and professional grooming.',
    'Xem toàn bộ danh mục dịch vụ →': 'Explore all services →',
    'ĐỘI NGŨ CHUYÊN GIA': 'OUR VETERINARY TEAM',
    'Bác sĩ thú y tận tụy & giàu kinh nghiệm': 'Experienced and compassionate veterinarians',
    'Các bác sĩ đều tốt nghiệp chính quy, được đào tạo chuyên sâu và luôn coi thú cưng như thành viên trong gia đình.': 'Our qualified, specially trained veterinarians treat every pet like a member of the family.',
    'CỬA HÀNG PETCARE': 'PETCARE SHOP',
    'Sản phẩm dinh dưỡng & Y tế chính hãng': 'Trusted nutrition and healthcare products',
    'Tuyển chọn các dòng thức ăn hạt, pate dinh dưỡng, thuốc trị ve rận và phụ kiện chăm sóc thú cưng uy tín.': 'A trusted selection of dry food, nutritious wet food, parasite treatments, and pet accessories.',
    'Ghé thăm Cửa hàng sản phẩm →': 'Visit the Pet Shop →',
    'QUY TRÌNH Y KHOA': 'OUR VETERINARY PROCESS',
    'Quy trình khám bệnh 4 bước chuẩn hóa': 'A standardized four-step care process',
    'Đảm bảo thú cưng luôn cảm thấy thư giãn, không sợ hãi và nhận được kết quả chẩn đoán chính xác nhất.': 'We help pets feel comfortable and safe while providing accurate diagnoses.',
    'Đặt hẹn trực tuyến': 'Book Online',
    'Chủ nuôi chủ động chọn ngày, giờ và bác sĩ mong muốn, không mất công chờ đợi xếp hàng.': 'Choose your preferred date, time, and veterinarian without waiting in line.',
    'Khám sàng lọc kĩ lưỡng': 'Thorough Examination',
    'Đo cân nặng, thân nhiệt, nghe tim phổi và kiểm tra toàn diện các cơ quan của thú cưng.': 'We check weight, temperature, heart and lungs, and your pet’s overall health.',
    'Chẩn đoán & Phác đồ': 'Diagnosis & Care Plan',
    'Bác sĩ tư vấn minh bạch phác đồ điều trị, giải thích rõ công dụng từng loại thuốc hoặc xét nghiệm.': 'Our veterinarians explain the treatment plan and the purpose of every medicine or test.',
    'Theo dõi điện tử': 'Digital Follow-up',
    'Toàn bộ hồ sơ bệnh án được lưu vào hệ thống, tự động gửi tin nhắn nhắc lịch tái khám và tiêm ngừa.': 'Medical records are stored securely, with reminders for follow-up visits and vaccinations.',
    'ĐÁNH GIÁ TỪ CHỦ NUÔI': 'PET PARENT REVIEWS',
    'Khách hàng nói gì về PetCare?': 'What pet parents say about PetCare',
    'Sự hài lòng và sức khỏe của các bé là niềm hạnh phúc lớn nhất của chúng tôi.': 'Your pet’s health and your peace of mind mean everything to us.',
    '"Bé Miu nhà mình bị sốt bỏ ăn 2 ngày, đưa đến PetCare được Bác sĩ An khám và xét nghiệm máu rất nhanh. Bác sĩ giải thích nhẹ nhàng, kê thuốc uống 2 hôm là bé lại chạy nhảy bình thường."': '"My cat Miu had a fever and stopped eating. Dr. An examined her and ran blood tests quickly, explained everything clearly, and she was back to normal after two days of medication."',
    'Chị Hoàng Lan': 'Hoang Lan',
    'Nuôi mèo Anh lông ngắn': 'Owner of a British Shorthair',
    '"Dịch vụ đặt lịch online quá tiện lợi! Mình đặt hẹn lúc 10h30 đến là được vào phòng khám ngay. Phòng khám cực kỳ sạch sẽ, không có mùi hôi như các chỗ khác, bác sĩ rất yêu động vật."': '"Online booking is so convenient! We were seen right away at our 10:30 appointment. The clinic is spotless, and the veterinarians truly love animals."',
    'Anh Trần Minh Tuấn': 'Tran Minh Tuan',
    'Nuôi cún Corgi': 'Owner of a Corgi',
    '"Dịch vụ Spa & Grooming ở đây đỉnh thật sự. Bé cún Poodle nhà mình cắt tỉa xong như thú bông vậy. Nhân viên tắm gội rất cẩn thận, bé không bị hoảng sợ chút nào. Chắc chắn sẽ quay lại định kỳ!"': '"The spa and grooming service is wonderful. My Poodle looked like a plush toy after the trim, and the staff were so gentle. We will definitely be back!"',
    'Bạn Đỗ Thùy Linh': 'Do Thuy Linh',
    'Nuôi Poodle 3 tuổi': 'Owner of a 3-year-old Poodle',
    'Thú cưng gặp tình huống khẩn cấp?': 'Is your pet having an emergency?',
    'Đội ngũ cấp cứu và xe chuyên dụng của PetCare Clinic luôn thường trực 24/7 kể cả ngày lễ tết để kịp thời hỗ trợ bé yêu của bạn.': 'Our emergency team and dedicated response vehicle are on call 24/7, including holidays.',
    '📞 Gọi cấp cứu ngay: 1900 6868': '📞 Call Emergency Services: 1900 6868',
    '📅 Đặt lịch khám thường': '📅 Book a Routine Visit',
    'Hệ thống phòng khám và bệnh viện thú y uy tín hàng đầu. Cam kết mang đến sự chăm sóc ân cần, trang thiết bị y khoa hiện đại và phác đồ điều trị an toàn cho thú cưng của bạn.': 'A trusted network of veterinary clinics, providing compassionate care, modern medical equipment, and safe treatment plans for your pet.',
    'Cấp cứu 24/7': 'Emergency Care 24/7',
    'Tiêu chuẩn Quốc tế': 'International Standards',
    'Liên kết nhanh': 'Quick Links',
    'Liên hệ hỗ trợ': 'Contact Us',
    'Số 18 Hoàng Diệu, Ba Đình, Hà Nội': '18 Hoang Dieu Street, Ba Dinh, Hanoi',
    '• Số 18 Hoàng Diệu, Ba Đình, Hà Nội': '• 18 Hoang Dieu Street, Ba Dinh, Hanoi',
    'Hotline 24/7:': '24/7 Hotline:',
    'Mở cửa: 08:00 - 21:00 (Cấp cứu trực 24/7)': 'Open: 08:00–21:00 (Emergency care 24/7)',
    'Chính sách bảo mật': 'Privacy Policy',
    'Điều khoản dịch vụ': 'Terms of Service',
    'và': 'and',
    'Quy trình cấp cứu': 'Emergency Procedures',
    'Chọn ngôn ngữ': 'Select language',
    'Giữ toàn quyền.': 'All rights reserved.',
    '© 2026 PetCare Clinic. Giữ toàn quyền.': '© 2026 PetCare Clinic. All rights reserved.',
    '🐱 Mèo': '🐱 Cat',
    '🐶 Chó': '🐶 Dog',
    '👤 Khách hàng': '👤 Customer',
    '👨‍⚕️ Bác sĩ thú y': '👨‍⚕️ Veterinarian',
    '🛡️ Quản trị viên': '🛡️ Administrator',
    '🚪 Đăng xuất': '🚪 Sign Out',
    '🐾 Thú cưng của tôi': '🐾 My Pets',
    '📅 Đặt lịch khám mới': '📅 Book an Appointment',
    '📦 Lịch sử đơn hàng': '📦 Order History',
    'CHUYỂN VAI TRÒ DEMO:': 'SWITCH DEMO ROLE:',
    'Bác sĩ ân cần chăm sóc một chú chó tại PetCareClinic': 'A veterinarian gently caring for a dog at PetCareClinic',
    'Bác sĩ thú y đang khám cho thú cưng': 'A veterinarian examining a pet',
    'Thiết bị chẩn đoán hình ảnh tại phòng khám': 'Diagnostic imaging equipment at the clinic',
    'Bác sĩ chuyên khoa tận tâm với thú cưng': 'A specialist veterinarian caring for a pet',
    'Chủ nuôi vui vẻ bên thú cưng khỏe mạnh': 'A happy pet parent with a healthy pet',

    'Yêu thương trong từng bước chăm sóc': 'Compassion in every step of care',
    'Câu Chuyện Về': 'The Story of',
    'Chúng tôi tin mỗi thú cưng đều xứng đáng được sống khỏe mạnh và hạnh phúc. PetCareClinic kết hợp chuyên môn thú y, công nghệ hiện đại và sự tận tâm để đồng hành cùng bạn trong hành trình chăm sóc bé yêu.': 'Every pet deserves a healthy, happy life. PetCareClinic combines veterinary expertise, modern technology, and compassion to support you throughout your pet’s care journey.',
    'Chăm sóc bằng': 'Care through',
    'chuyên môn & yêu thương': 'expertise and compassion',
    'HÀNH TRÌNH CỦA CHÚNG TÔI': 'OUR JOURNEY',
    'Chăm sóc hôm nay, vun đắp những năm tháng khỏe mạnh': 'Caring today for healthier years ahead',
    'Từ những ngày đầu tiên, sứ mệnh của chúng tôi luôn là mang dịch vụ thú y chất lượng đến gần hơn với mọi gia đình.': 'From day one, our mission has been to make quality veterinary care accessible to every family.',
    'Khởi đầu từ sự tận tâm': 'Care at our foundation',
    'CÂU CHUYỆN CỦA CHÚNG TÔI': 'OUR STORY',
    'Lớn lên cùng niềm tin của mỗi gia đình': 'Growing with the trust of every family',
    'PetCareClinic bắt đầu với mong muốn tạo nên một nơi mà thú cưng được đón nhận như thành viên trong gia đình. Qua từng ca thăm khám và từng lời tư vấn, chúng tôi không ngừng hoàn thiện dịch vụ để trở thành người bạn đồng hành đáng tin cậy của các chủ nuôi.': 'PetCareClinic began with a simple wish: to create a place where pets are welcomed as family. Every visit and every conversation helps us improve and become a trusted partner to pet parents.',
    'Hôm nay, đội ngũ của chúng tôi tiếp tục gìn giữ giá trị ấy: lắng nghe kỹ lưỡng, giải thích rõ ràng và đặt sức khỏe của bé lên hàng đầu.': 'Today, our team continues that tradition: listening carefully, explaining clearly, and putting your pet’s health first.',
    'Công nghệ hỗ trợ chẩn đoán': 'Technology for better diagnoses',
    'TRANG THIẾT BỊ HIỆN ĐẠI': 'MODERN EQUIPMENT',
    'Công nghệ tốt, quyết định chăm sóc chính xác': 'The right technology supports better care',
    'Phòng khám được trang bị hệ thống chẩn đoán hình ảnh và xét nghiệm hỗ trợ bác sĩ đánh giá sức khỏe toàn diện, phát hiện sớm bất thường và đưa ra hướng điều trị phù hợp.': 'Our imaging and laboratory equipment help veterinarians assess overall health, detect concerns early, and recommend appropriate treatment.',
    'Khu vực phẫu thuật được chuẩn bị theo quy trình kiểm soát nhiễm khuẩn nghiêm ngặt, với hệ thống phòng mổ áp lực dương và thiết bị theo dõi cần thiết để chăm sóc bé an toàn trong suốt quá trình.': 'Our surgical suite follows strict infection-control procedures and uses a positive-pressure operating room and monitoring equipment to support your pet’s safety.',
    'Vững chuyên môn, trọn yêu thương': 'Expert care, delivered with compassion',
    'ĐỘI NGŨ CHUYÊN KHOA': 'VETERINARY SPECIALISTS',
    'Bác sĩ giàu kinh nghiệm, luôn lắng nghe': 'Experienced veterinarians who listen',
    'Đội ngũ bác sĩ thú y có kinh nghiệm trong khám tổng quát, nội khoa, ngoại khoa, tiêm chủng và chăm sóc dự phòng. Mỗi kế hoạch điều trị đều được cân nhắc dựa trên tình trạng riêng của từng bé.': 'Our veterinarians have experience in wellness exams, internal medicine, surgery, vaccination, and preventive care. Every treatment plan is tailored to your pet.',
    'Chúng tôi dành thời gian trao đổi cùng chủ nuôi để bạn hiểu rõ tình trạng sức khỏe, lựa chọn điều trị và cách chăm sóc bé tại nhà.': 'We take time to help you understand your pet’s health, treatment options, and home-care needs.',
    'Niềm vui của bé là động lực của chúng tôi': 'Your pet’s happiness inspires us',
    'CAM KẾT CỦA PETCARECLINIC': 'OUR PROMISE',
    'Niềm tin được xây dựng từ những điều tử tế': 'Trust is built through thoughtful care',
    'Chúng tôi cam kết tư vấn minh bạch, sử dụng thuốc và vaccine có nguồn gốc rõ ràng, đồng thời chăm sóc mỗi thú cưng bằng sự nhẹ nhàng và tôn trọng.': 'We provide clear guidance, use medicines and vaccines from trusted sources, and treat every pet with gentleness and respect.',
    '“Bác sĩ giải thích rất tận tình, bé nhà mình được chăm sóc chu đáo và khỏe lại nhanh. Mình an tâm mỗi lần đưa bé đến khám.”': '"The veterinarian explained everything so clearly. My pet received wonderful care and recovered quickly. I feel at ease every time we visit."',
    '— Một gia đình đồng hành cùng PetCareClinic': '— A family who trusts PetCareClinic',
    'PETCARECLINIC QUA NHỮNG CON SỐ': 'PETCARECLINIC BY THE NUMBERS',
    'Chuyên môn vững vàng, luôn sẵn sàng đồng hành': 'Expert care, whenever you need us',
    'Hãy để chúng tôi chăm sóc bé yêu của bạn': 'Let us care for your beloved pet',
    'Đặt lịch ngay để đội ngũ PetCareClinic đồng hành cùng bạn trên hành trình khỏe mạnh của thú cưng.': 'Book a visit and let the PetCareClinic team support your pet’s health journey.',

    'Quản lý hồ sơ tiêm chủng, lịch sử khám và đặt lịch nhanh cho các bé yêu của bạn.': 'Manage vaccination records, visit history, and appointments for your pets.',
    '➕ Thêm thú cưng mới': '➕ Add a Pet',
    'Danh Sách Thú Cưng': 'My Pets',
    'Tất cả loài': 'All pets',
    '🐱 Mèo cưng': '🐱 Cats',
    '🐶 Chó cưng': '🐶 Dogs',
    'Tìm kiếm theo tên hoặc giống...': 'Search by name or breed...',
    'Chưa có hồ sơ thú cưng nào': 'No pet profiles yet',
    'Hãy tạo hồ sơ cho bé yêu của bạn để quản lý sức khỏe và đặt lịch khám dễ dàng.': 'Create a profile to manage your pet’s health and book visits easily.',
    '📋 Xem hồ sơ y tế': '📋 View Medical Record',
    '✓ Đã tiêm chủng': '✓ Vaccinated',
    'Chưa tiêm phòng': 'Not vaccinated',
    'Giới tính:': 'Gender:',
    'Tuổi:': 'Age:',
    'Cân nặng:': 'Weight:',
    'Màu lông:': 'Coat:',
    'Ghi chú:': 'Notes:',
    'Chủ:': 'Owner:',
    'Không có ghi chú đặc biệt.': 'No special notes.',
    'Vui lòng nhập tên và giống của thú cưng!': 'Please enter your pet’s name and breed!',
    'Vui lòng chọn thú cưng để tiếp tục!': 'Please choose a pet to continue!',
    'Vui lòng chọn dịch vụ thăm khám!': 'Please choose a veterinary service!',
    'Vui lòng chọn ngày và khung giờ khám!': 'Please choose an appointment date and time!',
    'Vui lòng nhập Họ tên và Số điện thoại liên hệ!': 'Please enter your name and contact phone number!',
    'Khung giờ này vừa có người đặt trước, vui lòng chọn giờ khác!': 'This time slot was just booked. Please choose another time!',
    'Đã làm trống giỏ hàng': 'Your cart has been cleared.',
    'Giỏ hàng trống!': 'Your cart is empty!',
    'Đã lưu hồ sơ bệnh án và cập nhật ca khám hoàn tất!': 'Medical record saved and visit marked complete!',
    'Đã thêm mới hồ sơ bé': 'Pet profile added successfully.',
    'Không thể xóa hồ sơ thú cưng': 'Unable to delete the pet profile.',
    'Đã lưu hồ sơ nhưng không thể dọn ảnh cũ khỏi bộ nhớ.': 'Profile saved, but the old photo could not be removed from storage.',
    'File không hợp lệ. Vui lòng chọn ảnh PNG, JPG, JPEG hoặc WEBP.': 'Invalid file. Please choose a PNG, JPG, JPEG, or WEBP image.',
    'Ảnh phải có dung lượng tối đa 5MB.': 'The image must be no larger than 5 MB.',
    'Ảnh không hợp lệ hoặc đã vượt quá 5MB.': 'The image is invalid or exceeds 5 MB.',
    'Vui lòng chọn ảnh PNG, JPG, JPEG hoặc WEBP.': 'Please choose a PNG, JPG, JPEG, or WEBP image.',
    'Định dạng ảnh không hợp lệ. Vui lòng chọn PNG, JPG, JPEG hoặc WEBP.': 'Invalid image format. Please choose PNG, JPG, JPEG, or WEBP.',
    'Ảnh vượt quá dung lượng tối đa 5MB. Vui lòng chọn ảnh nhỏ hơn.': 'The image exceeds the 5 MB limit. Please choose a smaller image.',
    'Thanh toán thành công!': 'Payment successful!',
    'Áp dụng thành công mã VIP': 'VIP code applied successfully',
    'Đã làm trống giỏ hàng.': 'Your cart has been cleared.',
    'Không tìm thấy thú cưng.': 'Pet not found.',
    'Không có dữ liệu lịch sử khám.': 'No visit history found.',
    'Không có lịch sử đơn hàng nào.': 'No order history found.',
    'Không có sản phẩm nào phù hợp.': 'No matching products found.',
    'Không tìm thấy dịch vụ phù hợp.': 'No matching services found.',
    'Giỏ hàng của bạn đang trống! Đang quay lại cửa hàng...': 'Your cart is empty! Returning to the shop...',
    'Nhập tên thuốc / vật tư y tế:': 'Enter medication / medical supply name:',
    'Nhập liều lượng & cách dùng (VD: 1 viên/lần x 2 lần/ngày):': 'Enter dosage and instructions (e.g. 1 tablet per dose, twice daily):',
    'Số ngày dùng thuốc (VD: 5 ngày):': 'Number of treatment days (e.g. 5 days):',
    'Vui lòng nhập đầy đủ thông tin.': 'Please complete all required information.',
    'Mật khẩu xác nhận không khớp!': 'The passwords do not match!',
    'Email này đã được đăng ký!': 'This email is already registered!',
    'Đăng nhập thành công!': 'Signed in successfully!',
    'Đăng ký tài khoản thành công!': 'Account created successfully!',
    'Sai email hoặc mật khẩu!': 'Incorrect email or password!',
    'Đã áp dụng mã giảm giá!': 'Discount code applied!',
    'Mã giảm giá không hợp lệ!': 'Invalid discount code!',
    'Đặt lịch khám thành công!': 'Appointment booked successfully!',
    'Đã thêm sản phẩm vào giỏ hàng!': 'Product added to your cart!',
    'Đã đăng xuất tài khoản thành công': 'Signed out successfully.',
    'Sản phẩm không tồn tại!': 'Product not found!',
    'Đã xóa sản phẩm khỏi giỏ hàng': 'Item removed from your cart.',
    'Vui lòng nhập mã giảm giá!': 'Please enter a discount code!',
    'Mã giảm giá không hợp lệ hoặc đã hết hạn (Thử: PETCARE10)': 'Invalid or expired discount code (try: PETCARE10).',
    'Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ nhận hàng!': 'Please enter your name, phone number, and delivery address!',
    'Vui lòng nhập chẩn đoán và phác đồ điều trị!': 'Please enter a diagnosis and treatment plan!',
    'Bạn chưa đăng nhập!': 'You are not signed in!',
    'Phiên đăng nhập đã hết hạn!': 'Your session has expired!',
    'Đã lưu thay đổi thành công!': 'Changes saved successfully!',
    'Hủy': 'Cancel',
    'Đồng ý': 'Confirm',
    'Xác nhận thao tác': 'Confirm Action',
    'Xác nhận': 'Confirm',
    'Nội dung xác nhận': 'Confirmation details',
    'Xác nhận hủy': 'Confirm Cancellation',
    'Xác nhận xóa': 'Confirm Delete',
    'Xóa bỏ': 'Delete',
    'Xóa hết': 'Clear All',
    'Giữ lại': 'Keep',
    'Xóa vĩnh viễn lịch khám': 'Permanently Delete Appointment',
    'Xóa toàn bộ giỏ hàng': 'Clear the Entire Cart',
    'Bạn có chắc chắn muốn hủy lịch hẹn': 'Are you sure you want to cancel appointment',
    'Khách hàng sẽ nhận được thông báo qua SMS/Email.': 'The customer will be notified by SMS/email.',
    'Bạn có chắc chắn muốn xóa dữ liệu lịch': 'Are you sure you want to delete appointment data',
    'khỏi cơ sở dữ liệu?': 'from the database?',
    'Bạn có chắc muốn xóa tất cả sản phẩm đang có trong giỏ?': 'Are you sure you want to remove all items from your cart?',
    'Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ của bé': 'Are you sure you want to permanently delete the profile for',
    'Dữ liệu lịch sử khám của bé sẽ không thể khôi phục.': 'Your pet’s visit history cannot be recovered.',
    '? Dữ liệu lịch sử khám của bé sẽ không thể khôi phục.': '? Your pet’s visit history cannot be recovered.',
    'Đang xử lý...': 'Processing...',
    '⚠️ Xóa hồ sơ thú cưng': '⚠️ Delete Pet Profile',
    '⚠️ Hủy lịch khám': '⚠️ Cancel Appointment',
    '⚠️ Xóa vĩnh viễn lịch khám': '⚠️ Permanently Delete Appointment',
    '❓ Xác nhận thao tác': '❓ Confirm Action',
    'Thêm hồ sơ thú cưng': 'Add Pet Profile',
    'Thêm hồ sơ thú cưng mới': 'Add a New Pet Profile',
    'Tên thú cưng': 'Pet Name',
    'VD: Miu Miu, Cún Bơ...': 'e.g. Miu Miu, Bơ...',
    'Loài': 'Species',
    'Mèo': 'Cat',
    'Chó': 'Dog',
    'Loài khác': 'Other',
    'Giống loài': 'Breed',
    'Giới tính': 'Gender',
    'Đực': 'Male',
    'Cái': 'Female',
    'Ngày sinh': 'Date of Birth',
    'Cân nặng (kg)': 'Weight (kg)',
    'Màu lông': 'Coat Color',
    'Ảnh đại diện thú cưng': 'Pet Photo',
    'Kéo thả ảnh vào đây hoặc nhấn nút bên dưới để chọn': 'Drop an image here or use the button below to choose one',
    'Thay ảnh': 'Change Photo',
    'Xóa ảnh': 'Remove Photo',
    '📷 Chọn ảnh từ máy tính': '📷 Choose a Photo',
    'PNG, JPG, JPEG hoặc WEBP, tối đa 5MB': 'PNG, JPG, JPEG, or WEBP, up to 5 MB',
    'Ghi chú sức khỏe / Dị ứng': 'Health Notes / Allergies',
    'Hủy bỏ': 'Cancel',
    'Lưu hồ sơ thú cưng': 'Save Pet Profile',
    'Chỉnh sửa thông tin': 'Edit details',
    'Xóa hồ sơ thú cưng': 'Delete Pet Profile',

    'Dịch vụ Y tế & Chăm Sóc Thú Cưng': 'Veterinary & Pet Care Services',
    'CHUYÊN MÔN CAO - TRANG THIẾT BỊ HIỆN ĐẠI': 'EXPERT CARE - MODERN EQUIPMENT',
    'Cam kết đem đến quy trình y khoa chuẩn mực, chẩn đoán chính xác và sự chăm sóc yêu thương nhất cho bé cưng của bạn.': 'We provide trusted medical procedures, accurate diagnoses, and compassionate care for your pet.',
    'Tất cả dịch vụ': 'All Services',
    'Khám tổng quát': 'Wellness Exam',
    'Tiêm phòng Vaccine': 'Vaccination',
    'Xét nghiệm & Siêu âm': 'Lab Tests & Ultrasound',
    'Xét nghiệm máu & Siêu âm': 'Blood Tests & Ultrasound',
    'Spa & Grooming': 'Spa & Grooming',
    'Spa Grooming làm đẹp': 'Spa & Grooming',
    'Phẫu thuật & Ngoại khoa': 'Surgery',
    'Phẫu thuật & Triệt sản': 'Surgery & Spay/Neuter',
    'Cấp cứu 24/7': 'Emergency Care 24/7',
    'Tìm kiếm dịch vụ...': 'Search services...',
    'Dịch vụ liên quan': 'Related Services',
    '-- Vui lòng chọn dịch vụ --': '-- Please choose a service --',
    'Mô tả chi tiết chuyên môn': 'Clinical Details',
    '💡 Lời khuyên từ bác sĩ:': '💡 Veterinarian’s Advice:',
    'Thú cưng cần được thăm khám định kỳ 6 tháng một lần để phát hiện sớm các mầm bệnh nguy hiểm trước khi có biểu hiện ra ngoài.': 'Pets should have a checkup every six months so potential health concerns can be found early.',
    'Quy trình thực hiện chuẩn Y khoa': 'Our Veterinary Process',
    'DỊCH VỤ CHÍNH HÃNG': 'TRUSTED VETERINARY CARE',
    'Chi phí dịch vụ dự kiến': 'Estimated Service Fee',
    'Thời gian thực hiện:': 'Duration:',
    'Hình thức:': 'Visit type:',
    'Tại phòng khám': 'In-clinic',
    'Bác sĩ phụ trách:': 'Veterinarian:',
    'Bác sĩ Chuyên khoa': 'Veterinary Specialist',
    '📅 Đặt lịch dịch vụ này ngay': '📅 Book This Service',
    '📞 Tư vấn qua điện thoại (1900 6868)': '📞 Call Us (1900 6868)',
    '* Sau khi đặt lịch, nhân viên y tế sẽ liên hệ lại xác nhận khung giờ trong vòng 15 phút.': '* Our team will contact you within 15 minutes to confirm your appointment time.',
    '30 phút': '30 min',
    '20 phút': '20 min',
    '45 phút': '45 min',
    '60 phút': '60 min',
    '90 phút': '90 min',
    '24/7': '24/7',
    'Được thực hiện bởi bác sĩ thú y có chứng chỉ hành nghề theo quy chuẩn quốc tế.': 'Performed by a licensed veterinarian in accordance with international standards.',
    'Khám tổng quát & Tư vấn sức khỏe': 'Wellness Exam & Health Consultation',
    'Tiêm phòng Vaccine trọn gói': 'Complete Vaccination Package',
    'Xét nghiệm máu & Siêu âm màu': 'Blood Tests & Color Ultrasound',
    'Spa tắm mát & Grooming tạo kiểu': 'Bath & Professional Grooming',
    'Phẫu thuật Ngoại khoa & Triệt sản': 'Surgery & Spay/Neuter',
    'Cấp cứu & Lưu trú điều trị 24/7': 'Emergency & 24/7 Inpatient Care',
    'Đánh giá toàn diện thể trạng, nghe tim phổi, kiểm tra tai mắt mũi họng và tư vấn dinh dưỡng cho thú cưng.': 'A comprehensive health check including heart and lung assessment, an ear, eye, nose, and throat exam, and nutrition guidance.',
    'Gói khám toàn diện được thiết kế để phát hiện sớm các bệnh lý tiềm ẩn ở thú cưng. Bác sĩ thú y sẽ kiểm tra lâm sàng từ đầu đến chân bao gồm: hệ tim mạch, hô hấp, hệ tiêu hóa, da lông, mắt, tai và kiểm tra cân nặng, chỉ số BMI.': 'This complete exam is designed to detect hidden health concerns early. Your veterinarian will assess the cardiovascular, respiratory, and digestive systems, skin and coat, eyes and ears, weight, and BMI.',
    'Vaccine 5 bệnh, 7 bệnh cho chó mèo, phòng dại nhập khẩu chính hãng kèm sổ tiêm chủng chuẩn quốc tế.': 'Authentic imported 5-in-1 and 7-in-1 vaccines for dogs and cats, rabies protection, and an international-standard vaccination record.',
    'Dịch vụ tiêm phòng đầy đủ các loại vaccine quan trọng cho chó và mèo: Vaccine phòng dại (Rabies), vaccine 7 bệnh cho chó (Care, Parvo, Viêm gan truyền nhiễm, Ho cũi...), vaccine 4 bệnh cho mèo. Thú cưng được khám sàng lọc kỹ trước khi tiêm.': 'A complete range of essential vaccines for cats and dogs, including rabies, canine 7-in-1, and feline 4-in-1 vaccines. Every pet receives a screening exam before vaccination.',
    'Hệ thống máy xét nghiệm sinh hóa tự động và siêu âm Doppler chẩn đoán chính xác trong 30 phút.': 'Automated blood chemistry testing and Doppler ultrasound support accurate diagnosis, with results in as little as 30 minutes.',
    'Chẩn đoán cận lâm sàng bằng công nghệ kỹ thuật số: Công thức máu (CBC), sinh hóa chức năng gan thận, điện giải đồ, siêu âm màu ổ bụng phát hiện sỏi, viêm tử cung, thai kỳ hoặc khối u sớm.': 'Digital diagnostics include complete blood counts, liver and kidney chemistry, electrolytes, and abdominal ultrasound to detect stones, uterine infection, pregnancy, or tumors.',
    'Tắm trị liệu khử mùi hôi, vắt tuyến hôi, cắt tỉa móng, vệ sinh tai và cắt tỉa lông tạo kiểu nghệ thuật.': 'A therapeutic bath, odor control, nail trimming, ear cleaning, and a stylish coat trim.',
    'Quy trình spa 7 bước chuẩn 5 sao với các sản phẩm sữa tắm dịu nhẹ nhập khẩu từ Châu Âu, giúp thú cưng sạch sẽ, thơm lâu, ngăn ngừa ve rận nấm da và có bộ lông bồng bềnh xinh xắn.': 'Our seven-step spa uses gentle European products to keep your pet clean and fresh, help prevent parasites and skin fungus, and leave the coat soft and fluffy.',
    'Phòng mổ vô trùng áp lực dương, gây mê khí dung an toàn tuyệt đối, mổ nội soi vết thương nhỏ.': 'Positive-pressure sterile operating room, carefully monitored anesthesia, and minimally invasive procedures.',
    'Thực hiện các phẫu thuật triệt sản chó mèo đực/cái, mổ lấy sỏi bàng quang, phẫu thuật chỉnh hình gãy xương, mổ cấp cứu xoắn dạ dày hoặc mổ đẻ. Thiết bị monitor theo dõi sinh tồn liên tục.': 'Our surgical services include spay/neuter procedures, bladder stone removal, fracture repair, emergency surgery, and cesarean sections, with continuous vital-sign monitoring.',
    'Đội ngũ bác sĩ và điều dưỡng trực xuyên đêm, lồng ấp oxy hiện đại, tiếp nhận cấp cứu tức thì.': 'Veterinarians and nurses are on call overnight, with modern oxygen support and immediate emergency intake.',
    'Dịch vụ cấp cứu 24/24 cho các trường hợp nguy cấp: ngộ độc thực phẩm/hóa chất, tai nạn chấn thương gãy xương, khó thở, sốc nhiệt, co giật. Phòng lưu bệnh nội trú sạch sẽ, có camera giám sát từ xa cho chủ nuôi.': '24-hour emergency care for poisoning, trauma, breathing difficulty, heatstroke, or seizures. Clean inpatient rooms include remote camera access for pet parents.',

    'Chọn Thú Cưng': 'Choose a Pet',
    'Dịch Vụ & Bác Sĩ': 'Service & Veterinarian',
    'Ngày & Giờ Khám': 'Date & Time',
    'Xác Nhận Lịch': 'Confirm Appointment',
    'ĐẶT HẸN TRỰC TUYẾN 24/7': 'ONLINE BOOKING 24/7',
    'Đặt Lịch Khám Thú Y': 'Book a Veterinary Visit',
    'Hoàn tất 4 bước đơn giản để bác sĩ chuẩn bị đón tiếp bé chu đáo nhất.': 'Complete four simple steps so our team can prepare for your pet.',
    'Bước 1: Chọn Thú Cưng Cần Khám': 'Step 1: Choose a Pet',
    '+ Thêm thú cưng mới': '+ Add a Pet',
    'Tiếp tục: Chọn Dịch vụ →': 'Continue: Choose a Service →',
    'Bước 2: Chọn Dịch Vụ & Bác Sĩ Phụ Trách': 'Step 2: Choose a Service & Veterinarian',
    'Dịch vụ y tế cần sử dụng': 'Veterinary Service',
    'Chọn Bác sĩ chuyên khoa (Tùy chọn)': 'Choose a Veterinarian (Optional)',
    'Bác sĩ bất kỳ (Hệ thống tự xếp)': 'Any Veterinarian (Automatically assigned)',
    'ThS. BS. Nguyễn Văn An (Trưởng khoa Nội & Chẩn đoán hình ảnh)': 'ThS. BS. Nguyễn Văn An (Head of Internal Medicine & Diagnostic Imaging)',
    'BS. CKI Trần Mai Chi (Chuyên gia Ngoại khoa & Sản khoa)': 'BS. CKI Trần Mai Chi (Surgery & Obstetrics Specialist)',
    'BS. Lê Hoàng Nam (Bác sĩ Tiêm chủng & Da liễu thú cưng)': 'BS. Lê Hoàng Nam (Vaccination & Veterinary Dermatology)',
    '* Nếu bạn để trống, hệ thống sẽ tự động chỉ định bác sĩ chuyên khoa phù hợp đang trực vào khung giờ bạn chọn.': '* If left blank, an available specialist will be assigned for your selected time.',
    'Tiếp tục: Chọn Thời gian →': 'Continue: Choose a Time →',
    'Bước 3: Chọn Ngày & Khung Giờ Khám': 'Step 3: Choose a Date & Time',
    'Ngày đến khám': 'Appointment Date',
    '* Hệ thống tự động chặn ngày trong quá khứ.': '* Past dates cannot be selected.',
    'Chọn khung giờ còn trống:': 'Available time slots:',
    '🟩 Trống (Có thể đặt)': '🟩 Available',
    '🟥 Kín lịch (Đã có người đặt)': '🟥 Fully Booked',
    'Tiếp tục: Xác nhận & Triệu chứng →': 'Continue: Symptoms & Confirmation →',
    'Bước 4: Triệu Chứng & Xác Nhận Đặt Lịch': 'Step 4: Symptoms & Confirm Booking',
    'Họ tên người đặt': 'Your Name',
    'Số điện thoại xác nhận': 'Contact Phone',
    'Triệu chứng của thú cưng hoặc lý do khám': 'Symptoms or Reason for Visit',
    'Ghi chú bổ sung cho bác sĩ': 'Additional Notes for the Veterinarian',
    'Tóm Tắt Lịch Hẹn Đã Chọn:': 'Appointment Summary:',
    'Thú cưng khám:': 'Pet:',
    'Dịch vụ:': 'Service:',
    'Chi phí dự kiến:': 'Estimated Fee:',
    'Bác sĩ phụ trách:': 'Veterinarian:',
    'Thời gian khám:': 'Appointment Time:',
    'Người liên hệ:': 'Contact:',
    'Lý do khám:': 'Reason for Visit:',
    '📅 Hoàn tất Đặt Lịch Khám': '📅 Confirm Appointment',
    'Đặt Lịch Khám Thành Công!': 'Appointment Booked!',
    'Lịch khám của bạn đã được ghi nhận vào hệ thống PetCare Clinic. Bác sĩ trực sẽ liên hệ xác nhận trong ít phút.': 'Your appointment has been recorded. Our team will contact you shortly to confirm.',
    'Mã lịch khám:': 'Appointment ID:',
    'Trạng thái:': 'Status:',
    'Chờ xác nhận': 'Awaiting Confirmation',
    '🐾 Xem Hồ Sơ Thú Cưng': '🐾 View Pet Profiles',
    '🏠 Về Trang Chủ': '🏠 Go Home',

    'Cửa Hàng Dinh Dưỡng & Phụ Kiện': 'Nutrition & Accessories Shop',
    'Sản phẩm y tế thú y, thức ăn hạt cao cấp và đồ dùng chính hãng 100%.': 'Veterinary products, premium pet food, and trusted accessories.',
    'Đang tải...': 'Loading...',
    'Sắp xếp: Nổi bật nhất': 'Sort: Featured',
    'Giá tăng dần': 'Price: Low to High',
    'Giá giảm dần': 'Price: High to Low',
    'Bán chạy nhất': 'Best Sellers',
    'Tìm kiếm': 'Search',
    'Danh mục': 'Categories',
    'Tất cả danh mục': 'All Categories',
    'Thức ăn & Dinh dưỡng': 'Food & Nutrition',
    'Vệ sinh & Sữa tắm': 'Hygiene & Shampoo',
    'Thuốc & Trị ve rận': 'Medicine & Parasite Care',
    'Đồ chơi cho bé': 'Pet Toys',
    'Balo & Phụ kiện': 'Carriers & Accessories',
    'Khoảng giá': 'Price Range',
    'Tất cả mức giá': 'All Prices',
    'Dưới 100.000 ₫': 'Under 100,000 ₫',
    '100.000 ₫ - 300.000 ₫': '100,000 ₫ - 300,000 ₫',
    'Trên 300.000 ₫': 'Over 300,000 ₫',
    'sản phẩm': 'products',
    'Chính hãng 100%': '100% Authentic',
    'Đã bán:': 'Sold:',
    'Mô tả sản phẩm:': 'Product Description:',
    'Số lượng mua:': 'Quantity:',
    'Tồn kho:': 'In stock:',
    '🛒 Thêm vào giỏ hàng': '🛒 Add to Cart',
    '⚡ Mua ngay': '⚡ Buy Now',
    'Cam kết chất lượng: Đổi trả trong 7 ngày nếu lỗi': 'Quality promise: Returns accepted within 7 days for defective items',
    'Giao hàng nhanh toàn quốc - Miễn phí đơn từ 500k': 'Fast nationwide delivery - Free shipping on orders over 500,000 ₫',
    'Sản phẩm tương tự có thể bạn quan tâm': 'You may also like',
    'Xem chi tiết': 'View Details',
    'Chi phí từ': 'Starting at',
    'Chi phí dịch vụ': 'Service Fee',

    'Giỏ Hàng Mua Sắm': 'Shopping Cart',
    'Kiểm tra lại danh sách các món đồ và số lượng trước khi tiến hành thanh toán.': 'Review your items and quantities before checkout.',
    '🗑️ Xóa toàn bộ giỏ': '🗑️ Clear Cart',
    '← Tiếp tục mua sắm': '← Continue Shopping',
    'Tóm Tắt Đơn Hàng': 'Order Summary',
    'Mã giảm giá / Voucher': 'Discount Code',
    'Áp dụng': 'Apply',
    '* Nhập': '* Enter',
    'để giảm ngay 10%': 'to get 10% off',
    'Tạm tính tiền hàng:': 'Subtotal:',
    'Phí vận chuyển:': 'Shipping:',
    'Giảm giá Voucher:': 'Discount:',
    'Tổng thanh toán:': 'Total:',
    'Tiến hành thanh toán →': 'Proceed to Checkout →',
    'Miễn phí vận chuyển cho đơn hàng từ': 'Free shipping on orders over',
    'trở lên': 'or more',
    'Tiếp tục mua sắm': 'Continue Shopping',
    'Thanh toán đơn': 'Checkout',
    'Giỏ hàng': 'Cart',

    '1. Thông Tin Nhận Hàng': '1. Delivery Information',
    'Họ và tên người nhận': 'Recipient Name',
    'Số điện thoại liên lạc': 'Phone Number',
    'Email nhận hóa đơn': 'Receipt Email',
    'Địa chỉ giao hàng cụ thể': 'Delivery Address',
    'Ghi chú giao hàng (nếu có)': 'Delivery Notes (Optional)',
    '2. Phương Thức Thanh Toán': '2. Payment Method',
    'Tiền mặt (COD)': 'Cash on Delivery',
    'Thanh toán khi nhận': 'Pay when your order arrives',
    'Chuyển khoản VietQR': 'VietQR Bank Transfer',
    'Quét mã thanh toán tức thì': 'Scan to pay instantly',
    'Ví MoMo / VNPAY': 'MoMo / VNPAY Wallet',
    'Thẻ nội địa & Quốc tế': 'Domestic & International Cards',
    'Quét mã VietQR để thanh toán': 'Scan the VietQR code to pay',
    'Ngân hàng:': 'Bank:',
    '• STK:': '• Account No.:',
    'Chủ TK:': 'Account Holder:',
    'Đơn Hàng Của Bạn': 'Your Order',
    'Tạm tính:': 'Subtotal:',
    'Tổng cộng:': 'Total:',
    '🔒 Xác nhận Đặt Hàng': '🔒 Place Order',
    'Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và chính sách kiểm hàng của chúng tôi.': 'By placing your order, you agree to our Terms of Service and inspection policy.',
    'Đặt Hàng Thành Công!': 'Order Placed Successfully!',
    'Cảm ơn bạn đã tin tưởng mua sắm tại PetCare Clinic. Nhân viên chăm sóc sẽ liên hệ qua điện thoại để xác nhận đơn.': 'Thank you for shopping with PetCare Clinic. Our team will call you to confirm your order.',
    'Mã đơn hàng:': 'Order ID:',
    'Tổng tiền:': 'Total:',
    'Hình thức:': 'Payment Method:',
    '📦 Xem Lịch Sử Đơn Hàng': '📦 View Order History',

    'Lịch Sử Đơn Hàng': 'Order History',
    'Theo dõi tình trạng xử lý và tiến trình vận chuyển các đơn hàng của bạn.': 'Track order processing and delivery progress.',
    '🛍️ Mua thêm sản phẩm': '🛍️ Shop More',
    'Tất cả': 'All',
    'Chờ xác nhận': 'Awaiting Confirmation',
    'Đang xử lý': 'Processing',
    'Đang giao': 'Shipping',
    'Hoàn thành': 'Completed',
    'Mã đơn hàng': 'Order ID',
    'Ngày đặt': 'Order Date',
    'Sản phẩm đặt': 'Items',
    'Tổng tiền': 'Total',
    'Trạng thái đơn': 'Order Status',
    'Thanh toán': 'Payment',
    'Thao tác': 'Actions',
    'Chi tiết đơn hàng:': 'Order Details:',
    'Người nhận & SĐT:': 'Recipient & Phone:',
    'Thời gian đặt hàng:': 'Order Date:',
    'Địa chỉ giao hàng:': 'Delivery Address:',
    'Tình trạng thanh toán:': 'Payment Status:',
    'Trạng thái đơn:': 'Order Status:',
    'Danh sách sản phẩm trong đơn': 'Order Items',
    'Tạm tính:': 'Subtotal:',
    'Đóng': 'Close',

    'Email hoặc Tên đăng nhập': 'Email or Username',
    'Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của PetCare Clinic.': 'I agree to the Terms of Service and Privacy Policy of PetCare Clinic.',
    'Mật khẩu': 'Password',
    'Ghi nhận từ chủ nuôi và quan sát lâm sàng ban đầu...': 'Record the owner’s observations and initial clinical findings...',
    'VD: Viêm đường hô hấp trên / Nấm da kẽ chân / Khỏe mạnh tiêm vaccine...': 'e.g. Upper respiratory infection / interdigital fungus / healthy for vaccination...',
    'Chi tiết các bước xử lý tại phòng khám và liệu trình điều trị...': 'Describe the in-clinic procedures and treatment plan...',
    'VD: Giữ ấm, tránh tắm trong 3 ngày, uống nhiều nước...': 'e.g. Keep warm, avoid bathing for three days, and provide plenty of water...',
    'Quên mật khẩu?': 'Forgot Password?',
    'Ghi nhớ đăng nhập': 'Remember me',
    'Đăng nhập ngay': 'Sign In',
    'Chưa có tài khoản?': 'New to PetCare?',
    'Đăng ký tài khoản': 'Create an Account',
    'Chào mừng bạn quay lại hệ thống PetCare Clinic': 'Welcome back to PetCare Clinic',
    'Yêu thương trọn vẹn, chăm sóc tận tâm': 'Complete love, compassionate care',
    'Đăng nhập để theo dõi hồ sơ thú cưng, đặt lịch khám nhanh chóng và quản lý lịch sử y tế một cách dễ dàng.': 'Sign in to manage pet profiles, book visits, and keep track of medical history.',
    'Đặt lịch khám online 24/7 chỉ với 4 bước': 'Book an appointment online in four simple steps',
    'Hồ sơ bệnh án điện tử cập nhật theo thời gian thực': 'Medical records updated in real time',
    'Đội ngũ Thạc sĩ, Bác sĩ thú y giàu chuyên môn': 'Experienced veterinarians and specialists',
    'Cấp cứu 24/7:': 'Emergency care 24/7:',
    'Bấm để tự điền': 'Click to auto-fill',
    '⚡ Kiểm tra nhanh các vai trò:': '⚡ Try a demo role:',
    '← Quay lại Trang chủ': '← Back to Home',
    'Gia nhập cộng đồng yêu thú cưng': 'Join our pet-loving community',
    'Tạo tài khoản PetCare để lưu trữ hồ sơ tiêm phòng, quản lý lịch khám và nhận các ưu đãi hấp dẫn từ bệnh viện.': 'Create a PetCare account to manage vaccination records and appointments and receive special offers.',
    'Tạo và quản lý không giới hạn hồ sơ thú cưng': 'Create and manage unlimited pet profiles',
    'Nhận thông báo nhắc lịch tiêm phòng tự động': 'Get automatic vaccination reminders',
    'Tích lũy điểm thưởng và giảm 10% khi mua sắm': 'Earn reward points and save 10% on purchases',
    'Luôn đồng hành cùng bé yêu': 'Always here for your pet',
    '• Luôn đồng hành cùng bé yêu': '• Always here for your pet',
    'Trở thành thành viên PetCare Clinic ngay hôm nay': 'Join PetCare Clinic today',
    'Họ và tên': 'Full Name',
    'Nguyễn Văn A': 'John Doe',
    'Địa chỉ Email': 'Email Address',
    'Số điện thoại': 'Phone Number',
    'Xác nhận mật khẩu': 'Confirm Password',
    'Tối thiểu 6 ký tự': 'At least 6 characters',
    'Nhập lại mật khẩu': 'Re-enter your password',
    'Tôi đồng ý với': 'I agree to the',
    'Điều khoản dịch vụ': 'Terms of Service',
    'của PetCare Clinic.': 'of PetCare Clinic.',
    'Tạo tài khoản mới': 'Create Account',
    'Đã có tài khoản?': 'Already have an account?',

    'Quay lại Trang chủ': 'Back to Home',
    'Quay lại Danh sách dịch vụ': 'Back to Services',
    'Quay lại Danh sách thú cưng': 'Back to Pet Profiles',
    'Quay lại Cửa hàng': 'Back to Shop',
    'Chi tiết dịch vụ': 'Service Details',
    'Chi tiết sản phẩm': 'Product Details',
    'Danh sách thú cưng': 'Pet Profiles',
    'Hồ sơ bệnh án': 'Medical Record',
    'BÀN LÀM VIỆC BÁC SĨ': 'DOCTOR DASHBOARD',
    '🩺 Lịch khám hôm nay': '🩺 Today’s Appointments',
    'Lịch khám hôm nay': 'Today’s Appointments',
    '📋 Hồ sơ Bệnh án': '📋 Medical Records',
    'Hồ sơ Bệnh án': 'Medical Records',
    '🐾 Tra cứu Thú cưng': '🐾 Find a Pet',
    'Tra cứu Thú cưng': 'Find a Pet',
    '🌐 Portal Khách hàng': '🌐 Customer Portal',
    '🛡️ Bảng Admin': '🛡️ Admin Dashboard',
    'Portal Khách hàng': 'Customer Portal',
    'Bảng Admin': 'Admin Dashboard',
    '📋 Khám & Kê đơn': '📋 Examine & Prescribe',
    '👁️ Xem bệnh án': '👁️ View Medical Record',
    'Loài:': 'Species:',
    'Độ tuổi:': 'Age:',
    'Mã Microchip:': 'Microchip ID:',
    'Tình trạng tiêm:': 'Vaccination Status:',
    'Đầy đủ sổ tiêm': 'Vaccination records complete',
    'Ghi chú y tế & Dị ứng:': 'Medical Notes & Allergies:',
    '📅 Đặt lịch khám cho bé': '📅 Book a Visit for Your Pet',
    'Lịch Sử Khám & Bệnh Án Điện Tử': 'Visit History & Digital Medical Records',
    'Dữ liệu bảo mật y tế': 'Secure Medical Data',
    'Sổ theo dõi Tiêm Chủng Vaccine': 'Vaccination Record',
    'Loại Vaccine': 'Vaccine',
    'Ngày tiêm': 'Date Given',
    'Bác sĩ thực hiện': 'Veterinarian',
    'Hẹn mũi nhắc lại': 'Next Dose',
    'Vaccine 7 bệnh cho chó / 4 bệnh mèo': 'Canine 7-in-1 / Feline 4-in-1 Vaccine',
    'Vaccine phòng dại (Rabies)': 'Rabies Vaccine',

    'Cửa hàng': 'Shop',
    'Đã bán:': 'Sold:',
    'Mô tả sản phẩm:': 'Product Description:',
    'Số lượng mua:': 'Quantity:',
    'Tồn kho:': 'In stock:',
    'Xóa toàn bộ giỏ hàng': 'Clear the entire cart',
    'Xóa sản phẩm khỏi giỏ hàng': 'Item removed from cart',
    'Xóa hồ sơ thú cưng': 'Delete Pet Profile',
    'Thêm thú cưng mới': 'Add a Pet',
    'Tất cả lịch': 'All Appointments',
    'Chờ duyệt': 'Pending',
    'Đã xác nhận': 'Confirmed',
    'Đã hủy': 'Cancelled',
    'Mã hẹn': 'Appointment ID',
    'Ngày khám': 'Appointment Date',
    'Thú cưng': 'Pet',
    'Dịch vụ': 'Service',
    'Bác sĩ': 'Veterinarian',
    'Khách hàng': 'Customer',
    'Sản phẩm': 'Product',
    'Tìm theo tên khách, thú cưng, dịch vụ...': 'Search customers, pets, or services...',
    'Bảng Tổng Quan Quản Trị': 'Admin Overview',
    'QUẢN TRỊ VIÊN': 'ADMINISTRATOR',
    'Tổng quan KPI': 'KPI Overview',
    'Quản lý Lịch khám': 'Manage Appointments',
    'Quản lý Đơn hàng': 'Manage Orders',
    'Quản lý Thú cưng': 'Manage Pets',
    'Quản lý Dịch vụ': 'Manage Services',
    'Quản lý Sản phẩm': 'Manage Products',
    'HỆ THỐNG': 'SYSTEM',
    'Xem Portal Khách hàng': 'View Customer Portal',
    'Chuyển Bàn Bác sĩ': 'Switch to Doctor Dashboard',
    'Tuần 1': 'Week 1',
    'Tuần 2': 'Week 2',
    'Tuần 3': 'Week 3',
    'Tuần 4': 'Week 4',
    'Thời gian': 'Time',
    'Bác sĩ phụ trách': 'Veterinarian',
    'Hành động': 'Actions',
    '✓ Duyệt': '✓ Approve',
    'Đã hoàn tất': 'Completed',
    'Hiển thị': 'Showing',
    'trong tổng số': 'of',
    'mục': 'items',
    'Đơn Hàng Gần Đây': 'Recent Orders',
    'Các đơn mua sản phẩm từ portal khách hàng': 'Product orders placed through the customer portal',
    'Xem tất cả đơn': 'View All Orders',
    'Mã đơn': 'Order ID',
    'Tổng giá trị': 'Total Value',
    'Thời gian đặt': 'Order Date',
    '● Máy chủ hoạt động ổn định': '● Server is running normally',
    'Xem Portal': 'View Portal',
    'Doanh Thu Đơn Hàng': 'Order Revenue',
    'Lịch Khám Hôm Nay': 'Today’s Appointments',
    'Lịch Đang Chờ Duyệt': 'Pending Appointments',
    'Tổng Thú Cưng Đã Lưu': 'Registered Pets',
    'Tần Suất Lịch Khám 7 Ngày Qua': 'Appointments Over the Past 7 Days',
    'Số ca khám': 'Visits',
    'Thứ 7 & Chủ Nhật có lượng thú cưng đến khám và làm đẹp cao nhất trong tuần.': 'Saturday and Sunday are our busiest days for visits and grooming.',
    'Doanh Thu Bán Hàng & Dịch Vụ': 'Product & Service Revenue',
    'Tăng trưởng 24% so với cùng kỳ tháng trước.': 'Up 24% compared with the previous month.',
    'Quản Lý Lịch Khám & Hẹn Bác Sĩ': 'Appointments & Veterinarian Scheduling',
    'Duyệt lịch, xếp bác sĩ và theo dõi trạng thái các lượt khám': 'Review appointments, assign veterinarians, and track visit status',
    '+ Tạo lịch mới': '+ Create Appointment',
    'Tất cả lịch': 'All Appointments',
    'Đang chờ': 'Pending',
    'Phòng Khám Lâm Sàng - Bác Sĩ Trực Ca': 'Clinical Department - On-duty Veterinarian',
    'Phòng Khám Lâm Sàng – Bác Sĩ Trực Ca': 'Clinical Practice – On-duty Veterinarian',
    'PETCARECLINIC · CHĂM SÓC LÂM SÀNG': 'PETCARECLINIC · CLINICAL CARE',
    'Sẵn sàng nhận khám': 'Available for appointments',
    'LỊCH KHÁM': 'APPOINTMENTS',
    '＋ Tạo Bệnh Án Mới': '＋ Create a Medical Record',
    'Tạo Bệnh Án Mới': 'Create a Medical Record',
    'Bác sĩ chuyên khoa': 'Specialist Veterinarian',
    '👨‍⚕️ Trạng thái: Sẵn sàng nhận khám': '👨‍⚕️ Status: Available for appointments',
    'Danh Sách Ca Khám Được Phân Bổ': 'Assigned Appointments',
    'Bác sĩ thực hiện khám lâm sàng, chẩn đoán, kê đơn và lưu bệnh án điện tử.': 'Veterinarians examine, diagnose, prescribe treatment, and update digital medical records.',
    '📋 Tạo Bệnh Án Mới': '📋 Create a Medical Record',
    'Tất cả ca khám': 'All Visits',
    'Chờ xác nhận': 'Awaiting Confirmation',
    'Chờ khám': 'Awaiting Visit',
    'Đang khám': 'In Progress',
    'Đã hoàn thành': 'Completed',
    'Mã ca': 'Visit ID',
    'Thời gian hẹn': 'Appointment Time',
    'Bệnh nhân (Thú cưng)': 'Patient (Pet)',
    'Dịch vụ yêu cầu': 'Requested Service',
    'Triệu chứng ban đầu': 'Initial Symptoms',
    'Trạng thái': 'Status',
    'Thao tác': 'Actions',
    '← Về Bàn Khám': '← Back to Clinic',
    'Bảo mật Y tế': 'Medical Privacy',
    'Hồ Sơ Bệnh Án Thú Cưng': 'Pet Medical Record',
    'Thông Tin Bệnh Nhân & Chủ Nuôi': 'Pet & Owner Information',
    'Mã ca:': 'Visit ID:',
    'Tên thú cưng & Loài:': 'Pet & Species:',
    'Chủ nuôi & Liên lạc:': 'Owner & Contact:',
    'Dịch vụ thực hiện:': 'Service:',
    'Kết Quả Thăm Khám Lâm Sàng': 'Clinical Examination Results',
    'Cân nặng khi khám (kg)': 'Weight at Visit (kg)',
    'Thân nhiệt đo được (°C)': 'Temperature (°C)',
    'Triệu chứng & Bệnh sử ghi nhận': 'Symptoms & Medical History',
    'Chẩn đoán của Bác sĩ': 'Veterinarian’s Diagnosis',
    'Phương pháp điều trị / Liệu trình chỉ định': 'Treatment / Prescribed Plan',
    'Đơn Thuốc & Hướng Dẫn Điều Trị Tại Nhà': 'Prescription & Home-care Instructions',
    '➕ Thêm thuốc vào đơn': '➕ Add Medication',
    'Ngày hẹn tái khám (nếu có)': 'Follow-up Date (Optional)',
    'Lời dặn dò chế độ chăm sóc cho chủ nuôi': 'Home-care Instructions',
    'Hủy bỏ': 'Cancel',
    '💾 Lưu Bệnh Án & Hoàn Tất Ca Khám': '💾 Save Record & Complete Visit',

    'Tên sản phẩm': 'Product Name',
    'Số lượng': 'Quantity',
    'Giá': 'Price',
    'Thành tiền': 'Amount',
    'Xem': 'View',
    'Miễn phí': 'Free',
    'Thành công': 'Success',
    'Thất bại': 'Failed',
    'Không có ghi chú đặc biệt.': 'No special notes.',

    'Thức ăn hạt Royal Canin Kitten 2kg cho mèo con': 'Royal Canin Kitten Dry Food 2kg',
    'Snack súp thưởng Ciao Churu vị Cá ngừ (Túi 4 thanh)': 'Ciao Churu Tuna Lickable Treats (4-pack)',
    'Sữa tắm khử mùi dưỡng mượt lông SOS Special 530ml': 'SOS Special Deodorizing & Conditioning Shampoo 530ml',
    'Thuốc nhỏ gáy trị ve rận bọ chét Frontline Plus cho chó': 'Frontline Plus Flea & Tick Treatment for Dogs',
    'Đồ chơi gặm sạch mảng bám răng hình xương gai dẻo': 'Flexible Spiked Bone Dental Chew Toy',
    'Balo phi hành gia vận chuyển thú cưng vòm trong suốt': 'Transparent Dome Pet Carrier Backpack',
    'Cung cấp năng lượng cân bằng, hàm lượng protein chất lượng cao giúp xương và cơ bắp mèo con phát triển vượt trội.': 'Balanced energy and high-quality protein support healthy bone and muscle development in kittens.',
    'Dạng kem nhuyễn thơm ngon kích thích thèm ăn, bổ sung tinh chất trà xanh giúp khử mùi hôi phân và nước tiểu.': 'A tasty creamy treat to encourage appetite, with green tea extract to help reduce stool and urine odor.',
    'Chiết xuất thảo dược tự nhiên lưu hương hoa cỏ quyến rũ tới 7 ngày, chống xơ rối và hỗ trợ diệt khuẩn da lông.': 'Natural herbal extracts leave a fresh floral scent for up to seven days, condition the coat, and help protect skin.',
    'Tiêu diệt 100% bọ chét trưởng thành, ấu trùng và ve trong vòng 24-48 giờ, duy trì hiệu quả bảo vệ liên tục 30 ngày.': 'Kills adult fleas, larvae, and ticks within 24–48 hours and provides up to 30 days of protection.',
    'Chất liệu TPR dẻo dai an toàn không độc hại, kích thích thú cưng vận động và làm sạch vôi răng tự nhiên.': 'Durable, non-toxic TPR encourages play and helps clean tartar naturally.',
    'Lỗ thoáng khí đối lưu 3 chiều, quai đeo đệm xốp êm ái, chịu lực tốt cho thú cưng dưới 7kg khi đi dạo hay du lịch.': 'Three-way ventilation and padded straps make this sturdy carrier comfortable for pets under 7 kg on walks or trips.'
  };

  const VietnameseServiceSteps = {
    'Tiếp đón & Lấy thông tin bệnh sử': 'Check-in & Medical History',
    'Đo thân nhiệt, huyết áp, cân nặng': 'Measure Temperature, Blood Pressure & Weight',
    'Khám lâm sàng các cơ quan': 'Clinical Examination',
    'Tư vấn phác đồ phòng & chữa bệnh': 'Discuss Prevention & Treatment',
    'Cấp sổ theo dõi sức khỏe': 'Provide a Health Record',
    'Kiểm tra thân nhiệt trước tiêm': 'Check Temperature Before Vaccination',
    'Lựa chọn vaccine phù hợp lứa tuổi': 'Choose Age-appropriate Vaccines',
    'Tiêm vô trùng tiêu chuẩn cao': 'Administer Vaccines Using Sterile Technique',
    'Theo dõi phản ứng sốc phản vệ 15-30p': 'Monitor for Reactions for 15–30 Minutes',
    'Ghi lịch hẹn mũi kế tiếp': 'Schedule the Next Dose',
    'Lấy mẫu máu/Chuẩn bị vị trí siêu âm': 'Collect Blood / Prepare for Ultrasound',
    'Vận hành trên máy phân tích tự động': 'Run Samples on Automated Analyzers',
    'Bác sĩ chuyên khoa hội chẩn hình ảnh': 'Specialist Reviews Imaging',
    'Trả kết quả và giải thích chi tiết': 'Review and Explain Results',
    'Chải lông & gỡ rối': 'Brush & Detangle the Coat',
    'Cắt tỉa móng & vệ sinh tai': 'Trim Nails & Clean Ears',
    'Vắt tuyến hôi & Tắm 2 lần sữa tắm dưỡng chất': 'Express Anal Glands & Bathe Twice with Conditioning Shampoo',
    'Sấy khô & Chải phồng': 'Dry & Fluff the Coat',
    'Cắt tỉa tạo kiểu theo yêu cầu': 'Style the Coat as Requested',
    'Khám tiền phẫu & Xét nghiệm máu': 'Pre-surgical Exam & Blood Tests',
    'Gây mê hồi sức an toàn': 'Safe Anesthesia & Monitoring',
    'Tiến hành phẫu thuật phòng vô trùng': 'Perform Surgery in a Sterile Suite',
    'Chăm sóc hậu phẫu tại phòng lưu chuồng': 'Post-operative Inpatient Care',
    'Tiếp nhận khẩn cấp & Phân loại ca bệnh': 'Emergency Intake & Triage',
    'Hỗ trợ thở oxy/Hồi sức tim phổi': 'Oxygen Support / Cardiopulmonary Resuscitation',
    'Xử lý cầm máu hoặc chống sốc': 'Control Bleeding or Treat Shock',
    'Theo dõi nội trú 24/24': '24-hour Inpatient Monitoring'
  };

  const translationsForServiceSteps = VietnameseServiceSteps;
  const textNodeStates = new WeakMap();
  const attributeStates = new WeakMap();
  let language = 'vi';
  let observer;

  function normalize(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function formatCurrencyText(value, locale) {
    const trimmed = normalize(value);
    const match = trimmed.match(/^(?:₫\s*([\d.,]+)|([\d.,]+)\s*₫)$/);
    if (!match) return null;

    const amount = Number((match[1] || match[2]).replace(/[.,]/g, ''));
    return Number.isFinite(amount)
      ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(amount)
      : null;
  }

  function translateText(value) {
    const trimmed = normalize(value);
    if (translations[trimmed]) return translations[trimmed];
    if (translationsForServiceSteps[trimmed]) return translationsForServiceSteps[trimmed];

    const stepMatch = trimmed.match(/^Bước (\d+): (.+)$/);
    if (stepMatch) {
      const translatedStep = translationsForServiceSteps[stepMatch[2]];
      return translatedStep ? `Step ${stepMatch[1]}: ${translatedStep}` : `Step ${stepMatch[1]}: ${stepMatch[2]}`;
    }

    const serviceTitleMatch = trimmed.match(/^(.+) - PetCare Clinic$/);
    if (serviceTitleMatch && translations[serviceTitleMatch[1]]) {
      return `${translations[serviceTitleMatch[1]]} - PetCare Clinic`;
    }

    const productTitleMatch = trimmed.match(/^(.+) - Cửa hàng PetCare$/);
    if (productTitleMatch && translations[productTitleMatch[1]]) {
      return `${translations[productTitleMatch[1]]} - Pet Shop`;
    }

    const dynamicPatterns = [
      [/^©\s*(\d{4}) PetCare Clinic\. Giữ toàn quyền\.$/, '© $1 PetCare Clinic. All rights reserved.'],
      [/^(\d+)\s*tuổi$/, '$1 years old'],
      [/^(\d+)\s*ngày$/, '$1 days'],
      [/^Hồ sơ (.+) - PetCare Clinic$/, 'Medical Record: $1 - PetCare Clinic'],
      [/^Chủ: (.+) • (.+)$/, 'Owner: $1 • $2'],
      [/^Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ của bé (.+)\?$/, 'Are you sure you want to permanently delete the profile for $1?'],
      [/^(.+) • Thời gian:$/, '$1 • Duration:'],
      [/^Đã cập nhật hồ sơ bé "(.+)" thành công!$/, 'Pet profile for "$1" updated successfully!'],
      [/^Đã thêm mới hồ sơ bé "(.+)"!$/, 'Pet profile for "$1" added successfully!'],
      [/^Đã xóa hồ sơ của "(.+)"$/, 'Profile for "$1" has been deleted.'],
      [/^Đã thêm "(.+)" vào giỏ hàng!$/, '"$1" was added to your cart!'],
      [/^Đã chuyển vai trò sang: (.+)$/, 'Role changed to: $1'],
      [/^Đã điền thông tin tài khoản demo: (.+)$/, 'Demo account details filled: $1'],
      [/^Không thể lưu hồ sơ thú cưng: (.+)$/, 'Unable to save pet profile: $1'],
      [/^Không thể xóa hồ sơ thú cưng: (.+)$/, 'Unable to delete pet profile: $1'],
      [/^Đã duyệt thành công lịch khám (.+)!$/, 'Appointment $1 approved successfully!'],
      [/^Đã hủy lịch khám (.+)$/, 'Appointment $1 cancelled.'],
      [/^Đã xóa hoàn toàn lịch khám (.+)$/, 'Appointment $1 deleted.'],
      [/^Kho chỉ còn (\d+) sản phẩm!$/, 'Only $1 item(s) left in stock!'],
      [/^Kho hàng hiện chỉ còn (\d+) sản phẩm!$/, 'Only $1 item(s) left in stock!'],
      [/^Số lượng vượt quá tồn kho \((\d+)\)!$/, 'Quantity exceeds available stock ($1)!'],
      [/^Số lượng trong kho chỉ còn (\d+) sản phẩm!$/, 'Only $1 item(s) left in stock!'],
      [/^Áp dụng thành công mã "(.+)" - Giảm 10%!$/, 'Code "$1" applied successfully - 10% off!'],
      [/^Áp dụng thành công mã VIP "(.+)" - Giảm 20%!$/, 'VIP code "$1" applied successfully - 20% off!']
    ];

    for (const [pattern, replacement] of dynamicPatterns) {
      if (pattern.test(trimmed)) return trimmed.replace(pattern, replacement);
    }
    return value;
  }

  function translateTextNode(node) {
    if (node.parentElement?.closest('.pet-name, .pet-breed, #detail-pet-name, #detail-pet-breed, #detail-pet-notes, #detail-pet-chip, #med-pet-name, #med-customer-name, #sidebar-user-name, #recap-customer, .user-name, [data-user-content], [contenteditable="true"]')) return;

    let state = textNodeStates.get(node);
    if (!state) {
      state = { source: node.nodeValue, rendered: node.nodeValue };
      textNodeStates.set(node, state);
    } else if (node.nodeValue !== state.rendered) {
      state.source = node.nodeValue;
    }

    if (!state.source.trim()) {
      if (node.nodeValue !== state.source) node.nodeValue = state.source;
      state.rendered = state.source;
      return;
    }

    const leading = state.source.match(/^\s*/)[0];
    const trailing = state.source.match(/\s*$/)[0];
    const currencyText = formatCurrencyText(state.source, language === 'en' ? 'en-US' : 'vi-VN');
    const translated = language === 'en'
      ? (currencyText || translateText(state.source))
      : (currencyText || state.source);
    const result = `${leading}${normalize(translated)}${trailing}`;
    if (node.nodeValue !== result) node.nodeValue = result;
    state.rendered = result;
  }

  function translateAttributes(element) {
    if (element.closest('.pet-name, .pet-breed, #detail-pet-name, #detail-pet-breed, #detail-pet-notes, #detail-pet-chip, #med-pet-name, #med-customer-name, #sidebar-user-name, #recap-customer, .user-name, [data-user-content], [contenteditable="true"]')) return;

    ['placeholder', 'title', 'aria-label', 'alt'].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (attribute === 'alt' && element.matches('.user-avatar, [data-pet-image], .pet-card-image, .pet-select-avatar')) return;

      let states = attributeStates.get(element);
      if (!states) {
        states = new Map();
        attributeStates.set(element, states);
      }
      let state = states.get(attribute);
      const value = element.getAttribute(attribute);
      if (!state) {
        state = { source: value, rendered: value };
        states.set(attribute, state);
      } else if (value !== state.rendered) {
        state.source = value;
      }

      const translated = language === 'en' ? translateText(state.source) : state.source;
      if (value !== translated) element.setAttribute(attribute, translated);
      state.rendered = translated;
    });
  }

  function translateSubtree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;

    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateTextNode(walker.currentNode);
    if (root.querySelectorAll) root.querySelectorAll('*').forEach(translateAttributes);
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === 'en' ? 'en' : 'vi';
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.error('Không thể lưu tùy chọn ngôn ngữ:', error);
    }

    window.currentLanguage = language;
    document.documentElement.lang = language;
    translateSubtree(document.body);
    translateSubtree(document.querySelector('title'));
    updateLanguageSwitcher();
    window.dispatchEvent(new CustomEvent('petcare:languagechange', { detail: { language } }));
  }

  function addAboutNavigationLink() {
    const nav = document.querySelector('.main-nav');
    if (!nav || nav.querySelector('[data-link="about"]')) return;

    const insidePages = window.location.pathname.includes('/pages/');
    const link = document.createElement('a');
    link.href = insidePages ? 'about.html' : 'pages/about.html';
    link.className = 'nav-link';
    link.dataset.link = 'about';
    link.innerHTML = '<span class="nav-icon">🐾</span><span>Giới thiệu</span>';
    const servicesLink = nav.querySelector('[data-link="services"]');
    nav.insertBefore(link, servicesLink || null);
  }

  function createLanguageSwitcher() {
    const actions = document.querySelector('.header-actions');
    const dashboardTopbar = document.querySelector('.dashboard-topbar');
    const authWrapper = document.querySelector('.auth-wrapper');
    const host = actions || dashboardTopbar || authWrapper;
    if (!host || host.querySelector('.language-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    if (!actions) switcher.classList.add('auth-language-switcher');
    switcher.innerHTML = `
      <button type="button" class="language-switcher-trigger" aria-haspopup="true" aria-expanded="false" aria-label="Chọn ngôn ngữ">
        <span class="language-switcher-current">
          <span class="language-flag language-current-flag" aria-hidden="true">🇻🇳</span>
          <span class="language-current-code">VIE</span>
        </span>
        <span class="language-switcher-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="language-switcher-menu" role="menu" hidden>
        <button type="button" class="language-option" role="menuitem" data-language="vi">
          <span class="language-flag" aria-hidden="true">🇻🇳</span>
          <span class="language-option-name">Tiếng Việt</span>
          <span class="language-option-code">VIE</span>
        </button>
        <button type="button" class="language-option" role="menuitem" data-language="en">
          <span class="language-flag" aria-hidden="true">🇺🇸</span>
          <span class="language-option-name">English</span>
          <span class="language-option-code">ENG</span>
        </button>
      </div>
    `;

    if (actions) {
      const cartLink = actions.querySelector('.header-icon-btn');
      actions.insertBefore(switcher, cartLink || actions.firstChild);
    } else if (dashboardTopbar) {
      dashboardTopbar.appendChild(switcher);
    } else {
      authWrapper.appendChild(switcher);
    }

    const trigger = switcher.querySelector('.language-switcher-trigger');
    const menu = switcher.querySelector('.language-switcher-menu');
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = !menu.hidden;
      menu.hidden = isOpen;
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    switcher.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', () => {
        setLanguage(option.dataset.language);
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (!switcher.contains(event.target)) {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  }

  function updateLanguageSwitcher() {
    document.querySelectorAll('.language-switcher').forEach(switcher => {
      const currentFlag = switcher.querySelector('.language-current-flag');
      const currentCode = switcher.querySelector('.language-current-code');
      if (currentFlag) currentFlag.textContent = language === 'en' ? '🇺🇸' : '🇻🇳';
      if (currentCode) currentCode.textContent = language === 'en' ? 'ENG' : 'VIE';

      switcher.querySelectorAll('.language-option').forEach(option => {
        const selected = option.dataset.language === language;
        option.classList.toggle('active', selected);
        option.setAttribute('aria-current', selected ? 'true' : 'false');
        const label = option.querySelector('.language-option-name');
        if (label) {
          label.textContent = option.dataset.language === 'vi'
            ? (language === 'en' ? 'Vietnamese' : 'Tiếng Việt')
            : 'English';
        }
      });
    });
  }

  function initialize() {
    addAboutNavigationLink();
    createLanguageSwitcher();
    const nativeAlert = window.alert.bind(window);
    const nativePrompt = window.prompt.bind(window);
    window.alert = message => nativeAlert(language === 'en' ? translateText(String(message)) : message);
    window.prompt = (message, defaultValue) => nativePrompt(
      language === 'en' ? translateText(String(message)) : message,
      typeof defaultValue === 'string' && language === 'en' ? translateText(defaultValue) : defaultValue
    );

    observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'attributes') {
          translateAttributes(record.target);
          return;
        }
        if (record.type === 'characterData') {
          translateTextNode(record.target);
          return;
        }
        record.addedNodes.forEach(node => translateSubtree(node));
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt']
    });
    const title = document.querySelector('title');
    if (title) observer.observe(title, { childList: true, subtree: true, characterData: true });

    let preferredLanguage = 'vi';
    try {
      preferredLanguage = localStorage.getItem(STORAGE_KEY) || 'vi';
    } catch (error) {
      console.error('Không thể đọc tùy chọn ngôn ngữ:', error);
    }
    setLanguage(preferredLanguage);
  }

  window.translateUiText = value => language === 'en' ? translateText(value) : value;
  window.setPetCareLanguage = setLanguage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
