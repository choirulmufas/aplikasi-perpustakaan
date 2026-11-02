import React from 'react';
import { Trash2, AlertCircle, X } from 'lucide-react';
import type { Book } from '../types/book';

interface DeleteModalProps {
  isOpen: boolean;
  book: Book | null;
  onConfirmDelete: () => void;
  onClose: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  book,
  onConfirmDelete,
  onClose,
}) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-semibold">
              Konfirmasi Penghapusan
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-0.5">
              Hapus Data Buku Ini?
            </h3>
          </div>
        </div>

        <div className="p-6 text-sm text-slate-600 space-y-3">
          <p className="leading-relaxed">
            Apakah Anda yakin ingin menghapus data buku berikut secara permanen?
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono">
            <div>
              <span className="text-slate-400">Kode Buku :</span>{' '}
              <strong className="text-slate-800">{book.kode_buku}</strong>
            </div>
            <div>
              <span className="text-slate-400">Judul     :</span>{' '}
              <strong className="text-slate-800">{book.judul_buku}</strong>
            </div>
            <div>
              <span className="text-slate-400">Pengarang :</span>{' '}
              <span className="text-slate-700">{book.pengarang}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-rose-600 font-medium bg-rose-50/70 p-2.5 rounded-lg border border-rose-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Tindakan ini tidak dapat dibatalkan setelah data dihapus.</span>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Batal</span>
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus Buku</span>
          </button>
        </div>
      </div>
    </div>
  );
};
