import React, { useState } from 'react';
import { Send, RotateCcw, FileText } from 'lucide-react';
import Button from '../../components/UI/Button';
import { aiAPI } from '../../services/api';

const ScoreBar = ({ label, score, max = 9 }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-slate-600 w-40">{label}</span>
    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${(score / max) * 100}%` }}
      />
    </div>
    <span className="text-sm font-bold text-slate-900 w-8 text-right">{score}</span>
  </div>
);

export default function WritingAssess() {
  const [topic, setTopic] = useState('');
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAssess = async () => {
    if (!essay.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await aiAPI.assessWriting(essay, topic);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not assess writing. Make sure the AI service is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setEssay('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">IELTS Writing Assessment</h2>
        <p className="text-slate-500">Submit your essay and AI will score it based on 4 IELTS Writing criteria.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input - Left side */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Essay Topic (Optional)</label>
            <input
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 placeholder:text-slate-400"
              placeholder="e.g. Some people think that technology is making our lives easier..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-slate-700">Your Essay</label>
              <span className="text-xs text-slate-400">{essay.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <textarea
              className="w-full h-72 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 placeholder:text-slate-400 leading-relaxed"
              placeholder="Write your essay here (minimum 150 words recommended)..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAssess} disabled={loading || !essay.trim()} className="flex-1">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Assessing...</>
              ) : (
                <><Send size={16} className="mr-2" /> Assess My Writing</>
              )}
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>

        {/* Result - Right side */}
        <div className="lg:col-span-2 space-y-4">
          {!result && !loading && !error && (
            <div className="bg-white rounded-2xl border border-border p-6 h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center">
              <FileText size={40} className="mb-4 opacity-30" />
              Write your essay and click "Assess My Writing" to get IELTS scores
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">AI is grading your essay...</p>
              <p className="text-slate-400 text-sm mt-1">This may take a few seconds</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
          )}

          {result && (
            <>
              {/* Overall Score */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 text-center">
                <div className="text-5xl font-bold text-accent-green mb-1">{result.overall_score}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Overall Band Score</div>
              </div>

              {/* Criteria Scores */}
              <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
                <h4 className="font-bold text-slate-700 text-sm">Scoring Breakdown</h4>
                <ScoreBar label="Task Achievement" score={result.task_achievement} />
                <ScoreBar label="Coherence & Cohesion" score={result.coherence_cohesion} />
                <ScoreBar label="Lexical Resource" score={result.lexical_resource} />
                <ScoreBar label="Grammar Accuracy" score={result.grammar_accuracy} />
              </div>

              {/* Feedback */}
              <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-6">
                <h4 className="font-bold text-yellow-800 mb-2">AI Feedback</h4>
                <p className="text-sm text-yellow-700 leading-relaxed">{result.feedback}</p>
              </div>

              {/* Corrections */}
              {result.corrections && result.corrections.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h4 className="font-bold text-slate-700 mb-3 text-sm">Suggested Corrections</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {result.corrections.map((c, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-red-500 line-through text-sm">{c.original}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-green-600 font-medium text-sm">{c.corrected}</span>
                        </div>
                        <p className="text-xs text-slate-500">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
