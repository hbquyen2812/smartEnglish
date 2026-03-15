import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones } from 'lucide-react';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { lessonAPI, progressAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DashboardHome() {
  const { t } = useLanguage();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          lessonAPI.getRecommended(),
          progressAPI.getAll(),
        ]);
        const lessonsData = Array.isArray(lessonsRes.data) ? lessonsRes.data : (lessonsRes.data.results || []);
        const progressData = Array.isArray(progressRes.data) ? progressRes.data : (progressRes.data.results || []);
        setLessons(lessonsData);
        setProgress(progressData);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedIds = progress.filter(p => p.completed).map(p => p.lesson);
  const completedCount = completedIds.length;
  const todayLessons = progress.filter(p => {
    if (!p.completed_at) return false;
    const d = new Date(p.completed_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return (
    <div>
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <BookOpen size={18} className="text-indigo-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{lessons.length}</div>
            <div className="text-xs text-slate-400">{t('course.allLevels')} Lessons</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">{completedCount}</span>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{completedCount}/{lessons.length}</div>
            <div className="text-xs text-slate-400">{t('progress.lessonsCompleted')}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">{todayLessons}</span>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{todayLessons}</div>
            <div className="text-xs text-slate-400">Today</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Headphones size={18} className="text-yellow-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{lessons.filter(l => l.lesson_type === 'listening').length}</div>
            <div className="text-xs text-slate-400">Listening</div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-primary rounded-2xl p-8 mb-10 text-white relative overflow-hidden flex items-center justify-between">
         <div className="relative z-10 max-w-lg">
             <Badge text="New Feature" color="purple" />
             <h2 className="text-3xl font-bold mt-3 mb-2">{t('dashboard.practiceAI')}</h2>
             <p className="text-slate-300 mb-6">{t('dashboard.practiceDesc')}</p>
             <Link to="/dashboard/speaking">
               <Button variant="secondary">Try it now</Button>
             </Link>
         </div>
         <div className="hidden lg:block w-64 h-64 bg-white/5 rounded-full absolute -right-10 -top-10"></div>
         <div className="hidden lg:block w-32 h-32 bg-white/10 rounded-full absolute right-40 bottom-10"></div>
      </div>

      <div className="flex items-center justify-between mb-6">
         <h3 className="font-bold text-xl text-slate-900">{t('dashboard.recommended')}</h3>
         <Link to="/dashboard/reading" className="text-primary text-sm font-medium hover:underline">{t('dashboard.viewAll')}</Link>
      </div>

      {loading && <div className="text-center py-10">{t('common.loading')}</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {lessons.map(lesson => {
               const isCompleted = completedIds.includes(lesson.id);
               const lessonPath = `/dashboard/${lesson.lesson_type}/${lesson.id}`;
               return (
                 <Link key={lesson.id} to={lessonPath} className="block">
                   <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-soft transition-all group h-full">
                       <div className="h-40 overflow-hidden relative">
                           <img
                              src={lesson.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              alt={lesson.title}
                           />
                           <div className="absolute top-3 left-3">
                             <Badge text={lesson.lesson_type} color={lesson.lesson_type === 'reading' ? 'green' : 'purple'} />
                           </div>
                           <div className="absolute top-3 right-3">
                             <Badge text={lesson.level} color={lesson.level === 'Beginner' ? 'green' : lesson.level === 'Intermediate' ? 'yellow' : 'red'} />
                           </div>
                           {isCompleted && (
                             <div className="absolute bottom-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                               Completed
                             </div>
                           )}
                       </div>
                       <div className="p-5">
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs font-bold text-slate-400 uppercase">{lesson.tag || lesson.lesson_type}</span>
                             {lesson.duration && <span className="text-xs text-slate-300">• {lesson.duration}</span>}
                           </div>
                           <h4 className="font-bold text-lg mb-3">{lesson.title}</h4>
                           <div className="flex items-center justify-between">
                             <span className="text-xs text-slate-400">{lesson.questions_count} {t('course.questions')}</span>
                             <span className="text-primary text-sm font-medium group-hover:underline">{t('dashboard.startLesson')} →</span>
                           </div>
                       </div>
                   </div>
                 </Link>
               );
           })}
           {lessons.length === 0 && <p className="text-slate-500">No lessons available right now.</p>}
        </div>
      )}
    </div>
  );
}
