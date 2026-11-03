# Class Deadline Hub — Cổng Thông Tin Deadline Lớp Học (PTIT)
---

## 1. Giới thiệu dự án

**Class Deadline Hub** là cổng web thông tin deadline cho sinh viên lớp học Học viện Công nghệ Bưu chính Viễn thông (PTIT). 
Hệ thống kết hợp các kiến thức chuyên sâu của **Buổi 7** (Kiến trúc Rendering: SSG, ISR, SSR, Nested Layouts, Streaming) và **Buổi 8** (Xác thực NextAuth v5, Middleware, phân quyền RBAC đa lớp, SEO nâng cao, Dynamic OG Images và Structured Data JSON-LD).

### Tính năng chính:
- **Xem công khai (Guest):** Tra cứu danh sách deadline, môn học, bộ lọc tìm kiếm theo từ khoá và mức độ ưu tiên.
- **Tiến độ cá nhân (Sinh viên - User):** Đăng nhập an toàn để theo dõi tiến độ nộp bài, đánh dấu deadline đã hoàn thành (kèm thống kê trực quan).
- **Quản trị lớp (Lớp trưởng - Admin):** Thêm mới deadline (validate qua Zod schema) và xoá deadline, kích hoạt cơ chế On-demand ISR để cập nhật dữ liệu ngay lập tức.
- **Đếm ngược thời gian thực:** Component hiển thị đếm ngược trực quan *"Còn X ngày Y giờ"* hoặc *"Quá hạn Z ngày"*.
- **Tối ưu SEO:** Tự động sinh `sitemap.xml`, `robots.txt`, Breadcrumb Structured Data (JSON-LD) và ảnh chia sẻ mạng xã hội động (Dynamic Open Graph Image 1200x630).

---

## 2. Tài khoản kiểm thử mặc định

| Email | Mật khẩu | Vai trò (Role) | Mô tả quyền hạn |
| :--- | :--- | :--- | :--- |
| `admin@ptit.edu.vn` | `admin123` | `admin` | Lớp trưởng: Toàn quyền xem, đánh dấu hoàn thành, tạo mới và xoá deadline. |
| `sv@ptit.edu.vn` | `sv123456` | `user` | Sinh viên: Xem deadline công khai và đánh dấu đã hoàn thành bài tập của mình. |

*(Tại màn hình `/login` có sẵn 2 nút click để tự động điền nhanh tài khoản kiểm thử).*

---

## 3. Hướng dẫn cài đặt và khởi chạy

### Yêu cầu môi trường:
- Node.js version 20+ LTS
- npm hoặc yarn / pnpm

### Các bước khởi chạy:

1. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường (`.env.local`):**
   ```env
   AUTH_SECRET=class-deadline-hub-ptit-jwt-secret-key-2026-very-secure
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Khởi chạy môi trường phát triển (Dev):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

4. **Chạy Unit Test (Kiểm thử Jest cho hàm phân quyền `can`):**
   ```bash
   npm test
   ```

5. **Build và chạy môi trường Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 4. Kết quả Build Production & Phân tích Chiến lược Rendering

### Bảng kết quả chạy `npm run build`:

```text
Route (app)                                 Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /403
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /dashboard
├ ○ /deadlines                                      1m      1y
├   /deadlines/[id]
│ ├ ● /deadlines/1
│ ├ ● /deadlines/2
│ ├ ● /deadlines/3
│ └ ● [+9 more paths]
├ ƒ /deadlines/[id]/opengraph-image-104vc5
├ ○ /login
├ ○ /robots.txt
├ ○ /sitemap.xml
└   /subjects/[slug]
  ├ ● /subjects/lap-trinh-web-nang-cao
  ├ ● /subjects/an-toan-thong-tin
  ├ ● /subjects/kien-truc-phan-mem
  └ ● /subjects/tri-tue-nhan-tao

ƒ Proxy (Middleware)

○  (Static)   prerendered as static content (SSG)
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand (SSR)
```

### Bảng giải thích lý do lựa chọn chiến lược cho từng Route:

| Route | Quyền truy cập | Ký hiệu Build | Chiến lược Render | Lý do lựa chọn chiến lược |
| :--- | :--- | :---: | :--- | :--- |
| `/` | Mọi người | `○ (Static)` | **SSG** | Trang chủ giới thiệu lớp và danh sách 4 môn học hiếm khi thay đổi. Dựng sẵn HTML tĩnh lúc build để tải tức thì, giảm tải tối đa cho server và phục vụ nhanh qua CDN. |
| `/subjects/[slug]` | Mọi người | `● (SSG)` | **SSG** | 4 môn học của kỳ cố định. Dùng `generateStaticParams()` sinh sẵn toàn bộ file HTML lúc build. Tối ưu SEO và truy cập cực nhanh. |
| `/deadlines` | Mọi người | `○ (1m)` | **ISR (60 giây)** | Danh sách tổng hợp deadline cần người dùng xem nhanh nhưng vẫn tự động cập nhật định kỳ. Với `revalidate: 60`, server tự động tái tạo nền sau mỗi 60 giây khi có request mới mà không cần re-build toàn bộ site. |
| `/deadlines/[id]` | Mọi người | `● (SSG)` | **ISR (On-demand)** | Trang chi tiết bài tập được sinh trước bằng `generateStaticParams()`. Khi Admin thêm/xoá deadline, Server Action gọi `revalidatePath('/deadlines/[id]')` để xoá cache cũ và render dữ liệu mới ngay tức thì. |
| `/dashboard` | Đã đăng nhập | `ƒ (Dynamic)` | **SSR** | Nội dung phụ thuộc chặt chẽ vào cookie phiên (`Session`) của từng sinh viên (danh sách bài tập đã nộp, chưa nộp riêng biệt). Bắt buộc phải render trên server ở mỗi request để đảm bảo bảo mật và tính cá nhân hóa. |
| `/admin` | Chỉ Admin | `ƒ (Dynamic)` | **SSR** | Trang quản trị đặc thù chỉ dành riêng cho Lớp trưởng. Phải luôn kiểm tra quyền quản trị mới nhất từ session server và hiển thị bảng dữ liệu thời gian thực. |

---

## 5. Trả lời câu hỏi lý thuyết (Bắt buộc theo Đề bài)

### Câu hỏi 1: Vì sao `/deadlines/[id]` dùng ISR?

**Trả lời:**
1. **Tốc độ phản hồi và Tối ưu SEO:** Trang chi tiết deadline là trang công khai mà sinh viên thường xuyên chia sẻ cho nhau và bot tìm kiếm (Googlebot, Facebook Crawler) ghé thăm. Dùng **ISR** cho phép trang được lưu cache dạng file HTML tĩnh trên CDN/Edge Server, giúp người dùng thấy nội dung ngay lập tức (LCP < 1s) và crawler luôn đọc được đầy đủ thẻ meta, ảnh xem trước mà không phải đợi server tính toán.
2. **Khắc phục nhược điểm của SSG thuần tuý:** Nếu chỉ dùng SSG thuần tuý, mỗi khi Lớp trưởng (Admin) cập nhật thời hạn hoặc thêm/xoá deadline, toàn bộ website sẽ phải trải qua quá trình build lại (`npm run build`), gây tốn thời gian và lãng phí tài nguyên.
3. **Cập nhật tức thì với On-demand Revalidation:** Nhờ kết hợp ISR với hàm `revalidatePath('/deadlines/[id]')` trong Server Action, ngay khi Admin thực hiện thao tác Thêm hoặc Xoá deadline, cache của trang chi tiết đó sẽ được làm mới ngay lập tức mà vẫn giữ trọn vẹn ưu điểm tốc độ của trang tĩnh.

---

### Câu hỏi 2: Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?

**Trả lời:**
Nếu chỉ dựa duy nhất vào Middleware để bảo vệ khu vực quản trị thì hệ thống tiềm ẩn **3 rủi ro bảo mật nghiêm trọng**:

1. **Rủi ro cấu hình sai hoặc bypass URL (Config Leak):** Middleware sử dụng cấu hình so khớp đường dẫn (`matcher`). Nếu lập trình viên cấu hình matcher sót (ví dụ chỉ match `/admin` mà quên `/admin/settings` hoặc có các đường dẫn URL rewrite/encode lắt léo), request có thể lọt qua Middleware và truy cập thẳng vào trang mà không bị chặn.
2. **Server Action và API Route bị gọi trực tiếp (Broken Object Level Authorization):** Trong Next.js App Router, các Server Action thực chất là các HTTP POST endpoint công khai độc lập. Một người dùng bình thường hoặc kẻ xấu hoàn toàn có thể gửi trực tiếp POST request với payload chứa action `deleteDeadlineAction(id)` mà không cần đi qua trang giao diện `/admin`. Nếu Server Action không tự kiểm tra quyền của phiên (`auth()`), kẻ xấu có thể xoá toàn bộ dữ liệu của lớp.
3. **Giới hạn môi trường Edge Runtime:** Middleware chạy trên Edge Runtime với các tập API tối giản (không thể truy vấn trực tiếp database, không thể kiểm tra sâu các ràng buộc nghiệp vụ phức tạp).

**=> Giải pháp chuẩn mực (Defense in Depth — Bảo vệ đa lớp):**
- **Lớp 1 (Middleware):** Chặn sớm ở cửa ngõ, điều hướng người dùng chưa đăng nhập về `/login` và người dùng sai quyền về `/403`.
- **Lớp 2 (Server Component Page):** Trang `/admin/page.tsx` tự gọi `auth()` và hàm `can(session.user.role, 'create_deadline')` để từ chối render dữ liệu nhạy cảm nếu không đủ quyền.
- **Lớp 3 (Server Actions):** Mọi thao tác Ghi/Xoá trong `lib/actions.ts` đều kiểm tra lại quyền qua `can()` và kiểm tra tính hợp lệ của dữ liệu đầu vào qua schema validation (**Zod**).

---

## 6. Đo kiểm SEO, Lighthouse & View Source

