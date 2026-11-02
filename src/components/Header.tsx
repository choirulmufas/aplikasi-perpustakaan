import React from 'react';
import { BookOpen, Database, Sparkles, User, Settings2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workspace' | 'imk-spec' | 'supabase';
  setActiveTab: (tab: 'workspace' | 'imk-spec' | 'supabase') => void;
  isSupabase: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isSupabase }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar row */}
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo & System Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                  SIMPUS
                </h1>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/80 font-bold tracking-wider whitespace-nowrap shrink-0">
                  IMK Form Fill-In
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate mt-0.5">
                Sistem Penyimpanan Data Buku Berbasis 5 Langkah IMK
              </p>
            </div>
          </div>

          {/* Connection Status & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('supabase')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border shadow-2xs whitespace-nowrap ${
                isSupabase
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80'
              }`}
              title="Klik untuk konfigurasi database Supabase"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="font-mono text-[11px] sm:text-xs">
                {isSupabase ? (
                  <>
                    Supabase<span className="hidden sm:inline"> Terhubung</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Mode: </span>LocalStorage
                  </>
                )}
              </span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-200 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 leading-none">Admin01</p>
                <p className="text-[10px] text-slate-400">Pustakawan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Clean Horizontal Scroll without ugly scrollbar) */}
        <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/80 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Borang & Katalog Buku</span>
          </button>

          <button
            onClick={() => setActiveTab('imk-spec')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2 transition whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'imk-spec'
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/80 border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>2. Panduan 5 Langkah IMK</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2 transition whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/80 border border-transparent'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>3. Integrasi Supabase & SQL</span>
          </button>
        </div>
      </div>
    </header>
  );
};
