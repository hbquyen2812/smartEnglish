import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Chú ý: Import từ UI viết hoa
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { lessonAPI } from '../../services/api';

export default function DashboardHome() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await lessonAPI.getRecommended();
        // Giả sử API trả về mảng bài học trực tiếp hoặc trong response.data.results
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
        setError("Could not load lessons.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="bg-primary rounded-2xl p-8 mb-10 text-white relative overflow-hidden flex items-center justify-between">
         <div className="relative z-10 max-w-lg">
             <Badge text="New Feature" color="purple" />
             <h2 className="text-3xl font-bold mt-3 mb-2">Practice Speaking with AI</h2>
             <p className="text-slate-300 mb-6">Get instant feedback on your pronunciation.</p>
             <Button variant="secondary" onClick={() => window.location.href='/dashboard/speaking'}>Try it now</Button>
         </div>
         <div className="hidden lg:block w-64 h-64 bg-white/5 rounded-full absolute -right-10 -top-10"></div>
         <div className="hidden lg:block w-32 h-32 bg-white/10 rounded-full absolute right-40 bottom-10"></div>
      </div>

      <div className="flex items-center justify-between mb-6">
         <h3 className="font-bold text-xl text-slate-900">Recommended for you</h3>
         <Link to="/dashboard/listening" className="text-primary text-sm font-medium hover:underline">View all</Link>
      </div>

      {loading && <div className="text-center py-10">Loading lessons...</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {lessons.map(lesson => (
               <div key={lesson.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-soft transition-all group">
                   <div className="h-40 overflow-hidden relative">
                       {/* Handle ảnh: nếu không có ảnh từ API thì dùng ảnh placeholder */}
                       <img 
                          src={lesson.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500"} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={lesson.title} 
                       />
                       <div className="absolute top-3 right-3">
                         <Badge text={lesson.level || "General"} color="green" />
                       </div>
                   </div>
                   <div className="p-5">
                       <div className="text-xs font-bold text-slate-400 uppercase mb-1">Lesson</div>
                       <h4 className="font-bold text-lg mb-4">{lesson.title}</h4>
                       <Button variant="secondary" className="w-full text-sm py-2">Start Lesson</Button>
                   </div>
               </div>
           ))}
           {lessons.length === 0 && <p className="text-slate-500">No lessons available right now.</p>}
        </div>
      )}
    </div>
  );
}