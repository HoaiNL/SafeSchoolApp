# SafeSchoolApp 🛡️

**Thời gian phát triển:** 08/2026  
**Công nghệ sử dụng:** C# ASP.NET Core MVC (.NET 9), Entity Framework Core, JavaScript (AJAX AI Chatbot), HTML5/CSS3 (Glassmorphism UI), Node.js Web Server  
**Live Demo Trực tuyến:** [https://hoainl.github.io/SafeSchoolApp/](https://hoainl.github.io/SafeSchoolApp/)

---

## 🌟 Giới thiệu
**SafeSchool (Trường Học An Toàn)** là nền tảng website hỗ trợ nạn nhân bắt nạt học đường hàng đầu Việt Nam.  
Hệ thống cung cấp giải pháp **Báo cáo ẩn danh 100%**, kết nối đường dây nóng khẩn cấp (**111 / 113 / 115**), tích hợp **AI Support Trợ lý Tâm lý & Khẩn cấp 24/7**, **Diễn đàn học đường** chia sẻ tâm sự ẩn danh, cùng **Cẩm nang kỹ năng tự vệ & tư vấn pháp lý**.

---

## 🌐 Live Demo Trực Tuyến 24/7
👉 **Truy cập dùng thử trực tiếp (Không cần cài đặt hay run local):**  
🔗 **[https://hoainl.github.io/SafeSchoolApp/](https://hoainl.github.io/SafeSchoolApp/)**

---

## 🔑 Chức năng chính

### 👤 Học sinh / Người bị bắt nạt & Phụ huynh
- **Báo cáo bắt nạt ẩn danh:** Bảo mật danh tính 100%, che giấu thông tin cá nhân và địa chỉ IP. Tự động cấp **Mã Tra Cứu Bí Mật** (Ví dụ: `SS-89A12B`) để theo dõi tiến độ xử lý an toàn.
- **Hotline Khẩn cấp 1-Tap:** Thanh Header cố định (Sticky Top Bar) kết nối trực tiếp Tổng đài Quốc gia Bảo vệ Trẻ em **111**, Cảnh sát **113**, Cấp cứu **115**.
- **AI Support Trợ lý Khẩn cấp & Tâm lý 24/7:** Floating Action Button tư vấn giải tỏa stress, hướng dẫn quy trình ứng phó khẩn cấp và cung cấp kiến thức pháp lý theo Luật Trẻ em 2016.
- **Diễn đàn học đường (Forum):** Đăng bài chia sẻ tâm sự ẩn danh, tương tác thả tim và nhận lời khuyên động viên từ cộng đồng.
- **Tin tức & Kỹ năng tự vệ:** Cung cấp các bài viết hướng dẫn phòng vệ thể xác, xử lý bắt nạt trên không gian mạng (Cyberbullying) và pháp lý học đường.
- **Đăng nhập đa phương thức:** Hỗ trợ đăng nhập qua Số điện thoại + Mật khẩu, Tên tài khoản (Username), hoặc Đăng nhập nhanh Google / Gmail.

---

### 🏫 Nhà trường / Ban tư vấn / Admin
- **Quản lý & Tiếp nhận đơn báo cáo:** Xử lý và minh xác đơn báo cáo khẩn cấp từ học sinh dựa trên Mã Tra Cứu.
- **Quản lý diễn đàn & Bài viết:** Kiểm duyệt nội dung thảo luận, quản lý bài viết kỹ năng và thông tin an toàn học đường.

---

## ⚙️ Công nghệ sử dụng
- **Backend:** C# ASP.NET Core 9 MVC, Dependency Injection (DI), Session & Cookie Auth, RESTful API Controllers.
- **Frontend:** Modern HTML5, CSS3 (Glassmorphism, Vibrant Colors, Responsive Grid), Vanilla JavaScript (AJAX Chatbot & Auth Modal).
- **Architecture:** Separation of Concerns (Models, Data Transfer Objects - DTOs, Services, Repositories, Controllers, Views).
- **Dev Runner:** Tích hợp `server.js` (Node.js runner) để xem trước trực quan live tức thì.

---

## ⚡ Hướng dẫn chạy dự án tại máy Local

### Cách 1: Chạy trực tiếp bằng C# .NET SDK
```bash
cd H:\SafeSchoolApp
dotnet run
```

### Cách 2: Chạy xem trước trực quan bằng Node.js Server
```bash
cd H:\SafeSchoolApp
node server.js
```
Truy cập tại địa chỉ local: **http://localhost:5050**
