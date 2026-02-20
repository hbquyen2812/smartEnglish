import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, Mic, FileText, Activity, LayoutGrid, LogOut, ChevronRight, PenTool, Sparkles } from 'lucide-react';
import { profileAPI } from '../services/api';

const NavItem = ({ icon: Icon, label, path, isActive }) => (
  <Link to={path}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
    ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
    <span>{label}</span>
    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </Link>
);

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const p = location.pathname;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    profileAPI.get()
      .then(res => setProfile(res.data))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const username = profile?.username || 'Learner';
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-72 bg-surface border-r border-border fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg"><BookOpen size={20} /></div>
          <span className="font-bold text-lg tracking-tight">EnglishHub</span>
        </div>

        <div className="px-6 mb-6">
            <div className="bg-slate-50 border border-border rounded-xl p-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Daily Goal</span>
                    <span className="text-xs font-bold text-primary">{profile?.streak || 0} day streak</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-green w-[80%] rounded-full"></div>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="text-center">
                        <div className="text-accent-purple font-bold text-lg leading-none">{profile?.daily_goal || 3}</div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold mt-1">Goal</div>
                    </div>
                    <div className="text-center">
                        <div className="text-accent-yellow font-bold text-lg leading-none">{profile?.streak || 0}</div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold mt-1">Streak</div>
                    </div>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning</div>
          <NavItem icon={LayoutGrid} label="Dashboard" path="/dashboard" isActive={p === '/dashboard'} />
          <NavItem icon={BookOpen} label="Reading" path="/dashboard/reading" isActive={p.includes('reading')} />
          <NavItem icon={Headphones} label="Listening" path="/dashboard/listening" isActive={p.includes('listening')} />
          <NavItem icon={Mic} label="Speaking AI" path="/dashboard/speaking" isActive={p.includes('speaking')} />
          <NavItem icon={FileText} label="Grammar" path="/dashboard/grammar" isActive={p.includes('grammar')} />
          <NavItem icon={PenTool} label="Writing" path="/dashboard/writing" isActive={p.includes('writing')} />
          <NavItem icon={Sparkles} label="Summarizer" path="/dashboard/summarize" isActive={p.includes('summarize')} />
          <div className="px-4 py-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</div>
          <NavItem icon={Activity} label="My Progress" path="/dashboard/progress" isActive={p.includes('progress')} />
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 text-sm font-medium transition-colors w-full">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {username}! 👋</h1>
                <p className="text-slate-500 text-sm mt-1">Let's learn something new today.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                    <div className="text-sm font-bold text-slate-900">{username}</div>
                    <div className="text-xs text-slate-500">{profile?.level || 'Beginner'}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
                    {initial}
                </div>
            </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
