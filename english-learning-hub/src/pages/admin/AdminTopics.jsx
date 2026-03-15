import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { adminAPI } from '../../services/api';

const PARTS = ['Part 1', 'Part 2', 'Part 3'];

const emptyTopic = () => ({ title: '', part: 'Part 1', description: '', order: 0, questions: [] });
const emptyQuestion = () => ({ question_text: '', order: 0 });

export default function AdminTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTopic());
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [partFilter, setPartFilter] = useState('');
  const [expandedQ, setExpandedQ] = useState(null);

  const fetchTopics = () => {
    setLoading(true);
    adminAPI.getTopics()
      .then(res => setTopics(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTopics(); }, []);

  const filtered = partFilter ? topics.filter(t => t.part === partFilter) : topics;

  const openCreate = () => {
    setForm(emptyTopic());
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (topic) => {
    // Fetch full topic with questions
    adminAPI.getTopics().then(res => {
      const full = res.data.find(t => t.id === topic.id);
      setForm(full || topic);
      setEditId(topic.id);
      setShowForm(true);
    });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete topic "${title}"?`)) return;
    try {
      await adminAPI.deleteTopic(id);
      setTopics(topics.filter(t => t.id !== id));
    } catch { alert('Failed to delete'); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await adminAPI.updateTopic(editId, form);
      } else {
        await adminAPI.createTopic(form);
      }
      setShowForm(false);
      fetchTopics();
    } catch (err) {
      alert('Failed to save: ' + JSON.stringify(err.response?.data || err.message));
    } finally { setSaving(false); }
  };

  const addQuestion = () => {
    const q = emptyQuestion();
    q.order = form.questions.length;
    setForm({ ...form, questions: [...form.questions, q] });
  };

  const removeQuestion = (idx) => {
    setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });
  };

  const updateQuestion = (idx, value) => {
    const qs = [...form.questions];
    qs[idx] = { ...qs[idx], question_text: value };
    setForm({ ...form, questions: qs });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">Speaking Topics Management</h2>
        <div className="flex gap-2">
          <select value={partFilter} onChange={(e) => setPartFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Parts</option>
            {PARTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> New Topic
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No topics found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Part</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Title</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Questions</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Order</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(topic => (
                <tr key={topic.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                      ${topic.part === 'Part 1' ? 'bg-green-100 text-green-700' :
                        topic.part === 'Part 2' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {topic.part}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-slate-800">{topic.title}</div>
                    {topic.description && <div className="text-xs text-slate-400">{topic.description}</div>}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{topic.questions_count || 0}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{topic.order}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(topic)}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => handleDelete(topic.id, topic.title)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">{editId ? 'Edit Topic' : 'Create New Topic'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Daily Routine"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Part *</label>
                  <select value={form.part} onChange={(e) => setForm({ ...form, part: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    {PARTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the topic"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              {/* Questions */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-700 text-sm">Questions ({form.questions?.length || 0})</h4>
                  <button onClick={addQuestion}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200">
                    <Plus size={14} /> Add Question
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(form.questions || []).map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-8 flex items-center justify-center text-xs font-bold text-slate-400">{idx + 1}.</span>
                      <textarea value={q.question_text} onChange={(e) => updateQuestion(idx, e.target.value)}
                        rows={2} placeholder="Enter question..."
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none" />
                      <button onClick={() => removeQuestion(idx)}
                        className="mt-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {saving ? 'Saving...' : (editId ? 'Update Topic' : 'Create Topic')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
