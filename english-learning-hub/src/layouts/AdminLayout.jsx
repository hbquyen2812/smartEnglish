import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, BookOpen, Mic, LogOut, ChevronRight, Shield, ArrowLeft } from 'lucide-react';
import { profileAPI } from '../services/api';

const NavItem = ({ icon: Icon, label, path, isActive }) => (
  <Link to={path}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
    ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
    <span>{label}</span>
    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </Link>
);

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const p = location.pathname;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/login'); return; }

    profileAPI.get()
      .then(res => {
        if (res.data.role !== 'admin') {
          navigate('/dashboard');
          return;
        }
        setProfile(res.data);
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const username = profile?.username || 'Admin';

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-indigo-600 text-white p-2 rounded-lg"><Shield size={20} /></div>
          <div>
            <div className="font-bold text-white text-sm">SmartEnglish</div>
            <div className="text-xs text-slate-400">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Management</div>
          <NavItem icon={LayoutGrid} label="Dashboard" path="/admin-panel" isActive={p === '/admin-panel'} />
          <NavItem icon={Users} label="Users" path="/admin-panel/users" isActive={p.includes('/users')} />
          <NavItem icon={BookOpen} label="Lessons" path="/admin-panel/lessons" isActive={p.includes('/lessons')} />
          <NavItem icon={Mic} label="Speaking Topics" path="/admin-panel/topics" isActive={p.includes('/topics')} />
        </nav>

        <div className="p-3 border-t border-slate-700 space-y-1">
          <Link to="/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors w-full">
            <ArrowLeft size={18} /> Back to App
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors w-full">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
            <p className="text-slate-500 text-sm">Manage your SmartEnglish platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">{username}</div>
              <div className="text-xs text-indigo-600 font-medium">Administrator</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center font-bold text-indigo-600">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
