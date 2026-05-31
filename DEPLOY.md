# Hướng dẫn Deploy SmartEnglish lên web (miễn phí)

Kiến trúc deploy:
- **Database**: PostgreSQL trên **Neon** (https://neon.tech) — free, không hết hạn.
- **Backend Django**: **Render** (https://render.com) — free web service.
- **Frontend React**: **Vercel** (https://vercel.com) — free.

> Thứ tự bắt buộc: **DB (Neon) → Backend (Render) → Frontend (Vercel)**, vì mỗi bước sau cần URL của bước trước.

---

## BƯỚC 0 — Chuẩn bị (đẩy code lên GitHub)
1. Tạo repo trên GitHub (ví dụ `smartenglish`).
2. Trong thư mục `smartEnglish/`:
   ```bash
   git add .
   git commit -m "Chuan bi deploy: cau hinh production"
   git branch -M main
   git remote add origin https://github.com/<tentaikhoan>/smartenglish.git
   git push -u origin main
   ```
3. Kiểm tra trên GitHub: phải thấy thư mục `backend/media/lesson_audio/` có các file mp3 (nhờ đã sửa `.gitignore`). Nếu chưa thấy, chạy:
   ```bash
   git add -f backend/media/lesson_audio/
   git commit -m "Them audio bai nghe" && git push
   ```

---

## BƯỚC 1 — Tạo Database trên Neon
1. Đăng nhập https://neon.tech (bằng GitHub).
2. **Create Project** → đặt tên `smartenglish` → Region chọn Singapore (gần VN nhất).
3. Vào **Dashboard → Connection string** → chọn **Pooled connection** → copy chuỗi dạng:
   ```
   postgresql://user:password@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   👉 **Lưu lại chuỗi này**, đó chính là `DATABASE_URL`.

---

## BƯỚC 2 — Deploy Backend lên Render
1. Đăng nhập https://render.com (bằng GitHub).
2. **New → Web Service** → chọn repo `smartenglish`.
3. Điền cấu hình:
   | Mục | Giá trị |
   |-----|---------|
   | Name | `smartenglish-backend` |
   | Region | Singapore |
   | Root Directory | `backend` |
   | Runtime | Python 3 |
   | Build Command | `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate` |
   | Start Command | `gunicorn smartenglish.wsgi:application` |
   | Instance Type | **Free** |

4. Bấm **Advanced → Add Environment Variable**, thêm:
   | Key | Value |
   |-----|-------|
   | `SECRET_KEY` | một chuỗi ngẫu nhiên dài (tự gõ) |
   | `DEBUG` | `False` |
   | `DATABASE_URL` | chuỗi Neon ở Bước 1 |
   | `GEMINI_API_KEY` | khóa Gemini của bạn |
   | `PYTHON_VERSION` | `3.12.7` |
   | `FRONTEND_ORIGINS` | (để trống, điền sau khi có domain Vercel ở Bước 3) |

5. **Create Web Service**. Render sẽ build (~3-5 phút). Khi xong, backend chạy tại:
   ```
   https://smartenglish-backend.onrender.com
   ```
   Kiểm tra: mở `https://smartenglish-backend.onrender.com/api/lessons/` → phải báo `Authentication credentials were not provided` (đúng — nghĩa là API sống, chỉ chưa đăng nhập).

6. **Tạo dữ liệu mẫu + tài khoản admin** (DB Neon đang trống):
   - Vào Render → service → tab **Shell**, chạy:
     ```bash
     python manage.py createsuperuser              # tạo admin cho Django Admin
     python manage.py shell < seed_data.py         # bài học cơ bản + câu hỏi
     python manage.py shell < seed_more.py         # thêm bài đọc/nghe
     python manage.py shell < seed_extra.py        # bài & chủ đề đa dạng hơn
     python manage.py shell < seed_library.py      # +12 bài (đủ nội dung cho phân trang)
     python manage.py shell < seed_speaking.py     # 12 chủ đề Speaking
     python manage.py generate_audio               # sinh audio TTS cho mọi bài nghe
     ```
   > Nếu tab Shell không có ở gói Free: tạm để `DEBUG=True`, chạy seed từ máy local nhưng trỏ `DATABASE_URL` về Neon (đặt biến trong `.env` local rồi chạy `python seed_data.py`), sau đó đổi lại `DEBUG=False` trên Render.

> ⚠️ **Lưu ý gói Free Render**: server "ngủ" sau 15 phút không dùng → request đầu tiên chậm ~30-50s (cold start). Khi demo nên mở trước 1 phút cho server thức dậy.

---

## BƯỚC 3 — Deploy Frontend lên Vercel
1. Đăng nhập https://vercel.com (bằng GitHub).
2. **Add New → Project** → chọn repo `smartenglish`.
3. Cấu hình:
   | Mục | Giá trị |
   |-----|---------|
   | Root Directory | `english-learning-hub` |
   | Framework Preset | Vite (tự nhận) |
   | Build Command | `npm run build` (mặc định) |
   | Output Directory | `dist` (mặc định) |
4. **Environment Variables** → thêm:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://smartenglish-backend.onrender.com/api` |
5. **Deploy**. Xong sẽ có domain dạng:
   ```
   https://smartenglish-xxxx.vercel.app
   ```

---

## BƯỚC 4 — Nối FE ↔ BE (cập nhật CORS)
1. Quay lại **Render → smartenglish-backend → Environment**.
2. Sửa biến `FRONTEND_ORIGINS` =
   ```
   https://smartenglish-xxxx.vercel.app
   ```
   (đúng domain Vercel ở Bước 3, KHÔNG có dấu `/` ở cuối).
3. **Save** → Render tự deploy lại. Xong là frontend gọi được backend.

---

## BƯỚC 5 — Kiểm tra cuối
- Mở domain Vercel → Đăng ký tài khoản mới → Đăng nhập.
- Thử 4 tính năng AI: Speaking, Writing, Summarize, Grammar.
- Vào Django Admin: `https://smartenglish-backend.onrender.com/admin/` (login bằng superuser).

---

## Tóm tắt biến môi trường

**Render (backend):**
```
SECRET_KEY=<chuỗi ngẫu nhiên>
DEBUG=False
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
GEMINI_API_KEY=<khóa Gemini>
PYTHON_VERSION=3.12.7
FRONTEND_ORIGINS=https://smartenglish-xxxx.vercel.app
```

**Vercel (frontend):**
```
VITE_API_URL=https://smartenglish-backend.onrender.com/api
```

---

## Sự cố thường gặp
| Lỗi | Nguyên nhân & cách sửa |
|-----|------------------------|
| CORS error trên Console | `FRONTEND_ORIGINS` sai domain hoặc còn dấu `/` cuối. Sửa lại đúng. |
| 400 Bad Request / DisallowedHost | Thiếu host. Render tự thêm `RENDER_EXTERNAL_HOSTNAME` rồi, nhưng nếu dùng domain riêng thì thêm vào `ALLOWED_HOSTS`. |
| Audio bài nghe 404 | File mp3 chưa được push (xem Bước 0.3). |
| Request đầu rất chậm | Cold start gói Free — bình thường. |
| File ghi âm Speaking mất sau vài giờ | Đĩa Render là tạm thời. Chấp nhận được cho demo; muốn bền thì dùng Cloudinary/S3. |
| Build lỗi `psycopg2` | Đảm bảo `PYTHON_VERSION=3.12.7` (Python 3.14 chưa có wheel ổn định). |
