import React, { useEffect, useState } from 'react';
import { Trophy, BookOpen, CheckCircle, Clock } from 'lucide-react';
import Badge from '../../components/UI/Badge';
import { progressAPI, profileAPI } from '../../services/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
    </div>
  </div>
);

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, profileRes] = await Promise.all([
          progressAPI.getAll(),
          profileAPI.get(),
        ]);
        const data = Array.isArray(progressRes.data) ? progressRes.data : (progressRes.data.results || []);
        setProgress(data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCount = progress.filter(p => p.completed).length;
  const avgScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
    : 0;

  if (loading) return <div className="text-center py-10">Loading progress...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">My Progress</h2>
        <p className="text-slate-500">Track your learning journey and achievements.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Lessons Completed" value={completedCount} color="bg-primary" />
        <StatCard icon={Trophy} label="Average Score" value={`${avgScore}%`} color="bg-accent-green" />
        <StatCard icon={CheckCircle} label="Current Level" value={profile?.level || 'Beginner'} color="bg-accent-purple" />
        <StatCard icon={Clock} label="Day Streak" value={profile?.streak || 0} color="bg-accent-yellow" />
      </div>

      {/* Progress List */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-slate-700">Completed Lessons</h3>
        </div>

        {progress.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No completed lessons yet</p>
            <p className="text-sm mt-1">Start learning to track your progress here!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {progress.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{item.lesson_title}</h4>
                    <p className="text-xs text-slate-400">
                      {item.completed_at ? new Date(item.completed_at).toLocaleDateString('vi-VN') : 'In progress'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">{Math.round(item.score || 0)}%</div>
                  <Badge
                    text={item.score >= 80 ? 'Excellent' : item.score >= 50 ? 'Good' : 'Needs Work'}
                    color={item.score >= 80 ? 'green' : item.score >= 50 ? 'yellow' : 'red'}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
