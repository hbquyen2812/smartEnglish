import React from 'react';
import { Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/UI/Badge';

const courses = [
  { id: 1, title: "Job Interview Basics", duration: "5 min", questions: 10, level: "Intermediate", tag: "Business" },
  { id: 2, title: "Travel Vocabulary", duration: "3 min", questions: 5, level: "Beginner", tag: "Travel" },
  { id: 3, title: "Climate Change Report", duration: "8 min", questions: 12, level: "Advanced", tag: "Science" },
  { id: 4, title: "Coffee Shop Chat", duration: "4 min", questions: 6, level: "Beginner", tag: "Daily Life" },
];

export default function CourseList({ type }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-2xl font-bold capitalize mb-2">{type} Practice</h2>
            <p className="text-slate-500">Improve your skills with our curated {type} lessons.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-border">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(filter => (
                <button key={filter} className="px-4 py-1.5 text-sm rounded-md hover:bg-slate-50 font-medium text-slate-600 focus:bg-primary focus:text-white transition-colors">
                    {filter}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 rounded-xl border border-border flex items-center justify-between hover:border-primary/50 transition-colors group">
             <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xl">
                    {course.id}
                 </div>
                 <div>
                     <div className="flex gap-2 mb-1">
                         <Badge text={course.level} color="green" />
                         <Badge text={course.tag} color="gray" />
                     </div>
                     <h3 className="font-bold text-lg text-slate-900">{course.title}</h3>
                     <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                         <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                         <span className="flex items-center gap-1"><HelpCircle size={12}/> {course.questions} Questions</span>
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
      </div>
    </div>
  );
}