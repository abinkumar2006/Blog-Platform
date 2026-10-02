import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import CommentSection from '../components/CommentSection';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Edit,
  Trash2,
  ArrowLeft,
  Share2,
  Tag,
  Check,
} from 'lucide-react';
import api from '../api/client';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      setError('');
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ]);

        const fetchedPost = postRes.data.post;
        setPost(fetchedPost);
        setLiked(fetchedPost.isLiked);
        setLikesCount(fetchedPost.likes?.length || 0);
        setComments(commentsRes.data.comments || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to like this post.');
      navigate('/login');
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const res = await api.post(`/posts/${id}/like`);
      setLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
        <div className="h-12 bg-slate-200 rounded w-3/4 mb-6" />
        <div className="h-80 bg-slate-200 rounded-3xl mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-xl font-bold text-slate-800 mb-2">Article Not Found</p>
        <p className="text-sm text-slate-500 mb-6">{error || 'This article could not be loaded.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Articles
        </Link>
      </div>
    );
  }

  const isAuthor = user && post.author?._id === user.id;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {isAuthor && (
            <>
              <Link
                to={`/edit-post/${post._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime || 1} min read
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views} views
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author Bio Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <img
            src={
              post.author?.avatar ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${post.author?.username || 'user'}`
            }
            alt={post.author?.username}
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm">
              {post.author?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {post.author?.bio || 'Author & Contributor'}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 hidden sm:block">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Published {formattedDate}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {post.coverImage && (
        <div className="relative aspect-[21/9] sm:aspect-[16/7] rounded-3xl overflow-hidden mb-10 shadow-md">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body Rendered with Markdown */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs mb-10">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Post Tags & Like Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-slate-200">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-slate-400 mr-1" />
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tag, idx) => (
              <Link
                key={idx}
                to={`/?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-semibold px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition"
              >
                #{tag}
              </Link>
            ))
          ) : (
            <span className="text-xs text-slate-400">No tags specified</span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          disabled={likeLoading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            liked
              ? 'bg-rose-50 border border-rose-200 text-rose-600'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-200 hover:text-rose-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{liked ? 'Liked' : 'Like'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
            {likesCount}
          </span>
        </button>
      </div>

      {/* Discussion & Comments */}
      <CommentSection
        postId={post._id}
        postAuthorId={post.author?._id}
        comments={comments}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />
    </article>
  );
}
