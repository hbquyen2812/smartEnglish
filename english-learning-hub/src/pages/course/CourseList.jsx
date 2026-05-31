import React, { useEffect, useState } from 'react';
import { Clock, HelpCircle, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/UI/Badge';
import { lessonAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

const PAGE_SIZE = 6; // phải khớp page_size ở backend (LessonPagination)
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500';

export default function CourseList({ type }) {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Đổi loại bài (reading/listening) -> reset mọi thứ
  useEffect(() => {
    setActiveFilter('All');
    setSearchInput('');
    setSearch('');
    setPage(1);
  }, [type]);

  // Debounce ô tìm kiếm (chờ 400ms sau khi ngừng gõ)
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Gọi API mỗi khi đổi loại / cấp độ / trang / từ khóa
  useEffect(() => {
    let active = true;
    setLoading(true);
    lessonAPI
      .getByType(type, { level: activeFilter, page, search })
      .then((res) => {
        if (!active) return;
        const data = res.data;
        if (Array.isArray(data)) {
          setCourses(data);
          setCount(data.length);
        } else {
          setCourses(data.results || []);
          setCount(data.count || 0);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        if (active) { setCourses([]); setCount(0); }
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [type, activeFilter, page, search]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const filterLabels = {
    'All': t('course.allLevels'),
    'Beginner': t('course.beginner'),
    'Intermediate': t('course.intermediate'),
    'Advanced': t('course.advanced'),
  };

  const title = type === 'reading' ? t('course.readingCourses') : t('course.listeningCourses');

  const changeFilter = (f) => { setActiveFilter(f); setPage(1); };

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold capitalize mb-2">{title}</h2>
          <p className="text-slate-500">Improve your skills with our curated {type} lessons.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-border">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((filter) => (
            <button
              key={filter}
              onClick={() => changeFilter(filter)}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors
                ${activeFilter === filter ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {filterLabels[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* Ô tìm kiếm */}
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm bài học theo tên hoặc chủ đề..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {loading && <div className="text-center py-10">{t('common.loading')}</div>}

      {!loading && (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{count} bài học</span>
            <span className="text-sm text-slate-400">Trang {page}/{totalPages}</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-4 rounded-xl border border-border flex items-center justify-between hover:border-primary/50 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={course.image || FALLBACK_IMG}
                      alt={course.title}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
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
                      {course.duration && <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>}
                      <span className="flex items-center gap-1"><HelpCircle size={12} /> {course.questions_count || 0} {t('course.questions')}</span>
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
            {courses.length === 0 && <p className="text-slate-500 text-center py-10">Không tìm thấy bài học nào.</p>}
          </div>

          {/* Thanh phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors
                    ${p === page ? 'bg-primary text-white' : 'border border-border text-slate-600 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
