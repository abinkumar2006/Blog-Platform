import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../api/client';

const CATEGORIES = [
  'Technology',
  'Programming',
  'Web Development',
  'Design',
  'AI & ML',
  'Career',
  'Tutorials',
  'General',
];

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/posts/${id}`);
        const p = res.data.post;

        // Check ownership
        if (user && p.author?._id !== user.id) {
          alert('You are not authorized to edit this article.');
          navigate(`/posts/${id}`);
          return;
        }

        setTitle(p.title);
        setCategory(p.category || 'Technology');
        setCoverImage(p.coverImage || '');
        setTags(p.tags?.join(', ') || '');
        setContent(p.content);
        setSummary(p.summary || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.put(`/posts/${id}`, {
        title: title.trim(),
        content,
        summary: summary.trim() || undefined,
        category,
        coverImage,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Loading post details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel & Back
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Edit Article
        </h1>
        <p className="text-slate-500 text-sm mt-1">Make updates to your published article.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Article Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
            required
          />
        </div>

        {/* Category & Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              Cover Image URL
            </span>
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition mb-3"
          />
        </div>

        {/* Markdown Content Editor with Live Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span>Markdown Content <span className="text-rose-500">*</span></span>
            <span className="text-indigo-600 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Live Preview
            </span>
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Edit your markdown content..."
          />
        </div>

        {/* Optional Excerpt */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Summary / Excerpt
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Saving Changes...' : 'Save & Publish Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
