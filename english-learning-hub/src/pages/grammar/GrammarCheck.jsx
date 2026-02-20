import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Send, RotateCcw } from 'lucide-react';
import Button from '../../components/UI/Button';
import { aiAPI } from '../../services/api';

export default function GrammarCheck() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await aiAPI.grammarCheck(text);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not check grammar. Make sure the AI service is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Grammar Checker</h2>
        <p className="text-slate-500">Type or paste your English text below and AI will check for grammar errors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700">Your Text</h3>
            <span className="text-xs text-slate-400">{text.length} characters</span>
          </div>
          <textarea
            className="w-full h-64 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 placeholder:text-slate-400"
            placeholder="Example: I goes to school yesterday and meeted my friend there. We was very happy to see each others."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-3 mt-4">
            <Button onClick={handleCheck} disabled={loading || !text.trim()} className="flex-1">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Checking...</>
              ) : (
                <><Send size={16} className="mr-2" /> Check Grammar</>
              )}
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-slate-700 mb-4">AI Result</h3>

          {!result && !loading && !error && (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Enter text and click "Check Grammar" to start
            </div>
          )}

          {loading && (
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">AI is analyzing your text...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Status */}
              <div className={`flex items-center gap-3 p-4 rounded-xl ${result.is_correct ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                {result.is_correct ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <span className="font-medium">
                  {result.is_correct ? 'No grammar errors found!' : `Found ${result.errors?.length || 0} error(s)`}
                </span>
              </div>

              {/* Corrected text */}
              {!result.is_correct && result.corrected_text && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h4 className="font-bold text-green-800 text-sm mb-2">Corrected Text</h4>
                  <p className="text-green-700 text-sm leading-relaxed">{result.corrected_text}</p>
                </div>
              )}

              {/* Error details */}
              {result.errors && result.errors.length > 0 && (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-500 line-through text-sm">{err.original}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-green-600 font-medium text-sm">{err.correction}</span>
                      </div>
                      <p className="text-xs text-slate-500">{err.rule}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
