import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import CourseList from './pages/course/CourseList';
import LessonDetail from './pages/course/LessonDetail';
import SpeakingAI from './pages/speaking/SpeakingAI';
import GrammarCheck from './pages/grammar/GrammarCheck';
import WritingAssess from './pages/writing/WritingAssess';
import ReadingSummarize from './pages/summarize/ReadingSummarize';
import ProgressPage from './pages/progress/ProgressPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />

        <Route path="listening" element={<CourseList type="listening" />} />
        <Route path="listening/:id" element={<LessonDetail type="listening" />} />

        <Route path="reading" element={<CourseList type="reading" />} />
        <Route path="reading/:id" element={<LessonDetail type="reading" />} />

        <Route path="speaking" element={<SpeakingAI />} />
        <Route path="grammar" element={<GrammarCheck />} />
        <Route path="writing" element={<WritingAssess />} />
        <Route path="summarize" element={<ReadingSummarize />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
