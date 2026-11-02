import React from 'react';
import {
  Sparkles,
  Layers,
  MessagesSquare,
  ShieldAlert,
  Database,
  Palette,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';

export const ImkSpecTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Banner Intro */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="max-w-3xl">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono uppercase bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
            Dokumentasi Perancangan Antarmuka & Ergonomi
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Penerapan 5 Langkah Urutan Perancangan Tampilan (Human-Computer Interaction)
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Sistem pengisian borang perpustakaan ini dibangun secara ketat mengikuti teori 5
            langkah perancangan antarmuka pengguna pada mata kuliah Interaksi Manusia dan Komputer
            (IMK) serta arsitektur basis data relasional ternormalisasi di Supabase PostgreSQL.
          </p>
        </div>

        {/* 5 Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {/* Step 1 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Pemilihan Ragam Dialog</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Menggunakan <strong>Dialog Berbasis Pengisian Borang (<em>Form Fill-In</em>)</strong>.
                Dirancang khusus untuk pustakawan yang memerlukan kecepatan tinggi dalam entri data
                buku terstruktur dengan navigasi tombol <kbd className="px-1 py-0.5 bg-white border rounded font-mono text-[10px]">Tab</kbd>,
                nilai default otomatis, dan dropdown terkontrol untuk meminimalkan salah ketik.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-indigo-700 font-medium">
              Keunggulan: Menampilkan seluruh konteks isian sekaligus.
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Perancangan Struktur Dialog</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Siklus interaksi diatur dalam <em>state machine</em> yang divisualisasikan pada
                komponen <strong>Status Stepper</strong> di bagian atas:
                <br />
                <span className="font-mono text-[11px] text-slate-700 mt-1 inline-block">
                  1. Siap Menerima Masukan &rarr; 2. Mengisi Borang &rarr; 3. Validasi &rarr; 4. Simpan
                </span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-indigo-700 font-medium">
              Manfaat: Pengguna selalu mengetahui posisi interaksi saat ini.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MessagesSquare className="w-4 h-4 text-indigo-600" />
                <span>Perancangan Format Pesan</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Menyediakan umpan balik terstruktur:
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-slate-600">
                <li><strong>Prompt / Petunjuk:</strong> Banner panduan pengisian di atas form.</li>
                <li><strong>Label & Indikator:</strong> Tanda bintang merah (<code className="text-rose-600 font-bold">*</code>) dan batasan karakter.</li>
                <li><strong>Status Bar:</strong> Baris status di kaki borang dengan jam real-time.</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-indigo-700 font-medium">
              Sesuai prinsip kejelasan (Clarity & Feedback).
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span>Penanganan Kesalahan</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Menerapkan 2 lapis proteksi:
                <br />
                <strong>1. Preventif:</strong> Input masking angka saja pada ISBN, Tahun Terbit, Eksemplar.
                <br />
                <strong>2. Korektif:</strong> Animasi getar (<code className="font-mono text-slate-700">shake-error</code>), border merah, fokus kursor otomatis, dan modal deteksi duplikasi ISBN untuk tambah stok.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-indigo-700 font-medium">
              Dapat diuji lewat kartu skenario "Langkah 4".
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 md:col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Perancangan Struktur Data Relasional (ERD)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Menggunakan skema basis data relasional ternormalisasi (3 tabel) dengan integritas referensial:
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="font-bold text-indigo-700 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" /> tb_kategori_ddc
                  </span>
                  <p className="text-slate-500 mt-1 font-mono text-[10px]">
                    • kode_kategori (PK, CHAR 3)<br />
                    • nama_kategori (VARCHAR 100)<br />
                    • keterangan (TEXT)
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="font-bold text-indigo-700 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" /> tb_lokasi_rak
                  </span>
                  <p className="text-slate-500 mt-1 font-mono text-[10px]">
                    • id_rak (PK, VARCHAR 10)<br />
                    • nama_rak (VARCHAR 50)<br />
                    • lantai (INT, default 1)<br />
                    • kapasitas (INT, default 100)
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="font-bold text-indigo-700 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" /> tb_buku (Utama)
                  </span>
                  <p className="text-slate-500 mt-1 font-mono text-[10px]">
                    • kode_buku (PK, VARCHAR 15)<br />
                    • isbn (VARCHAR 17, UNIQUE)<br />
                    • fk_buku_kategori &rarr; ddc<br />
                    • fk_buku_rak &rarr; rak
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Foreign Key dengan ON UPDATE CASCADE & ON DELETE RESTRICT + RLS Policies.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Design System Tokens */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-200">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Spesifikasi Sistem Desain & Panduan Tampilan (Design Tokens)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-800">1. Tipografi & Hirarki</p>
            <ul className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <li>• Font Utama: <strong>Inter</strong> (400, 500, 600, 700)</li>
              <li>• Font Kode/ISBN: <strong>JetBrains Mono</strong></li>
              <li>• Judul Borang: 18px / Semi-bold</li>
              <li>• Label Input: 12px Uppercase (Letter-spacing 0.05em)</li>
              <li>• Isian Form: 14px / Padding 10px 14px</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-800">2. Palet Warna (Color Tokens)</p>
            <ul className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block"></span> Primary: #4F46E5 (Indigo 600)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-slate-900 inline-block"></span> Surface Header: #0F172A
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-rose-600 inline-block"></span> Error State: #E11D48
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span> Success State: #10B981
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-800">3. Grid & Ergonomi Interaksi</p>
            <ul className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <li>• Desktop Grid: 12 Kolom (Borang 7, Katalog 5)</li>
              <li>• Card Radius: 16px (2xl)</li>
              <li>• Input Field Radius: 12px (xl)</li>
              <li>• Pintasan: <kbd className="px-1 py-0.5 bg-white border rounded">Enter</kbd>, <kbd className="px-1 py-0.5 bg-white border rounded">Alt+R</kbd>, <kbd className="px-1 py-0.5 bg-white border rounded">Esc</kbd></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
