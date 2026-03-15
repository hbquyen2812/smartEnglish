import React, { useEffect, useState } from 'react';
import { Trophy, BookOpen, CheckCircle, Clock } from 'lucide-react';
import Badge from '../../components/UI/Badge';
import { progressAPI, profileAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { t } = useLanguage();
  const [progress, setProgress] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to load progress data.");
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

  if (loading) return <div className="text-center py-10">{t('common.loading')}</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('progress.title')}</h2>
        <p className="text-slate-500">Track your learning journey and achievements.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label={t('progress.lessonsCompleted')} value={completedCount} color="bg-primary" />
        <StatCard icon={Trophy} label={t('progress.averageScore')} value={`${avgScore}%`} color="bg-accent-green" />
        <StatCard icon={CheckCircle} label={t('progress.currentLevel')} value={profile?.level || 'Beginner'} color="bg-accent-purple" />
        <StatCard icon={Clock} label={t('progress.dayStreak')} value={profile?.streak || 0} color="bg-accent-yellow" />
      </div>

      {/* Progress List */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-slate-700">{t('progress.completedLessons')}</h3>
        </div>

        {progress.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">{t('progress.noLessons')}</p>
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
                    text={item.score >= 80 ? t('progress.excellent') : item.score >= 50 ? t('progress.good') : t('progress.needsWork')}
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
