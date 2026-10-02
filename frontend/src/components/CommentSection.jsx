import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Trash2, Send, CornerDownRight } from 'lucide-react';
import api from '../api/client';

export default function CommentSection({
  postId,
  postAuthorId,
  comments,
  onCommentAdded,
  onCommentDeleted,
}) {
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content: commentText,
      });
      setCommentText('');
      if (onCommentAdded) {
        onCommentAdded(res.data.comment);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit comment. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      if (onCommentDeleted) {
        onCommentDeleted(commentId);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  return (
    <section className="mt-12 pt-10 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        <h3 className="text-2xl font-bold text-slate-900">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-4">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username}`}
              alt={user?.username}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="relative border border-slate-300 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all bg-white">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or feedback on this article..."
                  rows={3}
                  className="w-full p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
                />
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Be constructive and respectful
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
              {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-slate-100/70 border border-slate-200 rounded-2xl text-center">
          <p className="text-slate-700 font-medium text-sm mb-3">
            Join the conversation! Log in to share your thoughts and interact with the author.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700 transition"
            >
              Sign In to Comment
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-medium">No comments yet.</p>
            <p className="text-slate-400 text-xs">Be the first to leave a thought!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isCommentAuthor = user && comment.author?._id === user.id;
            const isPostOwner = user && postAuthorId === user.id;
            const canDelete = isCommentAuthor || isPostOwner;

            const commentDate = new Date(comment.createdAt).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            );

            return (
              <div
                key={comment._id}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex gap-4"
              >
                <img
                  src={
                    comment.author?.avatar ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author?.username || 'user'}`
                  }
                  alt={comment.author?.username}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {comment.author?.username || 'User'}
                      </span>
                      {comment.author?._id === postAuthorId && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                          Author
                        </span>
                      )}
                      <span className="text-xs text-slate-400">• {commentDate}</span>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title={
                          isPostOwner && !isCommentAuthor
                            ? 'Moderate comment (Post Owner)'
                            : 'Delete your comment'
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
