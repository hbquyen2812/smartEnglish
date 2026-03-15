import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, Mic, FileText, Activity, LayoutGrid, LogOut, ChevronRight, PenTool, Sparkles, Shield, Globe, Pencil, Settings } from 'lucide-react';
import { profileAPI } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { lang, switchLang, t } = useLanguage();

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

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const username = profile?.username || 'Learner';
  const initial = username.charAt(0).toUpperCase();

  const handleGoalSave = async () => {
    const val = parseInt(goalInput);
    if (!val || val < 1 || val > 20) return;
    try {
      await profileAPI.update({ daily_goal: val });
      setProfile({ ...profile, daily_goal: val });
      setEditingGoal(false);
    } catch {}
  };

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
                    <span className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.dailyGoal')}</span>
                    <span className="text-xs font-bold text-primary">{profile?.streak || 0} {t('dashboard.dayStreak')}</span>
                </div>
                {/* Progress bar: today_completed / daily_goal */}
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${(profile?.today_completed || 0) >= (profile?.daily_goal || 3) ? 'bg-accent-green' : 'bg-accent-purple'}`}
                      style={{ width: `${Math.min(100, ((profile?.today_completed || 0) / (profile?.daily_goal || 3)) * 100)}%` }}></div>
                </div>
                <div className="text-center mt-2">
                    <span className="text-xs text-slate-500">
                      <span className="font-bold text-slate-700">{profile?.today_completed || 0}</span>/{profile?.daily_goal || 3} lessons today
                      {(profile?.today_completed || 0) >= (profile?.daily_goal || 3) && <span className="ml-1 text-accent-green font-bold"> Done!</span>}
                    </span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-slate-200">
                    <div className="text-center">
                        {editingGoal ? (
                          <div className="flex items-center gap-1">
                            <input type="number" min="1" max="20" value={goalInput}
                              onChange={(e) => setGoalInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleGoalSave()}
                              className="w-12 text-center border border-slate-300 rounded text-sm py-0.5 focus:outline-none focus:ring-1 focus:ring-primary" autoFocus />
                            <button onClick={handleGoalSave} className="text-[10px] text-primary font-bold">OK</button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 cursor-pointer group/goal"
                              onClick={() => { setEditingGoal(true); setGoalInput(String(profile?.daily_goal || 3)); }}
                              title="Click to change daily goal">
                              <span className="text-accent-purple font-bold text-lg leading-none">{profile?.daily_goal || 3}</span>
                              <Pencil size={10} className="text-slate-300 group-hover/goal:text-accent-purple transition-colors" />
                            </div>
                            <div className="text-[9px] text-slate-400 uppercase font-bold mt-1">{t('dashboard.goal')}</div>
                          </>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="text-accent-yellow font-bold text-lg leading-none">{profile?.streak || 0}</div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold mt-1">{t('dashboard.streak')}</div>
                    </div>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('nav.learning')}</div>
          <NavItem icon={LayoutGrid} label={t('nav.dashboard')} path="/dashboard" isActive={p === '/dashboard'} />
          <NavItem icon={BookOpen} label={t('nav.reading')} path="/dashboard/reading" isActive={p.includes('reading')} />
          <NavItem icon={Headphones} label={t('nav.listening')} path="/dashboard/listening" isActive={p.includes('listening')} />
          <NavItem icon={Mic} label={t('nav.speaking')} path="/dashboard/speaking" isActive={p.includes('speaking')} />
          <NavItem icon={FileText} label={t('nav.grammar')} path="/dashboard/grammar" isActive={p.includes('grammar')} />
          <NavItem icon={PenTool} label={t('nav.writing')} path="/dashboard/writing" isActive={p.includes('writing')} />
          <NavItem icon={Sparkles} label={t('nav.summarizer')} path="/dashboard/summarize" isActive={p.includes('summarize')} />
          <div className="px-4 py-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('nav.account')}</div>
          <NavItem icon={Activity} label={t('nav.progress')} path="/dashboard/progress" isActive={p.includes('progress')} />
          <NavItem icon={Settings} label="Settings" path="/dashboard/settings" isActive={p.includes('settings')} />
          {profile?.role === 'admin' && (
            <NavItem icon={Shield} label={t('nav.adminPanel')} path="/admin-panel" isActive={false} />
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <div className="flex items-center gap-2 px-4 py-2">
            <Globe size={16} className="text-slate-400" />
            <select value={lang} onChange={(e) => switchLang(e.target.value)}
              className="bg-transparent text-sm text-slate-500 font-medium focus:outline-none cursor-pointer">
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 text-sm font-medium transition-colors w-full">
            <LogOut size={18} /> {t('nav.signOut')}
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.welcome')}, {username}! 👋</h1>
                <p className="text-slate-500 text-sm mt-1">{t('dashboard.subtitle')}</p>
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
