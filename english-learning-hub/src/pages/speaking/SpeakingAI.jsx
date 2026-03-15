import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, ChevronRight, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/UI/Button';
import { speakingAPI } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

const ScoreBar = ({ label, score, max = 9 }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs font-medium text-slate-500 w-24">{label}</span>
    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(score / max) * 100}%` }} />
    </div>
    <span className="text-sm font-bold text-slate-800 w-6 text-right">{score}</span>
  </div>
);

export default function SpeakingAI() {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle');
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [topics, setTopics] = useState([]);
  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    speakingAPI.getTopics()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setTopics(data);
      })
      .catch(() => {
        setTopics([{
          id: null, title: "Education & Technology",
          category: "IELTS Speaking Part 3",
          prompt_question: "How has technology changed the way we learn?",
        }]);
      });
  }, []);

  const currentTopic = topics[currentTopicIdx] || {
    title: "General Speaking", category: "Practice",
    prompt_question: "Tell me about yourself.",
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => { audioChunks.current.push(event.data); };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunks.current = [];
        setStatus('analyzing');
        setError(null);
        try {
          const response = await speakingAPI.uploadAudio(audioBlob, currentTopic.id);
          setResult(response.data);
          setStatus('result');
        } catch {
          setError("Could not analyze speech. Please try again.");
          setStatus('idle');
        }
      };
      mediaRecorderRef.current.start();
      setStatus('recording');
    } catch {
      setError("Microphone access denied. Please allow microphone permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const reset = () => { setAudioUrl(null); setResult(null); setError(null); setStatus('idle'); setShowDetails(false); };
  const nextTopic = () => { setCurrentTopicIdx(prev => (prev + 1) % topics.length); reset(); };

  const criteria = result ? [
    { label: t('speaking.fluency'), score: result.fluency, feedback: result.fluency_feedback },
    { label: t('speaking.pronunciation'), score: result.pronunciation, feedback: result.pronunciation_feedback },
    { label: t('speaking.grammarScore'), score: result.grammar, feedback: result.grammar_feedback },
    { label: 'Lexical Resource', score: result.lexical_resource, feedback: result.lexical_feedback },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-center mb-10">
           <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">{currentTopic.category}</span>
           <h2 className="text-3xl font-bold mt-4 text-slate-900">{t('speaking.title')}: {currentTopic.title}</h2>
           <p className="text-slate-500 mt-2 text-lg">"{currentTopic.prompt_question}"</p>
       </div>

       {error && <div className="mb-4 text-center text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

       <div className="bg-white rounded-3xl shadow-soft border border-border p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
           <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

           {status === 'idle' && (
               <div className="z-10 text-center animate-fade-in">
                   <button onClick={startRecording} className="w-24 h-24 bg-primary hover:bg-slate-800 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 group">
                       <Mic size={40} className="text-white group-hover:animate-bounce" />
                   </button>
                   <p className="mt-6 text-slate-500 font-medium">{t('speaking.startRecording')}</p>
               </div>
           )}

           {status === 'recording' && (
               <div className="z-10 text-center">
                   <div className="relative">
                       <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                       <button onClick={stopRecording} className="relative w-24 h-24 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all">
                           <Square size={32} className="text-white fill-current" />
                       </button>
                   </div>
                   <p className="mt-6 text-red-500 font-bold animate-pulse">{t('speaking.recording')}</p>
               </div>
           )}

           {status === 'analyzing' && (
               <div className="z-10 text-center">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6 mx-auto"></div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">{t('speaking.analyzing')}</h3>
                   <p className="text-slate-500">Evaluating 4 IELTS criteria...</p>
               </div>
           )}

           {status === 'result' && result && (
               <div className="w-full z-10 animate-fade-in-up">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {/* Score Card */}
                       <div className="bg-slate-900 text-white rounded-2xl p-6 text-center flex flex-col justify-center items-center shadow-lg">
                           <div className="text-5xl font-bold text-accent-green mb-1">{result.score}</div>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{t('speaking.overallScore')}</div>
                           <div className="w-full space-y-2">
                             {criteria.map((c, i) => (
                               <div key={i} className="flex justify-between items-center">
                                 <span className="text-[10px] text-slate-400">{c.label}</span>
                                 <span className="font-bold text-sm">{c.score}/9</span>
                               </div>
                             ))}
                           </div>
                       </div>

                       {/* Feedback */}
                       <div className="md:col-span-2 space-y-3">
                           <div className="bg-slate-50 rounded-xl p-4 border border-border">
                               <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-2 text-sm">
                                   <MessageSquare size={16} /> {t('speaking.transcript')}
                               </h4>
                               <p className="text-slate-600 italic text-sm">"{result.transcript}"</p>
                           </div>

                           <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                               <h4 className="font-bold text-yellow-800 mb-1 text-sm">{t('speaking.feedback')}</h4>
                               <p className="text-sm text-yellow-700">{result.feedback}</p>
                           </div>

                           {/* Detailed Criteria Feedback */}
                           <div className="bg-white rounded-xl border border-border overflow-hidden">
                             <button onClick={() => setShowDetails(!showDetails)}
                               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                               <span className="font-bold text-slate-700 text-sm">Detailed Criteria Feedback (4 IELTS Criteria)</span>
                               {showDetails ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                             </button>
                             {showDetails && (
                               <div className="border-t border-border p-4 space-y-4">
                                 {criteria.map((c, i) => (
                                   <div key={i}>
                                     <ScoreBar label={c.label} score={c.score} />
                                     {c.feedback && (
                                       <p className="text-xs text-slate-500 mt-1 ml-[108px]">{c.feedback}</p>
                                     )}
                                   </div>
                                 ))}
                               </div>
                             )}
                           </div>

                           <div className="flex justify-end gap-3 pt-1">
                               <audio src={audioUrl} controls className="h-10 w-full max-w-[200px]" />
                               <Button variant="secondary" onClick={reset}>{t('speaking.tryAgain')}</Button>
                               <Button onClick={nextTopic}>{t('speaking.nextTopic')} <ChevronRight size={16}/></Button>
                           </div>
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
}
