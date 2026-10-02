import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import {
  User,
  Mail,
  Calendar,
  PenLine,
  BookOpen,
  Edit2,
  Check,
  Heart,
  MessageSquare,
  Eye,
  Trash2,
} from 'lucide-react';
import api from '../api/client';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(user?.bio || '');
  const [newAvatar, setNewAvatar] = useState(user?.avatar || '');
  const [savingBio, setSavingBio] = useState(false);
  const [bioSuccess, setBioSuccess] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.get('/posts', {
          params: { author: user.id, limit: 50 },
        });
        setUserPosts(res.data.posts);
      } catch (err) {
        console.error('Failed to load user posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingBio(true);
    setBioSuccess('');

    try {
      const res = await api.put('/auth/profile', {
        bio: newBio,
        avatar: newAvatar || undefined,
      });

      updateUser(res.data.user);
      setIsEditingBio(false);
      setBioSuccess('Profile updated successfully!');
      setTimeout(() => setBioSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingBio(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete article');
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recent';

  const totalLikes = userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const totalViews = userPosts.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username}`
            }
            alt={user?.username}
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 shadow-md flex-shrink-0"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {user?.username}
                </h1>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <button
                  onClick={() => setIsEditingBio(!isEditingBio)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  {isEditingBio ? 'Cancel Editing' : 'Edit Profile'}
                </button>
                <Link
                  to="/create-post"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  New Story
                </Link>
              </div>
            </div>

            {bioSuccess && (
              <p className="text-xs text-emerald-600 font-semibold mb-2">{bioSuccess}</p>
            )}

            {isEditingBio ? (
              <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-200"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Custom Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingBio}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  {savingBio ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            ) : (
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                {user?.bio || 'No bio provided yet.'}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joined {memberSince}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                {userPosts.length} Articles Published
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                {totalLikes} Total Likes
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                {totalViews} Total Views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Authored Articles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            My Published Articles ({userPosts.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-base mb-1">No articles published yet</p>
            <p className="text-slate-400 text-xs mb-5">
              Ready to share your insights with the community? Write your first post!
            </p>
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <PenLine className="w-4 h-4" />
              Write First Article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div key={post._id} className="relative group">
                <PostCard post={post} />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/edit-post/${post._id}`}
                    title="Edit article"
                    className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    title="Delete article"
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
