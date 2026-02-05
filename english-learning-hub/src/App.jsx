import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; // Import trang Register mới

// Các trang chức năng con (đảm bảo import đúng đường dẫn UI bên trong các file này nếu có sửa)
import CourseList from './pages/course/CourseList';
import LessonDetail from './pages/course/LessonDetail';
import SpeakingAI from './pages/speaking/SpeakingAI';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      {/* Route cho trang đăng ký */}
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        
        <Route path="listening" element={<CourseList type="listening" />} />
        <Route path="listening/:id" element={<LessonDetail type="listening" />} />
        
        <Route path="reading" element={<CourseList type="reading" />} />
        <Route path="reading/:id" element={<LessonDetail type="reading" />} />
        
        <Route path="speaking" element={<SpeakingAI />} />
        
        <Route path="grammar" element={<div className="p-10 text-center">Grammar Page</div>} />
        <Route path="progress" element={<div className="p-10 text-center">My Progress Page</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;