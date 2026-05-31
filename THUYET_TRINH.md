# Kịch bản thuyết trình & Hỏi đáp — SmartEnglish

## A. Giới thiệu nhanh (30 giây)
> "Nhóm em làm **SmartEnglish – ứng dụng học tiếng Anh cá nhân hóa bằng AI**. Hệ thống gồm **backend Django REST API** + **frontend React**, dữ liệu lưu trong **PostgreSQL**, và tích hợp **AI Google Gemini** cho 4 kỹ năng: Nghe, Đọc, Nói, Viết."

## B. Kịch bản DEMO (theo thứ tự bấm)
1. **Đăng nhập** → vào Dashboard (giải thích: token JWT lưu ở trình duyệt).
2. **Reading** → chọn 1 bài → đọc → làm quiz → **Nộp**: hệ thống chấm điểm + **AI giải thích vì sao đáp án đúng, trích dẫn câu trong bài**.
3. **Listening** → chọn bài → **bấm play** (giọng đọc từ Google TTS) → làm quiz.
4. **Speaking (chấm)** → chọn Part/chủ đề → **ghi âm** → AI chuyển giọng nói thành chữ + chấm 4 tiêu chí IELTS.
5. **Speaking Chat** → **gõ hội thoại với giám khảo AI** → AI trả lời + **sửa lỗi ngữ pháp ngay lập tức** (demo: gõ câu sai như *"I goes to school everyday"*).
6. **Summarize** → dán 1 đoạn báo tiếng Anh → AI **tóm tắt + liệt kê 10 từ vựng** kèm nghĩa.
7. **Writing** → dán 1 đoạn văn → AI **chấm 4 tiêu chí IELTS + sửa lỗi chi tiết**.
8. **Grammar** → gõ câu → AI sửa ngữ pháp tức thì.
9. **Admin Panel** (đăng nhập tài khoản admin) → demo **CRUD**: thêm/sửa/xóa bài học, quản lý người dùng, xem thống kê.

> Mẹo: nếu deploy trên Render Free, **mở web trước 1 phút** để server "thức dậy" (tránh chờ cold start khi demo).

---

## C. Trả lời các câu hỏi giảng viên thường hỏi

### C1. "Database PostgreSQL nằm ở đâu? Có tải về máy theo dõi không?"
- **Local**: PostgreSQL chạy như một service trên máy (port 5432), database tên `smartenglish_db`. Em dùng **pgAdmin 4** (công cụ chính thức của PostgreSQL) để xem trực tiếp các bảng, dữ liệu.
- **Cách kết nối pgAdmin** (local):
  - Host: `localhost` — Port: `5432`
  - Database: `smartenglish_db` — User: `smartenglish_user` — Password: `smart123`
- **Production**: database đặt trên **Neon** (PostgreSQL cloud). Vẫn dùng pgAdmin để kết nối từ xa bằng chuỗi `DATABASE_URL` mà Neon cấp.
- **Bằng chứng dữ liệu thật**: mở pgAdmin → bảng `lessons_lesson`, `accounts_userprofile`, `speaking_speakingtopic`... thấy đúng các bản ghi đang hiển thị trên web → chứng minh KHÔNG dùng SQLite.

### C2. "Làm tới đâu rồi?"
- Hoàn thiện **đủ 4 tính năng AI bắt buộc** + nhiều tính năng phụ (chatbot hội thoại, kiểm tra ngữ pháp, quiz có giải thích).
- Có **đăng nhập/đăng ký (JWT)**, **quản lý tiến độ học**, **đa ngôn ngữ Anh/Việt**.
- Có **trang Admin CRUD** đầy đủ (người dùng, bài học, chủ đề Speaking) + thống kê.
- Nội dung: ~18 bài học (Đọc/Nghe nhiều chủ đề, 3 cấp độ) + 12 chủ đề Speaking.
- Đã cấu hình **deploy lên web** (Render + Neon + Vercel).

### C3. "Mô tả cách Frontend kết nối Backend (gộp thành 1 chương trình hoàn chỉnh)?"
Đây là kiến trúc **client–server tách rời**, giao tiếp qua **REST API (JSON)**:
1. Người dùng thao tác trên giao diện **React**.
2. React gọi API qua thư viện **axios** (file `services/api.js`), tự đính kèm **JWT token** vào header.
3. **Django** nhận request, định tuyến trong `urls.py` tới đúng **View**.
4. **View** xử lý logic, gọi **AI (Gemini)** nếu cần.
5. **Model** truy vấn **PostgreSQL**.
6. **Serializer** chuyển dữ liệu thành **JSON**.
7. Django trả **response JSON** về.
8. React nhận dữ liệu và **render giao diện**.
- **CORS**: backend chỉ cho phép domain frontend gọi vào (cấu hình `CORS_ALLOWED_ORIGINS`).
- Khi deploy: frontend (Vercel) gọi tới backend (Render) qua biến `VITE_API_URL`.

### C4. "Dùng Django thì khác gì? (so với cách khác)"
- Django theo mô hình **MVT** = tương đương **MVC**:
  - **Model** = lớp định nghĩa bảng DB (`models.py`).
  - **View của Django** = **Controller** (xử lý logic — `views.py`).
  - **Template** = phần hiển thị — ở đây em tách ra dùng **React** thay cho template Django.
- Ưu điểm Django: có sẵn **ORM** (không cần viết SQL thủ công), **admin site**, **hệ thống auth**, **migration** quản lý thay đổi DB an toàn.
- So với code thuần (vd PHP/JSP): Django giúp **viết nhanh, an toàn hơn** (chống SQL injection, CSRF...), code có cấu trúc rõ ràng theo app.

### C5. "Giới hạn PostgreSQL: 1 trường tối đa bao nhiêu ký tự?"
- `VARCHAR(n)` (CharField trong Django): n tối đa **10,485,760 ký tự** (~10 triệu).
- `TEXT` (TextField trong Django): không giới hạn độ dài khai báo, nhưng **1 giá trị tối đa ~1 GB**.
- Trong project: dùng `CharField(max_length=255)` cho tiêu đề ngắn, `TextField` cho nội dung dài (bài đọc, transcript, feedback AI).

### C6. "CRUD có chưa?"
Có đầy đủ trong **Admin Panel** (qua REST API):
- **Create/Read/Update/Delete** cho: Người dùng, Bài học (Lesson + câu hỏi), Chủ đề Speaking.
- Ngoài ra Django còn có sẵn **Django Admin** (`/admin/`) — một giao diện CRUD chuẩn cho mọi bảng.

### C7. "Có khó khăn gì không?"
Một vài điểm đã xử lý:
- **Xử lý audio ghi âm**: trình duyệt ghi ở định dạng `webm`, phải chuyển sang `wav` (dùng pydub) trước khi nhận diện giọng nói.
- **Phản hồi AI dạng JSON**: đôi khi AI trả kèm markdown ```` ```json ```` → đã viết hàm bóc tách JSON an toàn.
- **Giới hạn rate limit của Gemini (free)**: đã bắt lỗi 429 và báo người dùng thử lại.
- **Deploy**: phải tách biến môi trường (DB, API key) ra khỏi code; cấu hình CORS để FE–BE nói chuyện được.

---

## D. Bảng đối chiếu yêu cầu đề
| Yêu cầu đề | Đáp ứng |
|---|---|
| Project Django | ✅ |
| Không SQLite → PostgreSQL | ✅ |
| Mô hình MVC/MVT | ✅ |
| 4 tính năng AI (Speaking/Pronunciation/Summarize/Writing) | ✅ |
| Gọi API mô hình ngôn ngữ lớn | ✅ Gemini |
| CRUD | ✅ Admin Panel + Django Admin |
| Deploy lên web | ✅ (Render + Neon + Vercel) |
| OOP, Exception, tương tác CSDL, HTML/CSS/JS | ✅ thể hiện trong code |

## E. Cấu trúc code (nói ngắn)
- `backend/` — Django: chia thành các **app** theo chức năng (`accounts`, `lessons`, `speaking`) + module `ai_services` gọi AI.
- `english-learning-hub/` — React: chia theo `pages/` (mỗi tính năng 1 trang), `services/api.js` (gọi API), `layouts/` (khung giao diện).
- Xem chi tiết ở file **CAU_TRUC_DU_AN.md**.
