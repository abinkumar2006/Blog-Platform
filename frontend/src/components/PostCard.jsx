import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart, Clock, Calendar } from 'lucide-react';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Cover Image */}
      <Link to={`/posts/${post._id}`} className="relative block aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-indigo-700 rounded-full shadow-sm">
            {post.category || 'General'}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Meta Header */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formattedDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {post.readTime || 1} min read
          </span>
        </div>

        {/* Title */}
        <Link to={`/posts/${post._id}`}>
          <h2 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
            {post.title}
          </h2>
        </Link>

        {/* Summary */}
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
          {post.summary}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-[11px] font-medium text-slate-400 self-center">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer info: Author & Stats */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2.5">
            <img
              src={post.author?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.author?.username || 'user'}`}
              alt={post.author?.username}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-semibold text-slate-700">
              {post.author?.username || 'Anonymous'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1" title="Likes">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              {post.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1" title="Comments">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              {post.commentsCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
