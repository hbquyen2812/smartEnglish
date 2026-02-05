import React, { useState, useRef } from 'react';
import { Mic, Square, RefreshCw, ChevronRight, MessageSquare } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function SpeakingAI() {
  const [status, setStatus] = useState('idle'); // idle | recording | analyzing | result
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      audioChunks.current = [];
      
      // Giả lập gửi lên server
      handleAnalyze();
    };

    mediaRecorderRef.current.start();
    setStatus('recording');
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setStatus('analyzing');
  };

  const handleAnalyze = () => {
    // Gọi API Django ở đây: await api.speaking.uploadAudio(...)
    
    setTimeout(() => {
        setResult({
            score: 7.5,
            transcript: "I believe technology plays a crucial role in modern education because it allows students to access information instantly.",
            feedback: "Great sentence structure! Your pronunciation of 'crucial' was perfect. Try to pause slightly after 'education' for better flow.",
            fluency: 8,
            pronunciation: 7,
            grammar: 8
        });
        setStatus('result');
    }, 2500); // Giả lập AI chạy mất 2.5s
  };

  const reset = () => {
      setAudioUrl(null);
      setResult(null);
      setStatus('idle');
  };

  return (
    <div className="max-w-4xl mx-auto">
       {/* Topic Header */}
       <div className="text-center mb-10">
           <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">IELTS Speaking Part 3</span>
           <h2 className="text-3xl font-bold mt-4 text-slate-900">Topic: Education & Technology</h2>
           <p className="text-slate-500 mt-2 text-lg">"How has technology changed the way we learn?"</p>
       </div>

       {/* Main Interaction Area */}
       <div className="bg-white rounded-3xl shadow-soft border border-border p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
           
           {/* Background Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.03]" 
                style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
           </div>

           {status === 'idle' && (
               <div className="z-10 text-center animate-fade-in">
                   <button onClick={startRecording} className="w-24 h-24 bg-primary hover:bg-slate-800 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 group">
                       <Mic size={40} className="text-white group-hover:animate-bounce" />
                   </button>
                   <p className="mt-6 text-slate-500 font-medium">Click microphone to start answering</p>
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
                   <p className="mt-6 text-red-500 font-bold animate-pulse">Recording... (00:05)</p>
               </div>
           )}

           {status === 'analyzing' && (
               <div className="z-10 text-center">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6 mx-auto"></div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing your speech</h3>
                   <p className="text-slate-500">AI is checking pronunciation, grammar, and fluency...</p>
               </div>
           )}

           {status === 'result' && result && (
               <div className="w-full z-10 animate-fade-in-up">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {/* Score Card */}
                       <div className="bg-slate-900 text-white rounded-2xl p-6 text-center flex flex-col justify-center items-center shadow-lg">
                           <div className="text-6xl font-bold text-accent-green mb-2">{result.score}</div>
                           <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Overall Score</div>
                           <div className="flex gap-4 mt-6 w-full justify-center">
                               <div><div className="font-bold text-lg">{result.fluency}</div><div className="text-[10px] text-slate-400">Fluency</div></div>
                               <div><div className="font-bold text-lg">{result.pronunciation}</div><div className="text-[10px] text-slate-400">Pronun.</div></div>
                               <div><div className="font-bold text-lg">{result.grammar}</div><div className="text-[10px] text-slate-400">Grammar</div></div>
                           </div>
                       </div>

                       {/* Feedback */}
                       <div className="md:col-span-2 space-y-4">
                           <div className="bg-slate-50 rounded-xl p-5 border border-border">
                               <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                                   <MessageSquare size={18} /> Transcript
                               </h4>
                               <p className="text-slate-600 italic">"{result.transcript}"</p>
                           </div>
                           <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                               <h4 className="font-bold text-yellow-800 mb-1">AI Feedback</h4>
                               <p className="text-sm text-yellow-700">{result.feedback}</p>
                           </div>
                           <div className="flex justify-end gap-3 pt-2">
                               <audio src={audioUrl} controls className="h-10 w-full max-w-[200px]" />
                               <Button variant="secondary" onClick={reset}>Try Again</Button>
                               <Button>Next Topic <ChevronRight size={16}/></Button>
                           </div>
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
}