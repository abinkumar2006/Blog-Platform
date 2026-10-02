import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PenLine,
  BookOpen,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                PenCraft
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 -mt-1">
                Full-Stack Blog
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/create-post"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow-indigo-300 active:scale-95"
                >
                  <PenLine className="w-4 h-4" />
                  Write Post
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.username}`}
                      alt={user?.username}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-sm font-medium text-slate-700 hidden lg:inline">
                      {user?.username}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          @{user?.username}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile & Posts
                      </Link>

                      <Link
                        to="/create-post"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <PenLine className="w-4 h-4" />
                        Create New Post
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-slate-700 font-medium"
          >
            <Compass className="w-5 h-5 text-indigo-500" />
            Explore Articles
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-indigo-600 font-semibold"
              >
                <PenLine className="w-5 h-5" />
                Write New Post
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium"
              >
                <UserIcon className="w-5 h-5 text-slate-400" />
                Profile & My Posts
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 py-2 text-rose-600 font-medium w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-300 font-medium text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
