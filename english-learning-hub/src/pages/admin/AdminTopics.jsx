import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { adminAPI } from '../../services/api';

const emptyTopic = () => ({ title: '', category: 'IELTS Speaking Part 1', prompt_question: '', order: 0 });

export default function AdminTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTopic());
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTopics = () => {
    setLoading(true);
    adminAPI.getTopics()
      .then(res => setTopics(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTopics(); }, []);

  const openCreate = () => {
    setForm(emptyTopic());
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (topic) => {
    setForm({ ...topic });
    setEditId(topic.id);
    setShowForm(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete topic "${title}"?`)) return;
    try {
      await adminAPI.deleteTopic(id);
      setTopics(topics.filter(t => t.id !== id));
    } catch { alert('Failed to delete'); }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.prompt_question.trim()) {
      alert('Title and question are required');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        const res = await adminAPI.updateTopic(editId, form);
        setTopics(topics.map(t => t.id === editId ? res.data : t));
      } else {
        const res = await adminAPI.createTopic(form);
        setTopics([...topics, res.data]);
      }
      setShowForm(false);
    } catch (err) {
      alert('Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Speaking Topics Management</h2>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> New Topic
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No topics found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Order</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Title</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Category</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase">Question</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => (
                <tr key={topic.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-sm text-slate-600">{topic.order}</td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{topic.title}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                      {topic.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 max-w-xs truncate">{topic.prompt_question}</td>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">{editId ? 'Edit Topic' : 'Create New Topic'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Education & Technology"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  <option value="IELTS Speaking Part 1">IELTS Speaking Part 1</option>
                  <option value="IELTS Speaking Part 2">IELTS Speaking Part 2</option>
                  <option value="IELTS Speaking Part 3">IELTS Speaking Part 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Prompt Question *</label>
                <textarea value={form.prompt_question} onChange={(e) => setForm({ ...form, prompt_question: e.target.value })}
                  rows={4} placeholder="The question that will be asked to the user..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
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
