import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { speakingAPI } from '../../services/api';

const GREETING = {
  role: 'assistant',
  content: "Hi! I'm your AI IELTS examiner. Let's have a friendly chat to practice your Speaking. To start — could you tell me a little about yourself and what you like to do in your free time?",
};

const TOPIC_SUGGESTIONS = [
  'Free conversation',
  'Hobbies & free time',
  'Work & study',
  'Travel & holidays',
  'Technology in daily life',
];

export default function SpeakingChat() {
  const [topic, setTopic] = useState('Free conversation');
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Tự cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Lịch sử gửi lên BE chỉ gồm role + content
    const history = newMessages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await speakingAPI.chat(history, topic);
      const data = res.data;
      setMessages((prev) => {
        const updated = [...prev];
        // Gắn phần sửa lỗi vào ĐÚNG câu người dùng vừa gửi (phần tử cuối)
        if (data.has_error) {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            correction: data.correction,
            note: data.note,
          };
        }
        // Thêm câu trả lời của giám khảo
        updated.push({ role: 'assistant', content: data.reply });
        return updated;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I had a connection problem. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([GREETING]);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center justify-center gap-2">
          <Sparkles size={22} className="text-indigo-500" /> Speaking Chatbot
        </h2>
        <p className="text-slate-500 text-sm">Hội thoại với giám khảo AI — được sửa lỗi ngữ pháp ngay lập tức</p>
      </div>

      {/* Chọn chủ đề */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase">Topic:</span>
        {TOPIC_SUGGESTIONS.map((tp) => (
          <button
            key={tp}
            onClick={() => { setTopic(tp); resetChat(); }}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              topic === tp ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {tp}
          </button>
        ))}
      </div>

      {/* Khung hội thoại */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i}>
              <div className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {m.content}
                </div>
              </div>

              {/* Thẻ sửa lỗi ngữ pháp (chỉ hiện ở câu của người dùng có lỗi) */}
              {m.role === 'user' && m.correction && (
                <div className="mt-2 ml-auto max-w-[75%] bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold mb-1">
                    <AlertCircle size={14} /> Gợi ý sửa
                  </div>
                  <p className="text-sm text-slate-700">
                    <CheckCircle2 size={14} className="inline text-green-600 mr-1" />
                    {m.correction}
                  </p>
                  {m.note && <p className="text-xs text-slate-500 mt-1 italic">{m.note}</p>}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Ô nhập */}
        <div className="border-t border-slate-200 p-3 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your answer in English..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-50"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="text-center mt-3">
        <button onClick={resetChat} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          Bắt đầu lại cuộc hội thoại
        </button>
      </div>
    </div>
  );
}
