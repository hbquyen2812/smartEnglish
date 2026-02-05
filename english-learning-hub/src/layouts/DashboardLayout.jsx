import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Headphones, Mic, FileText, Activity, LayoutGrid, LogOut, ChevronRight } from 'lucide-react';

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
  const p = location.pathname;

  return (
    <div className="flex min-h-screen bg-background">
      {}
      <aside className="w-72 bg-surface border-r border-border fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg"><BookOpen size={20} /></div>
          <span className="font-bold text-lg tracking-tight">EnglishHub</span>
        </div>

        {}
        <div className="px-6 mb-6">
            <div className="bg-slate-50 border border-border rounded-xl p-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Daily Goal</span>
                    <span className="text-xs font-bold text-primary">80%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-green w-[80%] rounded-full"></div>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="text-center">
                        <div className="text-accent-purple font-bold text-lg leading-none">12</div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold mt-1">Lessons</div>
                    </div>
                    <div className="text-center">
                        <div className="text-accent-yellow font-bold text-lg leading-none">5</div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold mt-1">Streak</div>
                    </div>
                </div>
            </div>
        </div>

        {}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning</div>
          <NavItem icon={LayoutGrid} label="Dashboard" path="/" isActive={p === '/'} />
          <NavItem icon={BookOpen} label="Reading" path="/reading" isActive={p.includes('reading')} />
          <NavItem icon={Headphones} label="Listening" path="/listening" isActive={p.includes('listening')} />
          <NavItem icon={Mic} label="Speaking AI" path="/speaking" isActive={p.includes('speaking')} />
          <NavItem icon={FileText} label="Grammar" path="/grammar" isActive={p.includes('grammar')} />
          <div className="px-4 py-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</div>
          <NavItem icon={Activity} label="My Progress" path="/progress" isActive={p.includes('progress')} />
        </nav>

        <div className="p-4 border-t border-border">
          <Link to="/login" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 text-sm font-medium transition-colors">
            <LogOut size={18} /> Sign In
          </Link>
        </div>
      </aside>

      {}
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, Learner! 👋</h1>
                <p className="text-slate-500 text-sm mt-1">Let's learn something new today.</p>
            </div>
            {}
            <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                    <div className="text-sm font-bold text-slate-900">Guest User</div>
                    <div className="text-xs text-slate-500">Free Account</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
                    G
                </div>
            </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}