import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Search, Sparkles, BookOpen, Layers, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client';

const CATEGORIES = [
  'All',
  'Technology',
  'Programming',
  'Web Development',
  'Design',
  'AI & ML',
  'Tutorials',
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentTag = searchParams.get('tag') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          page: currentPage,
          limit: 6,
        };

        if (currentCategory && currentCategory !== 'All') {
          params.category = currentCategory;
        }
        if (currentSearch) {
          params.search = currentSearch;
        }
        if (currentTag) {
          params.tag = currentTag;
        }

        const res = await api.get('/posts', { params });
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
        setTotalPosts(res.data.total);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentCategory, currentSearch, currentTag, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearTag = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('tag');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Discover stories, tutorials & ideas
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Where Developers Share <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              Insightful Perspectives
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Explore articles on full-stack engineering, web design, and technology.
            Write in markdown and engage with developer conversations.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto relative flex items-center"
          >
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles by title, topic or keywords..."
                className="w-full pl-12 pr-28 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-indigo-100/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm transition"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Active Tag filter indicator */}
          {currentTag && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-slate-500">Filtered by tag:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                #{currentTag}
                <button onClick={handleClearTag} title="Clear tag filter">
                  <X className="w-3.5 h-3.5 hover:text-indigo-900" />
                </button>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 mb-8 border-b border-slate-200 no-scrollbar">
          <div className="flex items-center gap-2 flex-shrink-0">
            {CATEGORIES.map((cat) => {
              const active =
                cat === currentCategory || (cat === 'All' && !searchParams.get('category'));
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap hidden sm:inline">
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse h-96 flex flex-col p-5"
              >
                <div className="bg-slate-200 rounded-xl h-48 mb-4 w-full" />
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-6 bg-slate-200 rounded w-4/5 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mt-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center max-w-md mx-auto my-12">
            <p className="text-rose-700 font-semibold mb-2">Error loading posts</p>
            <p className="text-rose-600 text-xs mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto my-8 px-6">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No articles found</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              We couldn't find any articles matching your search or filters. Try adjusting your search query or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchInput('');
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Post Grid */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1 px-3 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
