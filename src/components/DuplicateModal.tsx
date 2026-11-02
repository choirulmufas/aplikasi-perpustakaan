import React from 'react';
import { AlertTriangle, PlusCircle, X } from 'lucide-react';
import type { Book } from '../types/book';

interface DuplicateModalProps {
  isOpen: boolean;
  existingBook: Book | null;
  newCopiesToAdd: number;
  onConfirmMerge: () => void;
  onClose: () => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  isOpen,
  existingBook,
  newCopiesToAdd,
  onConfirmMerge,
  onClose,
}) => {
  if (!isOpen || !existingBook) return null;

  const oldCopies = existingBook.jml_eksemplar || 1;
  const combinedCopies = oldCopies + newCopiesToAdd;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-semibold">
              Langkah 4: Penanganan Korektif
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-0.5">
              Nomor ISBN Sudah Terdaftar
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-sm text-slate-600 space-y-3">
          <p className="leading-relaxed">
            Buku dengan nomor ISBN <strong className="font-mono text-slate-900">{existingBook.isbn}</strong> sudah ada di dalam basis data perpustakaan.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
            <div>
              <span className="text-slate-400">Kode Buku :</span>{' '}
              <strong className="text-slate-800">{existingBook.kode_buku}</strong>
            </div>
            <div>
              <span className="text-slate-400">Judul     :</span>{' '}
              <strong className="text-slate-800">{existingBook.judul_buku}</strong>
            </div>
            <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
              <span>
                Stok Lama: <strong className="text-slate-700">{oldCopies}</strong> eks
              </span>
              <span>+ Masukan: <strong className="text-indigo-600">{newCopiesToAdd}</strong> eks</span>
              <span className="text-emerald-700 font-bold">
                &rarr; Stok Baru: {combinedCopies} eks
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Apakah Anda ingin menambahkan jumlah eksemplar dari borang ini ke stok buku yang sudah ada?
          </p>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Batal & Perbaiki ISBN</span>
          </button>
          <button
            type="button"
            onClick={onConfirmMerge}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Ya, Tambahkan ke Stok</span>
          </button>
        </div>
      </div>
    </div>
  );
};
