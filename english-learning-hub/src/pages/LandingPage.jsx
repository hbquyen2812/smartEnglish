import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// SỬA DÒNG NÀY: Dùng ../components/UI/Button (viết hoa UI)
import Button from '../components/UI/Button'; 
import { BookOpen, Mic, Headphones, FileText, Trophy, Users, Book, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <BookOpen className="h-6 w-6" />
            <span>English Learning Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2">
              Sign In
            </Link>
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-5"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-24 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
          Master English with <br className="hidden md:block" />
          <span className="text-slate-700">Confidence</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Comprehensive learning platform with vocabulary, grammar, reading, listening, and speaking practice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => navigate('/login')} 
            className="h-12 px-8 text-base bg-slate-900 hover:bg-slate-800 text-white rounded-full w-full sm:w-auto"
          >
            Start Learning Free
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/login')}
            className="h-12 px-8 text-base border border-slate-300 text-slate-700 hover:bg-slate-100 bg-white rounded-full w-full sm:w-auto"
          >
            Sign In
          </Button>
        </div>
      </section>
      
      {/* (Giữ nguyên các phần FeatureCard, Stats, Footer như cũ...) */}
      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© 2026 English Learning Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}