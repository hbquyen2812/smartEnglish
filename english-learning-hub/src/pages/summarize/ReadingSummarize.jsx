import React, { useState } from 'react';
import { Send, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { aiAPI } from '../../services/api';

export default function ReadingSummarize() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await aiAPI.summarizeText(text);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not summarize text. Make sure the AI service is configured.');
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Reading Summarizer & Vocabulary</h2>
        <p className="text-slate-500">Paste any English article and AI will summarize it and extract 10 important vocabulary words.</p>
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-700">Paste your article</h3>
          <span className="text-xs text-slate-400">{text.split(/\s+/).filter(Boolean).length} words</span>
        </div>
        <textarea
          className="w-full h-48 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 placeholder:text-slate-400 leading-relaxed"
          placeholder="Paste an English article, news, or any text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <Button onClick={handleSummarize} disabled={loading || !text.trim()} className="flex-1">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Processing...</>
            ) : (
              <><Sparkles size={16} className="mr-2" /> Summarize & Extract Vocabulary</>
            )}
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6">{error}</div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl border border-border p-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">AI is reading and analyzing your text...</p>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-primary" />
              <h3 className="font-bold text-slate-700">Summary</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">{result.summary}</p>
          </div>

          {/* Vocabulary */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-slate-700 mb-4">Key Vocabulary ({result.vocabulary?.length || 0} words)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.vocabulary && result.vocabulary.map((word, i) => (
                <div key={i} className="bg-white rounded-xl border border-border p-4 hover:shadow-soft transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="font-bold text-lg text-slate-900">{word.word}</span>
                    {word.part_of_speech && <Badge text={word.part_of_speech} color="purple" />}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{word.definition}</p>
                  {word.example_sentence && (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded-lg">"{word.example_sentence}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
