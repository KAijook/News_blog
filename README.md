# News Blog Project

Một ứng dụng Web Blog tin tức cá nhân được xây dựng trên nền tảng React và Vite, hỗ trợ tìm kiếm, lọc theo thẻ và quản lý bài viết (Thêm, Sửa, Xóa).

---

##  Công nghệ sử dụng

*   **Frontend Framework:** React (với Vite giúp tối ưu tốc độ build và hot-reload)
*   **Routing:** React Router DOM (Quản lý chuyển trang mượt mà)
*   **Styling:** CSS 

---

##  Kiến trúc & Thiết kế hệ thống

Ứng dụng được thiết kế phân tầng Component rõ ràng với cấu trúc Route thông minh:

*   **Thành phần Layout cố định:** Trong thành phần `App`, tạo một `Navbar` sử dụng thuộc tính `sticky` để cố định ở phía trên cùng của màn hình khi cuộn trang, đi kèm với vùng chứa `Routes`.
*   **Cấu trúc Routing (Nested Routes):**
    *   Tạo 1 **Route cha**: Danh sách bài viết (Home / Blog).
    *   Bên trong chứa các **Route con**:
        *   Hiển thị danh sách toàn bộ bài viết.
        *   Xem chi tiết từng bài viết (`/post/:id`).
*   **Giao diện Grid:** Danh sách bài viết ngoài trang chủ được thiết kế theo dạng lưới, chia đều **3 bài viết trên mỗi hàng** (Responsive trên màn hình máy tính).

---

##  Thành phần chính trong Giao diện

### 1. Trang chủ (Home / Blog List)
*   **Header / Navbar:**
    *   Logo thương hiệu.
    *   Thanh Menu điều hướng.
    *   Thông tin Contact & About.
    *   Thanh tìm kiếm (Search).
    *   Bộ nút bấm phân loại theo thẻ (Tag buttons).
*   **Danh sách bài viết (Mỗi bài viết gồm):**
    *   Ảnh thu nhỏ (Thumbnail).
    *   Tiêu đề bài viết (Title).
    *   Mô tả ngắn gọn (Short Description).
    *   Danh sách các thẻ phân loại (Tags).
    *   Ngày đăng bài.

### 2. Trang chi tiết bài viết (Post Detail)
Giao diện tập trung vào trải nghiệm đọc nội dung của người dùng, bao gồm:
*   Tiêu đề chính của bài viết.
*   Ảnh bìa kích thước lớn (Cover Image).
*   Thông tin tác giả & Ngày đăng.
*   Nội dung chính chi tiết (Main Content).

---

## ⚡ Các chức năng cốt lõi

*   🔍 **Tìm kiếm nâng cao:** Tìm kiếm bài viết linh hoạt theo tên bài viết hoặc theo ngày đăng.
*   🏷️ **Bộ lọc thông minh:** Lọc danh sách bài viết theo các Thẻ (Filter tags).

---

## 🛠️ Hướng dẫn cài đặt và Chạy ứng dụng dưới máy cục bộ (Local)

Để chạy dự án này, máy tính của bạn cần được cài đặt sẵn [Node.js](https://nodejs.org/) (Khuyên dùng phiên bản LTS).

### 1. Tải mã nguồn về máy

2. Cài đặt các gói thư viện phụ thuộc (Dependencies)
Chạy lệnh sau để tải các package cần thiết được khai báo trong package.json:

Bash
npm install
(Hoặc yarn install / pnpm install nếu bạn dùng các trình quản lý gói khác).

3. Chạy ứng dụng ở chế độ Phát triển (Development Mode)
Sau khi cài đặt xong, khởi động server local bằng lệnh:

Bash
npm run dev
Sau khi chạy lệnh, Terminal sẽ hiển thị một đường dẫn cục bộ (thường là http://localhost:5173). Bạn chỉ cần giữ phím Ctrl và click vào liên kết đó hoặc copy dán vào trình duyệt để xem dự án hoạt động.

4. Build dự án để triển khai (Production)
Khi dự án đã hoàn thiện và muốn đóng gói để upload lên các nền tảng hosting (Vercel, Netlify...):

Bash
npm run build


