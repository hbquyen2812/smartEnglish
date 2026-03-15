import React, { useEffect, useState } from 'react';
import { Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/UI/Badge';
import { lessonAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function CourseList({ type }) {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await lessonAPI.getByType(type);
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [type]);

  const filtered = activeFilter === 'All'
    ? courses
    : courses.filter(c => c.level === activeFilter);

  const filterLabels = {
    'All': t('course.allLevels'),
    'Beginner': t('course.beginner'),
    'Intermediate': t('course.intermediate'),
    'Advanced': t('course.advanced'),
  };

  const title = type === 'reading' ? t('course.readingCourses') : t('course.listeningCourses');

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-2xl font-bold capitalize mb-2">{title}</h2>
            <p className="text-slate-500">Improve your skills with our curated {type} lessons.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-border">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(filter => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors
                      ${activeFilter === filter
                        ? 'bg-primary text-white'
                        : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    {filterLabels[filter]}
                </button>
            ))}
        </div>
      </div>

      {loading && <div className="text-center py-10">{t('common.loading')}</div>}

      {!loading && (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((course, index) => (
            <div key={course.id} className="bg-white p-4 rounded-xl border border-border flex items-center justify-between hover:border-primary/50 transition-colors group">
               <div className="flex items-center gap-6">
                   <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={course.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div>
                       <div className="flex gap-2 mb-1">
                           <Badge text={course.level} color="green" />
                           {course.tag && <Badge text={course.tag} color="gray" />}
                       </div>
                       <h3 className="font-bold text-lg text-slate-900">{course.title}</h3>
                       <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                           {course.duration && <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>}
                           <span className="flex items-center gap-1"><HelpCircle size={12}/> {course.questions_count || 0} {t('course.questions')}</span>
                       </div>
                   </div>
               </div>
               <Link to={`/dashboard/${type}/${course.id}`}>
                  <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                      <ArrowRight size={18} />
                  </button>
               </Link>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-slate-500 text-center py-10">No courses found.</p>}
        </div>
      )}
    </div>
  );
}
