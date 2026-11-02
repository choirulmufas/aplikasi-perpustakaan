import React, { useState } from 'react';
import {
  Database,
  Plug,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
  SUPABASE_SQL_SCHEMA,
} from '../lib/supabase';

interface SupabaseTabProps {
  onConfigUpdated: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SupabaseTab: React.FC<SupabaseTabProps> = ({
  onConfigUpdated,
  showToast,
}) => {
  const [url, setUrl] = useState(() => getSupabaseCredentials().url);
  const [key, setKey] = useState(() => getSupabaseCredentials().key);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      showToast('Harap masukkan Project URL dan Anon Key Supabase Anda.', 'error');
      return;
    }

    saveSupabaseCredentials(url, key);
    onConfigUpdated();

    // Auto test connection
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      showToast('Kredensial berhasil disimpan & terhubung ke Supabase!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDisconnect = () => {
    saveSupabaseCredentials('', '');
    setUrl('');
    setKey('');
    setTestResult(null);
    onConfigUpdated();
    showToast('Kembali menggunakan Mode Simulasi LocalStorage.', 'info');
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    // Temporary save to test
    saveSupabaseCredentials(url, key);
    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      showToast('Koneksi ke Supabase berhasil diverifikasi!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('Kode SQL DDL tb_buku berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Konfigurasi Supabase (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Backend as a Service (BaaS)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Koneksi Database Supabase
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Aplikasi ini mendukung penyimpanan langsung ke database cloud{' '}
              <strong>Supabase PostgreSQL</strong> menggunakan REST API resmi. Jika belum
              dikonfigurasi, aplikasi berjalan otomatis dalam{' '}
              <strong>Mode Simulasi (LocalStorage)</strong>.
            </p>

            <form onSubmit={handleSave} className="space-y-4 mt-5">
              <div>
                <label
                  htmlFor="sb_url"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  id="sb_url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://xyzprojectid.supabase.co"
                />
              </div>

              <div>
                <label
                  htmlFor="sb_key"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Supabase Anon / Public API Key
                </label>
                <input
                  type="password"
                  id="sb_key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed font-medium">{testResult.message}</div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs cursor-pointer"
                >
                  <Plug className="w-3.5 h-3.5" />
                  <span>Simpan & Hubungkan</span>
                </button>

                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>Uji Koneksi</span>
                </button>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition cursor-pointer"
                >
                  Gunakan Mode Lokal
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span>Panduan Menghubungkan Supabase:</span>
            </p>
            <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
              <li>
                Buka{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 underline font-medium inline-flex items-center gap-0.5"
                >
                  Supabase Dashboard <ExternalLink className="w-3 h-3" />
                </a>{' '}
                lalu buat proyek baru.
              </li>
              <li>Buka menu <strong>SQL Editor</strong>, lalu salin dan jalankan skrip SQL di sebelah kanan.</li>
              <li>Buka <strong>Project Settings &rarr; API</strong>, lalu salin <em>Project URL</em> dan <em>anon public key</em> ke form di atas.</li>
            </ol>
          </div>
        </div>

        {/* Right Column: SQL Schema DDL (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="ml-2 text-xs font-mono text-slate-300">
                supabase_schema_tb_buku.sql
              </span>
            </div>

            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode SQL'}</span>
            </button>
          </div>

          <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed flex-grow max-h-[560px]">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
};

