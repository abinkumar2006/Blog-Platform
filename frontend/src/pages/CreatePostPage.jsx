import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';
import { PenLine, ArrowLeft, Image as ImageIcon, Send, Sparkles } from 'lucide-react';
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

const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
];

const DEFAULT_MARKDOWN = `# Your Article Title Here

Welcome to the markdown editor! You can write technical guides, tutorials, or opinion pieces with ease.

### Features
- Live preview side-by-side
- Full **bold**, *italics*, and [links](https://google.com)
- Fenced code blocks with syntax highlighting

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

> "A journey of a thousand miles begins with a single step."
`;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState(SAMPLE_COVERS[0]);
  const [tags, setTags] = useState('React, JavaScript, WebDev');
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your article.');
      return;
    }
    if (!content.trim()) {
      setError('Please provide content for your article.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/posts', {
        title: title.trim(),
        content,
        summary: summary.trim() || undefined,
        category,
        coverImage,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      navigate(`/posts/${res.data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post. Please check your fields.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel & Exit
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            All changes saved locally
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-2">
          <PenLine className="w-3.5 h-3.5" />
          Drafting New Story
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Create New Article
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Article Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging, descriptive title..."
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
              placeholder="e.g. React, Node.js, Tutorial"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* Cover Image Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              Cover Image URL
            </span>
            <span className="text-slate-400 text-[11px] normal-case">
              Select a preset or paste a custom image URL
            </span>
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition mb-3"
          />

          {/* Quick presets */}
          <div className="grid grid-cols-4 gap-3">
            {SAMPLE_COVERS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCoverImage(url)}
                className={`relative aspect-[16/9] rounded-lg overflow-hidden border-2 transition ${
                  coverImage === url ? 'border-indigo-600 scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Markdown Content Editor with Live Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span>Markdown Content with Live Preview <span className="text-rose-500">*</span></span>
            <span className="text-indigo-600 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Markdown Live Preview
            </span>
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Compose your article in Markdown..."
          />
        </div>

        {/* Optional Excerpt / Summary */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span>Custom Summary (Optional)</span>
            <span className="text-slate-400 text-[11px] font-normal">
              Leave blank to automatically generate from content
            </span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief summary to show on post preview cards..."
            rows={2}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
          />
        </div>

        {/* Submit Actions */}
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
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Publishing Story...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
