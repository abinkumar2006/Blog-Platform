import React from 'react';
import { BookOpen, Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">PenCraft Blog Platform</p>
              <p className="text-xs text-slate-500">MERN Stack Architecture with Markdown Support & REST APIs</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Built with</span>
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>MongoDB • Express • React • Node.js</span>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} PenCraft. Created for full-stack mastery.
          </p>
        </div>
      </div>
    </footer>
  );
}
