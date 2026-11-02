import React from 'react';
import { FlaskConical, Play } from 'lucide-react';

interface TestCasesCardProps {
  onRunTest: (caseType: 'empty_title' | 'invalid_isbn' | 'duplicate_isbn' | 'invalid_year') => void;
}

export const TestCasesCard: React.FC<TestCasesCardProps> = ({ onRunTest }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
          Langkah 4: Uji Penanganan Kesalahan
        </span>
        <FlaskConical className="w-4 h-4 text-slate-400" />
      </div>
      <h4 className="font-bold text-sm text-slate-800 mb-1">
        Simulasi Kasus Uji Validasi Borang (Test Cases)
      </h4>
      <p className="text-xs text-slate-500 mb-3">
        Klik salah satu skenario berikut untuk menguji respon korektif & preventif borang secara langsung:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onRunTest('empty_title')}
          className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-rose-700">
            <span>1. Field Wajib Kosong</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-rose-600 transition" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Kosongkan Judul & picu Simpan</p>
        </button>

        <button
          type="button"
          onClick={() => onRunTest('invalid_isbn')}
          className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-rose-700">
            <span>2. Format ISBN Salah</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-rose-600 transition" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Isi ISBN 7 digit (bukan 10/13)</p>
        </button>

        <button
          type="button"
          onClick={() => onRunTest('duplicate_isbn')}
          className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-amber-700">
            <span>3. Deteksi ISBN Ganda</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-amber-600 transition" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Uji dialog tambah stok otomatis</p>
        </button>

        <button
          type="button"
          onClick={() => onRunTest('invalid_year')}
          className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-rose-700">
            <span>4. Tahun Tidak Logis</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-rose-600 transition" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Isi tahun terbit masa depan (2099)</p>
        </button>
      </div>
    </div>
  );
};

