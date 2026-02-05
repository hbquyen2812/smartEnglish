import axios from 'axios';

// Đảm bảo URL này đúng với cổng Django đang chạy
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm Token vào Header nếu đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Thường Django trả về access/refresh
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Xác thực
export const authAPI = {
  login: (username, password) => api.post('/token/', { username, password }), // Django SimpleJWT thường dùng /token/
  register: (data) => api.post('/register/', data), // Endpoint đăng ký bạn tự định nghĩa bên Django
};

// API Bài học
export const lessonAPI = {
  // Lấy danh sách bài học gợi ý (hoặc tất cả bài học)
  getRecommended: () => api.get('/lessons/'), 
  
  // Lấy chi tiết bài học
  getDetail: (id) => api.get(`/lessons/${id}/`),
};

// API Speaking (nếu có)
export const speakingAPI = {
  uploadAudio: (audioBlob, topicId) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('topic_id', topicId);
    return api.post('/speaking/analyze/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;