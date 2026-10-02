import React, { useState, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import {
  Bold,
  Italic,
  Heading2,
  Code,
  Quote,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Columns,
  Eye,
  Edit3,
} from 'lucide-react';

export default function MarkdownEditor({ value, onChange, placeholder = 'Write your story in markdown...' }) {
  const [activeTab, setActiveTab] = useState('split'); // 'edit' | 'split' | 'preview'
  const textareaRef = useRef(null);

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
      {/* Top Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Markdown Action Buttons */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            title="Bold"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            title="Italic"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('## ')}
            title="Heading 2"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting('```javascript\n', '\n```')}
            title="Code Block"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            title="Blockquote"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            title="Bullet List"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <List className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting('[', '](https://example.com)')}
            title="Link"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('![Image description](', ')')}
            title="Image"
            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 transition"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
              activeTab === 'edit'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
              activeTab === 'split'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split View</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
              activeTab === 'preview'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Panels */}
      <div className="min-h-[420px] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Editor Area */}
        <div
          className={`${
            activeTab === 'preview' ? 'hidden' : 'block'
          } ${activeTab === 'edit' ? 'col-span-2' : ''} flex flex-col`}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={16}
            className="w-full flex-1 p-4 font-mono text-sm leading-relaxed text-slate-800 placeholder-slate-400 bg-white focus:outline-none resize-none"
          />
        </div>

        {/* Live Preview Area */}
        <div
          className={`${
            activeTab === 'edit' ? 'hidden' : 'block'
          } ${activeTab === 'preview' ? 'col-span-2' : ''} p-5 bg-slate-50/50 overflow-y-auto max-h-[600px]`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Eye className="w-3 h-3" />
            Live Preview
          </div>
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-slate-400 italic text-sm py-8 text-center">
              Write markdown on the left to see the live rendered output here.
            </p>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
          Markdown formatting supported
        </span>
      </div>
    </div>
  );
}
