import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/UI/Button';

export default function LessonDetail({ type }) { 
  const { id } = useParams();
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleSelect = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      {}
      <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border border-border overflow-hidden">
         <div className="p-6 border-b border-border">
             <h2 className="text-xl font-bold">The Future of Remote Work</h2>
             <p className="text-sm text-slate-500 mt-1">Lesson {id} • {type === 'listening' ? 'Listen carefully' : 'Read the passage'}</p>
         </div>
         
         <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
             {type === 'listening' ? (
                 <div className="flex flex-col items-center justify-center h-full">
                     <div className="w-48 h-48 bg-gradient-to-tr from-slate-800 to-slate-600 rounded-full shadow-xl flex items-center justify-center mb-8 animate-pulse-ring">
                         <div className="w-40 h-40 bg-slate-900 rounded-full flex items-center justify-center text-white">
                             <span className="font-bold">AUDIO</span>
                         </div>
                     </div>
                     <audio controls className="w-full max-w-md">
                         <source src="#" />
                     </audio>
                 </div>
             ) : (
                 <article className="prose prose-slate max-w-none">
                     <p>The COVID-19 pandemic has fundamentally changed how we think about work...</p>
                     <p>Companies have discovered numerous benefits to remote work arrangements. Reduced overhead costs...</p>
                     <p>However, challenges remain, including maintaining company culture and ensuring effective communication.</p>
                 </article>
             )}
         </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-border flex flex-col h-full overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-border">
             <h3 className="font-bold text-slate-700">Comprehension Check</h3>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-6">
             {[1, 2, 3].map(q => (
                 <div key={q}>
                     <p className="font-medium text-sm mb-3">{q}. What is the main idea of the passage?</p>
                     <div className="space-y-2">
                         {['Remote work is bad', 'Remote work saves money', 'It is complex'].map((opt, idx) => (
                             <div 
                                key={idx} 
                                onClick={() => handleSelect(q, idx)}
                                className={`p-3 rounded-lg border text-sm cursor-pointer transition-all
                                ${selectedAnswers[q] === idx 
                                    ? 'bg-primary text-white border-primary shadow-md' 
                                    : 'bg-white border-slate-200 hover:border-slate-400'}`}
                             >
                                 {opt}
                             </div>
                         ))}
                     </div>
                 </div>
             ))}
         </div>

         <div className="p-4 border-t border-border">
             <Button className="w-full">Submit Answers</Button>
         </div>
      </div>
    </div>
  );
}