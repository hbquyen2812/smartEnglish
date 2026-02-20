import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/UI/Button';
import { lessonAPI } from '../../services/api';

export default function LessonDetail({ type }) {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await lessonAPI.getDetail(id);
        setLesson(response.data);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleSelect = (qId, optionId) => {
    if (!submitted) {
      setSelectedAnswers(prev => ({ ...prev, [qId]: optionId }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await lessonAPI.submitAnswers(id, selectedAnswers);
      setSubmitResult(response.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit:", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading lesson...</div>;
  if (!lesson) return <div className="text-center py-10 text-red-500">Lesson not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border border-border overflow-hidden">
         <div className="p-6 border-b border-border">
             <h2 className="text-xl font-bold">{lesson.title}</h2>
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
                     {lesson.audio_file ? (
                       <audio controls className="w-full max-w-md">
                           <source src={lesson.audio_file} />
                       </audio>
                     ) : (
                       <p className="text-slate-400">Audio file not available yet.</p>
                     )}
                 </div>
             ) : (
                 <article className="prose prose-slate max-w-none">
                     {lesson.reading_text.split('\n\n').map((paragraph, i) => (
                       <p key={i}>{paragraph}</p>
                     ))}
                 </article>
             )}
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-border flex flex-col h-full overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-border">
             <h3 className="font-bold text-slate-700">Comprehension Check</h3>
             {submitResult && (
               <p className="text-sm mt-1 font-medium text-primary">
                 Score: {submitResult.correct}/{submitResult.total} ({Math.round(submitResult.score)}%)
               </p>
             )}
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-6">
             {lesson.questions && lesson.questions.map((q, qi) => (
                 <div key={q.id}>
                     <p className="font-medium text-sm mb-3">{qi + 1}. {q.text}</p>
                     <div className="space-y-2">
                         {q.options.map((opt) => {
                             const isSelected = selectedAnswers[q.id] === opt.id;
                             let extraClass = '';
                             if (submitted && submitResult) {
                               const qResult = submitResult.results.find(r => r.question_id === q.id);
                               if (qResult) {
                                 if (opt.id === qResult.correct_answer) extraClass = 'bg-green-500 text-white border-green-500';
                                 else if (isSelected && !qResult.correct) extraClass = 'bg-red-100 border-red-300 text-red-700';
                               }
                             }
                             return (
                               <div
                                  key={opt.id}
                                  onClick={() => handleSelect(q.id, opt.id)}
                                  className={`p-3 rounded-lg border text-sm cursor-pointer transition-all
                                  ${extraClass || (isSelected
                                      ? 'bg-primary text-white border-primary shadow-md'
                                      : 'bg-white border-slate-200 hover:border-slate-400')}`}
                               >
                                   {opt.text}
                               </div>
                             );
                         })}
                     </div>
                 </div>
             ))}
             {(!lesson.questions || lesson.questions.length === 0) && (
               <p className="text-slate-400 text-center">No questions for this lesson yet.</p>
             )}
         </div>

         <div className="p-4 border-t border-border">
             <Button className="w-full" onClick={handleSubmit} disabled={submitted}>
               {submitted ? `Score: ${Math.round(submitResult?.score || 0)}%` : 'Submit Answers'}
             </Button>
         </div>
      </div>
    </div>
  );
}
