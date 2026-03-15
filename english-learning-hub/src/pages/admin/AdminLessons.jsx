import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { adminAPI } from '../../services/api';

const emptyQuestion = () => ({
  text: '', order: 0,
  options: [
    { text: '', is_correct: true, order: 0 },
    { text: '', is_correct: false, order: 1 },
    { text: '', is_correct: false, order: 2 },
    { text: '', is_correct: false, order: 3 },
  ]
});

const emptyLesson = () => ({
  title: '', lesson_type: 'reading', level: 'Beginner', tag: '',
  image: '', duration: '5 min', reading_text: '', is_recommended: false, order: 0,
  questions: [],
});

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyLesson());
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [expandedQ, setExpandedQ] = useState(null);

  const fetchLessons = () => {
    setLoading(true);
    const params = {};
    if (typeFilter) params.type = typeFilter;
    adminAPI.getLessons(params)
      .then(res => setLessons(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLessons(); }, [typeFilter]);

  const openCreate = () => {
    setForm(emptyLesson());
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await adminAPI.getLesson(id);
      setForm(res.data);
      setEditId(id);
      setShowForm(true);
    } catch { alert('Failed to load lesson'); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      await adminAPI.deleteLesson(id);
      setLessons(lessons.filter(l => l.id !== id));
    } catch { alert('Failed to delete'); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await adminAPI.updateLesson(editId, form);
      } else {
        await adminAPI.createLesson(form);
      }
      setShowForm(false);
      fetchLessons();
    } catch (err) {
      alert('Failed to save: ' + JSON.stringify(err.response?.data || err.message));
    } finally { setSaving(false); }
  };

  // Question helpers
  const addQuestion = () => {
    const q = emptyQuestion();
    q.order = form.questions.length;
    setForm({ ...form, questions: [...form.questions, q] });
    setExpandedQ(form.questions.length);
  };

  const removeQuestion = (idx) => {
    const qs = form.questions.filter((_, i) => i !== idx);
    setForm({ ...form, questions: qs });
  };

  const updateQuestion = (idx, field, value) => {
    const qs = [...form.questions];
    qs[idx] = { ...qs[idx], [field]: value };
    setForm({ ...form, questions: qs });
  };

  const updateOption = (qIdx, oIdx, field, value) => {
    const qs = [...form.questions];
    const opts = [...qs[qIdx].options];
    if (field === 'is_correct' && value) {
      opts.forEach((o, i) => { opts[i] = { ...o, is_correct: i === oIdx }; });
    } else {
      opts[oIdx] = { ...opts[oIdx], [field]: value };
    }
    qs[qIdx] = { ...qs[qIdx], options: opts };
    setForm({ ...form, questions: qs });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">Lesson Management</h2>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Types</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
          </select>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> New Lesson
          </button>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No lessons found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Lesson</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Level</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Tag</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Questions</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(lesson => (
                <tr key={lesson.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-slate-800">{lesson.title}</div>
                    <div className="text-xs text-slate-400">{lesson.duration}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize
                      ${lesson.lesson_type === 'reading' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {lesson.lesson_type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                      ${lesson.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        lesson.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {lesson.level}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{lesson.tag || '-'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{lesson.questions_count}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(lesson.id)}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => handleDelete(lesson.id, lesson.title)}
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
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">{editId ? 'Edit Lesson' : 'Create New Lesson'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
                <select value={form.lesson_type} onChange={(e) => setForm({ ...form, lesson_type: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  <option value="reading">Reading</option>
                  <option value="listening">Listening</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tag</label>
                <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="e.g. Business, Science..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Duration</label>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g. 5 min"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Image URL</label>
                <input value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Reading Text</label>
                <textarea value={form.reading_text} onChange={(e) => setForm({ ...form, reading_text: e.target.value })}
                  rows={5} placeholder="Article content for reading lessons..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="recommended" checked={form.is_recommended}
                  onChange={(e) => setForm({ ...form, is_recommended: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="recommended" className="text-sm text-slate-600">Recommended</label>
              </div>
            </div>

            {/* Questions Section */}
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-700 text-sm">Questions ({form.questions.length})</h4>
                <button onClick={addQuestion}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200">
                  <Plus size={14} /> Add Question
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {form.questions.map((q, qIdx) => (
                  <div key={qIdx} className="border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-t-lg cursor-pointer"
                      onClick={() => setExpandedQ(expandedQ === qIdx ? null : qIdx)}>
                      <span className="text-sm font-medium text-slate-700">
                        Q{qIdx + 1}: {q.text || '(empty)'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); removeQuestion(qIdx); }}
                          className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        {expandedQ === qIdx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>
                    {expandedQ === qIdx && (
                      <div className="p-3 space-y-3">
                        <input value={q.text} onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                          placeholder="Question text..."
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <input type="radio" name={`correct-${qIdx}`} checked={opt.is_correct}
                                onChange={() => updateOption(qIdx, oIdx, 'is_correct', true)}
                                className="text-indigo-600 focus:ring-indigo-500" />
                              <input value={opt.text} onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                                placeholder={`Option ${oIdx + 1}`}
                                className={`flex-1 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none
                                  ${opt.is_correct ? 'border-green-300 bg-green-50' : 'border-slate-200'}`} />
                            </div>
                          ))}
                          <p className="text-[10px] text-slate-400">Select radio button to mark correct answer</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {saving ? 'Saving...' : (editId ? 'Update Lesson' : 'Create Lesson')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
