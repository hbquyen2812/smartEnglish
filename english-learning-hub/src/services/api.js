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

// API Xác thực
export const authAPI = {
  login: (username, password) => api.post('/token/', { username, password }),
  register: (data) => api.post('/register/', data),
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

export default api;
