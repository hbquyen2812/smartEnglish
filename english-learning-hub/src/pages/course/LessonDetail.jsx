import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Button from '../../components/UI/Button';
import { lessonAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export default function LessonDetail({ type }) {
  const { id } = useParams();
  const { t } = useLanguage();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
    if (!submitted && !submitting) {
      setSelectedAnswers(prev => ({ ...prev, [qId]: optionId }));
    }
  };

  const handleSubmit = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const response = await lessonAPI.submitAnswers(id, selectedAnswers);
      setSubmitResult(response.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">{t('common.loading')}</div>;
  if (!lesson) return <div className="text-center py-10 text-red-500">Lesson not found.</div>;

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = lesson.questions?.length || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border border-border overflow-hidden">
         <div className="p-6 border-b border-border">
             <h2 className="text-xl font-bold">{lesson.title}</h2>
             <p className="text-sm text-slate-500 mt-1">Lesson {id} &bull; {type === 'listening' ? 'Listen carefully' : 'Read the passage'}</p>
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
             <h3 className="font-bold text-slate-700">{t('lesson.comprehensionCheck')}</h3>
             {submitting && (
               <div className="flex items-center gap-2 mt-1">
                 <Loader2 size={14} className="animate-spin text-primary" />
                 <span className="text-sm text-primary font-medium">AI is grading & generating explanations...</span>
               </div>
             )}
             {submitResult && !submitting && (
               <p className="text-sm mt-1 font-medium text-primary">
                 {t('lesson.yourScore')}: {submitResult.correct}/{submitResult.total} ({Math.round(submitResult.score)}%)
               </p>
             )}
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-6">
             {/* Submitting overlay */}
             {submitting && (
               <div className="flex flex-col items-center justify-center py-12">
                 <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
                 <p className="text-slate-700 font-medium">Grading your answers...</p>
                 <p className="text-slate-400 text-xs mt-1">AI is analyzing and preparing explanations</p>
               </div>
             )}

             {!submitting && lesson.questions && lesson.questions.map((q, qi) => {
                 const qResult = submitted && submitResult
                   ? submitResult.results.find(r => r.question_id === q.id)
                   : null;

                 return (
                   <div key={q.id}>
                     <p className="font-medium text-sm mb-3">{qi + 1}. {q.text}</p>
                     <div className="space-y-2">
                         {q.options.map((opt) => {
                             const isSelected = selectedAnswers[q.id] === opt.id;
                             let extraClass = '';
                             if (qResult) {
                               if (opt.id === qResult.correct_answer) extraClass = 'bg-green-500 text-white border-green-500';
                               else if (isSelected && !qResult.correct) extraClass = 'bg-red-100 border-red-300 text-red-700';
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
                                   <div className="flex items-center gap-2">
                                     {qResult && opt.id === qResult.correct_answer && <CheckCircle size={14} />}
                                     {qResult && isSelected && !qResult.correct && opt.id !== qResult.correct_answer && <XCircle size={14} />}
                                     <span>{opt.text}</span>
                                   </div>
                               </div>
                             );
                         })}
                     </div>

                     {/* Explanation after submit */}
                     {qResult && (
                       <div className={`mt-3 p-3 rounded-lg text-sm ${qResult.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                         <div className="flex items-center gap-2 mb-1">
                           {qResult.correct
                             ? <CheckCircle size={14} className="text-green-600" />
                             : <XCircle size={14} className="text-amber-600" />}
                           <span className="font-bold text-slate-700">
                             {qResult.correct ? 'Correct!' : `Incorrect - Answer: ${qResult.correct_answer_text}`}
                           </span>
                         </div>
                         {qResult.explanation && (
                           <p className="text-slate-600 text-xs leading-relaxed mt-1">
                             <BookOpen size={12} className="inline mr-1" />
                             {qResult.explanation}
                           </p>
                         )}
                       </div>
                     )}
                   </div>
                 );
             })}
             {!submitting && (!lesson.questions || lesson.questions.length === 0) && (
               <p className="text-slate-400 text-center">No questions for this lesson yet.</p>
             )}
         </div>

         <div className="p-4 border-t border-border">
             {!submitted && !submitting && (
               <p className="text-xs text-slate-400 text-center mb-2">
                 {answeredCount}/{totalQuestions} answered
               </p>
             )}
             <Button className="w-full" onClick={handleSubmit} disabled={submitted || submitting || answeredCount === 0}>
               {submitting ? (
                 <span className="flex items-center justify-center gap-2">
                   <Loader2 size={16} className="animate-spin" /> Grading...
                 </span>
               ) : submitted ? (
                 `${t('lesson.yourScore')}: ${Math.round(submitResult?.score || 0)}%`
               ) : (
                 t('lesson.submitAnswers')
               )}
             </Button>
         </div>
      </div>
    </div>
  );
}
