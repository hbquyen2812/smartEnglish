#!/usr/bin/env bash
# Script Render chạy khi build backend (Build Command).
# Dừng ngay nếu có lỗi.
set -o errexit

# 1. Cài thư viện Python
pip install -r requirements.txt

# 2. Gom toàn bộ file static (CSS/JS của Django Admin) về thư mục staticfiles/
python manage.py collectstatic --no-input

# 3. Tạo / cập nhật bảng trong PostgreSQL
python manage.py migrate
