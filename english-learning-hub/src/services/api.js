import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm Token vào Header nếu đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự động refresh token khi bị 401 (bỏ qua cho login/register)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // Không refresh token cho login/register requests
    const isAuthRequest = url.includes('/token') || url.includes('/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
          localStorage.setItem('accessToken', res.data.access);
          if (res.data.refresh) {
            localStorage.setItem('refreshToken', res.data.refresh);
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Xác thực
export const authAPI = {
  login: (username, password) => api.post('/token/', { username, password }),
  register: (data) => api.post('/register/', data),
  changePassword: (current_password, new_password) => api.post('/change-password/', { current_password, new_password }),
  forgotPassword: (username, email) => api.post('/forgot-password/', { username, email }),
  resetPassword: (token, new_password) => api.post('/reset-password/', { token, new_password }),
};

// API Bài học
export const lessonAPI = {
  getRecommended: () => api.get('/lessons/'),
  getByType: (type) => api.get(`/lessons/?type=${type}`),
  getDetail: (id) => api.get(`/lessons/${id}/`),
  submitAnswers: (lessonId, answers) => api.post(`/lessons/${lessonId}/submit/`, { answers }),
};

// API Speaking
export const speakingAPI = {
  getTopics: () => api.get('/speaking/topics/'),
  uploadAudio: (audioBlob, topicId) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    if (topicId) formData.append('topic_id', topicId);
    return api.post('/speaking/analyze/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// API AI Features
export const aiAPI = {
  summarizeText: (text) => api.post('/ai/summarize/', { text }),
  assessWriting: (essay, topic) => api.post('/ai/writing-assess/', { essay, topic }),
  grammarCheck: (text) => api.post('/ai/grammar-check/', { text }),
};

// API Progress
export const progressAPI = {
  getAll: () => api.get('/progress/'),
};

// API Profile
export const profileAPI = {
  get: () => api.get('/profile/'),
  update: (data) => api.put('/profile/', data),
};

// ─── Admin APIs ───
export const adminAPI = {
  // Stats
  getStats: () => api.get('/admin/stats/'),
  // Users CRUD
  getUsers: (params) => api.get('/admin/users/', { params }),
  getUser: (id) => api.get(`/admin/users/${id}/`),
  updateUser: (id, data) => api.put(`/admin/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
  // Lessons CRUD
  getLessons: (params) => api.get('/admin/lessons/', { params }),
  getLesson: (id) => api.get(`/admin/lessons/${id}/`),
  createLesson: (data) => api.post('/admin/lessons/', data),
  updateLesson: (id, data) => api.put(`/admin/lessons/${id}/`, data),
  deleteLesson: (id) => api.delete(`/admin/lessons/${id}/`),
  // Speaking Topics CRUD
  getTopics: () => api.get('/admin/topics/'),
  createTopic: (data) => api.post('/admin/topics/', data),
  updateTopic: (id, data) => api.put(`/admin/topics/${id}/`, data),
  deleteTopic: (id) => api.delete(`/admin/topics/${id}/`),
};

export default api;
