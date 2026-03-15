import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Mic, Trophy, TrendingUp, CheckCircle, UserPlus, Shield, User } from 'lucide-react';
import { adminAPI } from '../../services/api';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${color}`}><Icon size={18} className="text-white" /></div>
      <span className="text-sm text-slate-500 font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!stats) return <div className="text-center text-slate-500 py-20">Failed to load stats</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.total_users} color="bg-indigo-500" sub={`+${stats.new_users_30d} in 30 days`} />
        <StatCard icon={Users} label="Active Users" value={stats.active_users} color="bg-green-500" />
        <StatCard icon={BookOpen} label="Lessons" value={stats.total_lessons} color="bg-blue-500" />
        <StatCard icon={Mic} label="Speaking Topics" value={stats.total_topics} color="bg-purple-500" />
        <StatCard icon={Trophy} label="Avg Score" value={`${stats.avg_score}%`} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} label="Completions" value={stats.total_completions} color="bg-teal-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <UserPlus size={18} className="text-green-500" /> Recent Users
            </h3>
            <Link to="/admin-panel/users" className="text-xs text-indigo-500 font-medium hover:underline">View all</Link>
          </div>
          {stats.recent_users.length === 0 ? (
            <p className="text-slate-400 text-sm">No users yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recent_users.slice(0, 8).map((user) => (
                <div key={user.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">{user.username}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(user.date_joined).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                    {user.role === 'admin' ? <Shield size={8} /> : <User size={8} />}
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Lessons */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" /> Top Lessons
            </h3>
            <Link to="/admin-panel/lessons" className="text-xs text-indigo-500 font-medium hover:underline">Manage</Link>
          </div>
          {stats.top_lessons.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.top_lessons.map((lesson, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-700">{lesson.lesson__title}</div>
                      <div className="text-xs text-slate-400 capitalize">{lesson.lesson__lesson_type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">{lesson.completions} done</div>
                    <div className="text-xs text-slate-400">avg {Math.round(lesson.avg_score)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Score Distribution + Registration Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" /> Score Distribution
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Excellent (80-100%)', value: stats.score_distribution.excellent, color: 'bg-green-500' },
              { label: 'Good (60-79%)', value: stats.score_distribution.good, color: 'bg-yellow-500' },
              { label: 'Needs Work (<60%)', value: stats.score_distribution.needs_work, color: 'bg-red-500' },
            ].map(item => {
              const total = stats.score_distribution.excellent + stats.score_distribution.good + stats.score_distribution.needs_work;
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-700">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Registration Chart */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-600 mb-3">New Users (Last 7 Days)</h4>
            <div className="flex items-end gap-2 h-24">
              {stats.registrations_chart.length === 0 ? (
                <p className="text-slate-400 text-xs">No registrations</p>
              ) : (
                stats.registrations_chart.map((item, i) => {
                  const max = Math.max(...stats.registrations_chart.map(r => r.count), 1);
                  const height = Math.max((item.count / max) * 100, 8);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500">{item.count}</span>
                      <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${height}%` }}></div>
                      <span className="text-[9px] text-slate-400">{item.date.slice(5)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
