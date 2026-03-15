import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, ChevronRight, ChevronLeft, MessageSquare, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
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

const PARTS = [
  { id: 'Part 1', label: 'Part 1', desc: 'Introduction & Interview' },
  { id: 'Part 2', label: 'Part 2', desc: 'Long Turn (Cue Card)' },
  { id: 'Part 3', label: 'Part 3', desc: 'Discussion' },
];

export default function SpeakingAI() {
  const { t } = useLanguage();
  // View: 'parts' → 'topics' → 'practice'
  const [view, setView] = useState('parts');
  const [selectedPart, setSelectedPart] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Practice state
  const [status, setStatus] = useState('idle');
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Select a part → load topics
  const selectPart = async (part) => {
    setSelectedPart(part);
    setLoadingTopics(true);
    try {
      const res = await speakingAPI.getTopics(part.id);
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setTopics(data);
    } catch { setTopics([]); }
    setLoadingTopics(false);
    setView('topics');
  };

  // Select a topic → load questions
  const selectTopic = async (topic) => {
    try {
      const res = await speakingAPI.getTopicDetail(topic.id);
      setSelectedTopic(res.data);
      setQuestions(res.data.questions || []);
      setCurrentQIdx(0);
      resetPractice();
      setView('practice');
    } catch {
      setSelectedTopic(topic);
      setQuestions([]);
      setView('practice');
    }
  };

  const currentQuestion = questions[currentQIdx] || null;

  const nextQuestion = () => {
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx(currentQIdx + 1);
      resetPractice();
    }
  };

  const prevQuestion = () => {
    if (currentQIdx > 0) {
      setCurrentQIdx(currentQIdx - 1);
      resetPractice();
    }
  };

  const resetPractice = () => { setAudioUrl(null); setResult(null); setError(null); setStatus('idle'); setShowDetails(false); };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => { audioChunks.current.push(e.data); };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunks.current = [];
        setStatus('analyzing');
        setError(null);
        try {
          const response = await speakingAPI.uploadAudio(audioBlob, selectedTopic?.id, currentQuestion?.id);
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
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const criteria = result ? [
    { label: t('speaking.fluency'), score: result.fluency, feedback: result.fluency_feedback },
    { label: t('speaking.pronunciation'), score: result.pronunciation, feedback: result.pronunciation_feedback },
    { label: t('speaking.grammarScore'), score: result.grammar, feedback: result.grammar_feedback },
    { label: 'Lexical Resource', score: result.lexical_resource, feedback: result.lexical_feedback },
  ] : [];

  // ─── VIEW: SELECT PART ───
  if (view === 'parts') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('speaking.title')}</h2>
          <p className="text-slate-500">Choose an IELTS Speaking part to practice</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PARTS.map((part) => (
            <button key={part.id} onClick={() => selectPart(part)}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all text-center group">
              <div className="w-16 h-16 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center mx-auto mb-4 transition-colors">
                <span className="text-indigo-600 font-bold text-lg">{part.label.split(' ')[1]}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{part.label}</h3>
              <p className="text-sm text-slate-500">{part.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── VIEW: SELECT TOPIC ───
  if (view === 'topics') {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setView('parts')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Parts
        </button>

        <div className="mb-8">
          <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs uppercase">{selectedPart?.label}</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-1">{selectedPart?.desc}</h2>
          <p className="text-slate-500">Choose a topic to start practicing</p>
        </div>

        {loadingTopics ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No topics available for this part yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => (
              <button key={topic.id} onClick={() => selectTopic(topic)}
                className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{topic.title}</h4>
                    {topic.description && <p className="text-sm text-slate-400 mt-1">{topic.description}</p>}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                        {topic.questions_count} questions
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mic size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── VIEW: PRACTICE ───
  return (
    <div className="max-w-4xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setView('topics')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> {selectedTopic?.title}
        </button>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-bold">{selectedPart?.label}</span>
      </div>

      {/* Question navigation */}
      {questions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Question {currentQIdx + 1} / {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, idx) => (
                <button key={idx} onClick={() => { setCurrentQIdx(idx); resetPractice(); }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors
                    ${idx === currentQIdx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <p className="text-slate-800 text-lg font-medium leading-relaxed">
            "{currentQuestion?.question_text}"
          </p>
        </div>
      )}

      {error && <div className="mb-4 text-center text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

      {/* Main Interaction Area */}
      <div className="bg-white rounded-3xl shadow-soft border border-border p-12 min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

        {status === 'idle' && (
          <div className="z-10 text-center">
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
              <button onClick={stopRecording} className="relative w-24 h-24 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
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
          <div className="w-full z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <button onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <span className="font-bold text-slate-700 text-sm">Detailed Criteria</span>
                    {showDetails ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </button>
                  {showDetails && (
                    <div className="border-t border-border p-4 space-y-4">
                      {criteria.map((c, i) => (
                        <div key={i}>
                          <ScoreBar label={c.label} score={c.score} />
                          {c.feedback && <p className="text-xs text-slate-500 mt-1 ml-[108px]">{c.feedback}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <audio src={audioUrl} controls className="h-10 w-full max-w-[180px]" />
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={resetPractice}>{t('speaking.tryAgain')}</Button>
                    {currentQIdx < questions.length - 1 && (
                      <Button onClick={() => { nextQuestion(); }}>
                        Next Question <ChevronRight size={16}/>
                      </Button>
                    )}
                    {currentQIdx === questions.length - 1 && (
                      <Button onClick={() => setView('topics')}>
                        Done <ChevronRight size={16}/>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom question nav */}
      {questions.length > 1 && status === 'idle' && (
        <div className="flex justify-between mt-4">
          <button onClick={prevQuestion} disabled={currentQIdx === 0}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${currentQIdx === 0 ? 'text-slate-300' : 'text-slate-500 hover:text-slate-800'}`}>
            <ChevronLeft size={16} /> Previous
          </button>
          <button onClick={nextQuestion} disabled={currentQIdx === questions.length - 1}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${currentQIdx === questions.length - 1 ? 'text-slate-300' : 'text-slate-500 hover:text-slate-800'}`}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
