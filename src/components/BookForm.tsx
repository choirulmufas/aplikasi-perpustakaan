import React, { useEffect, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  Info,
  Save,
  Eraser,
  X,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type {
  Book,
  FormErrors,
  StatusMessage,
  DialogState,
  AlertBannerState,
  CategoryDDC,
  RackLocation,
} from '../types/book';

interface BookFormProps {
  formData: Book;
  setFormData: React.Dispatch<React.SetStateAction<Book>>;
  isEditMode: boolean;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  statusMessage: StatusMessage;
  setStatusMessage: (msg: StatusMessage) => void;
  setDialogState: (state: DialogState) => void;
  onSave: (e: React.FormEvent) => void;
  onReset: () => void;
  onCancel: () => void;
  onRegenerateCode: () => void;
  onFillDemo: () => void;
  alertBanner: AlertBannerState;
  setAlertBanner: (banner: AlertBannerState) => void;
  categories: CategoryDDC[];
  racks: RackLocation[];
}

export const BookForm: React.FC<BookFormProps> = ({
  formData,
  setFormData,
  isEditMode,
  errors,
  setErrors,
  statusMessage,
  setStatusMessage,
  setDialogState,
  onSave,
  onReset,
  onCancel,
  onRegenerateCode,
  onFillDemo,
  alertBanner,
  setAlertBanner,
  categories,
  racks,
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');
  const isbnRef = useRef<HTMLInputElement>(null);
  const judulRef = useRef<HTMLInputElement>(null);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Shortcuts (Alt+R, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        onReset();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReset, onCancel]);

  // Handle Field Changes with Preventive Masks
  const handleChange = (
    field: keyof Book,
    value: string | number
  ) => {
    setDialogState('typing');

    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Masking ISBN: only digits and hyphens
  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleaned = rawVal.replace(/[^0-9-]/g, '');
    if (rawVal !== cleaned) {
      setStatusMessage({
        text: 'PREVENTIF: Kolom ISBN hanya menerima angka dan tanda hubung (-).',
        type: 'warning',
      });
    }
    handleChange('isbn', cleaned);
  };

  // Masking Tahun Terbit: only numbers, max 4 chars
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleaned = rawVal.replace(/[^0-9]/g, '').slice(0, 4);
    if (rawVal !== cleaned) {
      setStatusMessage({
        text: 'PREVENTIF: Kolom Tahun Terbit hanya menerima karakter angka.',
        type: 'warning',
      });
    }
    handleChange('tahun_terbit', cleaned ? parseInt(cleaned, 10) : 0);
  };

  // Masking Eksemplar: only numbers, min 1
  const handleCopiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleaned = rawVal.replace(/[^0-9]/g, '');
    handleChange('jml_eksemplar', cleaned ? parseInt(cleaned, 10) : 1);
  };

  const adjustCopies = (delta: number) => {
    setDialogState('typing');
    const nextVal = Math.max(1, (formData.jml_eksemplar || 1) + delta);
    setFormData((prev) => ({ ...prev, jml_eksemplar: nextVal }));
    if (errors.jml_eksemplar) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.jml_eksemplar;
        return copy;
      });
    }
  };

  // Calculate clean ISBN digit count
  const cleanIsbnDigits = formData.isbn.replace(/-/g, '');
  const isIsbnValidLength = cleanIsbnDigits.length === 10 || cleanIsbnDigits.length === 13;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Form Header (Langkah 3: Format Pesan - Header Identitas Borang) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-semibold">
              Form Fill-In Dialog
            </span>
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold border ${
                isEditMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
              }`}
            >
              {isEditMode ? `Mode Edit: ${formData.kode_buku}` : 'Input Baru'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold mt-1 text-white">
            Formulir Penyimpanan Data Buku
          </h2>
        </div>

        <button
          type="button"
          onClick={onFillDemo}
          className="text-xs bg-white/10 hover:bg-white/20 active:bg-white/30 text-white px-3 py-1.5 rounded-lg border border-white/15 transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
          title="Isi otomatis dengan contoh buku perpustakaan untuk menguji validasi form"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Isi Contoh Cepat</span>
          <span className="sm:hidden">Contoh</span>
        </button>
      </div>

      {/* Prompt / Instruction Banner (Langkah 3: Format Pesan) */}
      <div className="bg-indigo-50/70 border-b border-indigo-100 px-6 py-3 flex items-start sm:items-center justify-between gap-2 text-xs text-indigo-900">
        <div className="flex items-start sm:items-center space-x-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Petunjuk:</strong> Isi data buku dengan lengkap. Kolom bertanda bintang (
            <span className="text-rose-600 font-bold">*</span>) wajib diisi. Gunakan tombol{' '}
            <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded text-[10px] font-mono">
              Tab
            </kbd>{' '}
            untuk berpindah kolom antar isian.
          </span>
        </div>
      </div>

      {/* Corrective / Preventive Alert Banner (Dynamic) */}
      {alertBanner.show && (
        <div
          className={`mx-6 mt-5 p-4 rounded-xl border text-xs sm:text-sm flex items-start justify-between gap-3 transition-all ${
            alertBanner.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : alertBanner.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : alertBanner.type === 'info'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          <div className="flex items-start space-x-2.5">
            {alertBanner.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : alertBanner.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : alertBanner.type === 'info' ? (
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed font-medium">{alertBanner.message}</div>
          </div>
          <button
            type="button"
            onClick={() => setAlertBanner({ ...alertBanner, show: false })}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={onSave} className="p-6 space-y-5" noValidate>
        {/* Row 1: Kode Buku & Nomor ISBN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kode Buku */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="kode_buku"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Kode Buku (ID) <span className="text-rose-600">*</span>
              </label>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={onRegenerateCode}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Generate Ulang</span>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                id="kode_buku"
                value={formData.kode_buku}
                onChange={(e) => handleChange('kode_buku', e.target.value)}
                readOnly={isEditMode}
                maxLength={15}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm transition focus:outline-hidden ${
                  errors.kode_buku
                    ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30 shake-error'
                    : isEditMode
                    ? 'bg-slate-100 text-slate-500 border-slate-300 cursor-not-allowed'
                    : 'bg-slate-50 border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="BK-2026-0001"
              />
            </div>
            {errors.kode_buku && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.kode_buku}</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Format: <code className="font-mono text-slate-600">BK-YYYY-XXXX</code> (Primary Key)
            </p>
          </div>

          {/* Nomor ISBN */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="isbn"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Nomor ISBN <span className="text-rose-600">*</span>
              </label>
              <span
                className={`text-[11px] font-mono transition-colors ${
                  isIsbnValidLength
                    ? 'text-emerald-600 font-bold'
                    : cleanIsbnDigits.length > 0
                    ? 'text-amber-600 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {cleanIsbnDigits.length}/13 digit
              </span>
            </div>
            <div className="relative">
              <input
                ref={isbnRef}
                type="text"
                id="isbn"
                value={formData.isbn}
                onChange={handleIsbnChange}
                maxLength={17}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm transition focus:outline-hidden ${
                  errors.isbn
                    ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30 shake-error'
                    : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="978-602-03-3295-6"
              />
            </div>
            {errors.isbn && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.isbn}</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Preventif: Menerima 10 atau 13 digit angka & tanda hubung
            </p>
          </div>
        </div>

        {/* Row 2: Judul Buku */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="judul_buku"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Judul Buku <span className="text-rose-600">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {formData.judul_buku.length}/150 karakter
            </span>
          </div>
          <input
            ref={judulRef}
            type="text"
            id="judul_buku"
            value={formData.judul_buku}
            onChange={(e) => handleChange('judul_buku', e.target.value)}
            maxLength={150}
            required
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-hidden ${
              errors.judul_buku
                ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30 shake-error'
                : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="Contoh: Pengantar Interaksi Manusia dan Komputer"
          />
          {errors.judul_buku && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.judul_buku}</p>
          )}
        </div>

        {/* Row 3: Pengarang & Penerbit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pengarang"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Pengarang <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="pengarang"
              value={formData.pengarang}
              onChange={(e) => handleChange('pengarang', e.target.value)}
              maxLength={100}
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-hidden ${
                errors.pengarang
                  ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30 shake-error'
                  : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="Contoh: P. Insap Santosa"
            />
            {errors.pengarang && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.pengarang}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="penerbit"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Penerbit <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="penerbit"
              value={formData.penerbit}
              onChange={(e) => handleChange('penerbit', e.target.value)}
              maxLength={100}
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-hidden ${
                errors.penerbit
                  ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30 shake-error'
                  : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="Contoh: Penerbit Andi"
            />
            {errors.penerbit && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.penerbit}</p>
            )}
          </div>
        </div>

        {/* Row 4: Tahun Terbit, Jumlah Eksemplar, Lokasi Rak */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tahun Terbit */}
          <div>
            <label
              htmlFor="tahun_terbit"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Tahun Terbit <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="tahun_terbit"
              value={formData.tahun_terbit || ''}
              onChange={handleYearChange}
              maxLength={4}
              inputMode="numeric"
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm transition focus:outline-hidden ${
                errors.tahun_terbit
                  ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30 shake-error'
                  : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="2024"
            />
            {errors.tahun_terbit && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.tahun_terbit}</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">Rentang: 1900 - 2026</p>
          </div>

          {/* Jumlah Eksemplar */}
          <div>
            <label
              htmlFor="jml_eksemplar"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Jml Eksemplar <span className="text-rose-600">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => adjustCopies(-1)}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 transition cursor-pointer"
                title="Kurangi 1 eksemplar"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                id="jml_eksemplar"
                value={formData.jml_eksemplar || 1}
                onChange={handleCopiesChange}
                maxLength={4}
                inputMode="numeric"
                required
                className={`w-full px-3 py-2.5 border-y font-mono text-sm text-center transition focus:outline-hidden ${
                  errors.jml_eksemplar
                    ? 'border-rose-500 bg-rose-50/30 text-rose-700'
                    : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => adjustCopies(1)}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-l-0 border-slate-300 rounded-r-xl text-slate-700 transition cursor-pointer"
                title="Tambah 1 eksemplar"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {errors.jml_eksemplar && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.jml_eksemplar}</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">Minimal: 1 eksemplar</p>
          </div>

          {/* Lokasi Rak (Relasi ke tb_lokasi_rak) */}
          <div>
            <label
              htmlFor="id_rak"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Lokasi Rak (Master Rak) <span className="text-rose-600">*</span>
            </label>
            <select
              id="id_rak"
              value={formData.id_rak}
              onChange={(e) => handleChange('id_rak', e.target.value)}
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white transition focus:outline-hidden ${
                errors.id_rak
                  ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            >
              <option value="">-- Pilih Lokasi Rak --</option>
              {racks.map((rack) => (
                <option key={rack.id_rak} value={rack.id_rak}>
                  {rack.id_rak} - {rack.nama_rak} (Lantai {rack.lantai})
                </option>
              ))}
            </select>
            {errors.id_rak && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.id_rak}</p>
            )}
          </div>
        </div>

        {/* Row 5: Kategori DDC (Relasi ke tb_kategori_ddc) */}
        <div>
          <label
            htmlFor="kode_kategori"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Kategori Klasifikasi DDC (tb_kategori_ddc){' '}
            <span className="text-rose-600">*</span>
          </label>
          <select
            id="kode_kategori"
            value={formData.kode_kategori}
            onChange={(e) => handleChange('kode_kategori', e.target.value)}
            required
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white transition focus:outline-hidden ${
              errors.kode_kategori
                ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30'
                : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          >
            <option value="">-- Pilih Kategori DDC (000 - 900) --</option>
            {categories.map((cat) => (
              <option key={cat.kode_kategori} value={cat.kode_kategori}>
                {cat.kode_kategori} - {cat.nama_kategori}
              </option>
            ))}
          </select>
          {errors.kode_kategori && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.kode_kategori}</p>
          )}
        </div>

        {/* Row 6: Deskripsi Singkat (CHECK CHAR_LENGTH <= 500) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="deskripsi"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Deskripsi Singkat / Sinopsis{' '}
              <span className="text-slate-400 font-normal">(Opsional, Maks. 500 Karakter)</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {(formData.deskripsi || '').length}/500
            </span>
          </div>
          <textarea
            id="deskripsi"
            rows={2}
            value={formData.deskripsi || ''}
            onChange={(e) => handleChange('deskripsi', e.target.value)}
            maxLength={500}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Ringkasan isi buku, topik bahasan, atau catatan khusus pustakawan..."
          />
        </div>

        {/* Action Buttons (Langkah 2 & 3: Tombol Aksi & Pintasan Keyboard) */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'PERBARUI DATA' : 'SIMPAN DATA'}</span>
              <kbd className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-indigo-700 text-indigo-100 rounded border border-indigo-400/40">
                Enter
              </kbd>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm flex items-center space-x-2 transition cursor-pointer"
              title="Bersihkan seluruh kolom isian (Pintasan: Alt+R)"
            >
              <Eraser className="w-4 h-4" />
              <span>BERSIHKAN</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-500 rounded border border-slate-300">
                Alt+R
              </kbd>
            </button>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium text-sm flex items-center space-x-1.5 transition cursor-pointer"
            title="Batalkan proses edit atau reset form (Pintasan: Esc)"
          >
            <X className="w-4 h-4" />
            <span>BATAL</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-rose-50 text-rose-500 rounded border border-rose-200">
              Esc
            </kbd>
          </button>
        </div>
      </form>

      {/* Bottom Status Bar (Langkah 3: Area Umpan Balik Baris Status Real-Time) */}
      <div className="bg-slate-100 border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-mono font-semibold text-slate-500 uppercase">STATUS:</span>
          <span
            className={`font-medium truncate ${
              statusMessage.type === 'error'
                ? 'text-rose-600 font-semibold'
                : statusMessage.type === 'success'
                ? 'text-emerald-700 font-semibold'
                : statusMessage.type === 'warning'
                ? 'text-amber-700 font-medium'
                : 'text-slate-700 font-medium'
            }`}
          >
            {statusMessage.text}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap ml-2">
          {currentTime || '--:--:--'}
        </span>
      </div>
    </div>
  );
};
