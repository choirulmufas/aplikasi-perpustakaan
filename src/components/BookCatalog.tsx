import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  BookOpen,
  Edit,
  Trash2,
  Tag,
  MapPin,
  User,
  Building,
} from 'lucide-react';
import type { Book, CategoryDDC, RackLocation } from '../types/book';

interface BookCatalogProps {
  books: Book[];
  isLoading: boolean;
  categories: CategoryDDC[];
  racks: RackLocation[];
  onRefresh: () => void;
  onEdit: (book: Book) => void;
  onDeleteRequest: (book: Book) => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  isLoading,
  categories,
  racks,
  onRefresh,
  onEdit,
  onDeleteRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Helper Lookups
  const getCategoryLabel = (code: string) => {
    const found = categories.find((c) => c.kode_kategori === code);
    return found ? found.nama_kategori : code;
  };

  const getRackLabel = (rackId: string) => {
    const found = racks.find((r) => r.id_rak === rackId);
    return found ? found.id_rak : rackId;
  };

  // Filter books
  const filteredBooks = books.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      b.judul_buku.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.pengarang.toLowerCase().includes(q) ||
      b.penerbit.toLowerCase().includes(q) ||
      b.kode_buku.toLowerCase().includes(q);

    const matchesCat = !categoryFilter || b.kode_kategori === categoryFilter;

    return matchesQuery && matchesCat;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 text-base">
              Data Tersimpan (<code className="font-mono text-xs text-indigo-600">tb_buku</code>)
            </h3>
            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-indigo-50 text-indigo-700">
              {books.length} Buku
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Klik item buku untuk mengedit atau memeriksa detail
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="Muat Ulang Data dari Database"
          disabled={isLoading}
        >
          <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-grow">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            placeholder="Cari judul, ISBN, pengarang, penerbit, kode..."
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Semua Kategori (DDC)</option>
          {categories.map((cat) => (
            <option key={cat.kode_kategori} value={cat.kode_kategori}>
              {cat.kode_kategori} - {cat.nama_kategori.slice(0, 20)}...
            </option>
          ))}
        </select>
      </div>

      {/* Book Items List */}
      <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
        {isLoading && books.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
            <p className="text-xs font-medium">Memuat katalog buku...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium text-slate-500">
              Tidak ada data buku yang sesuai dengan pencarian / filter.
            </p>
            {books.length === 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                Gunakan form di samping untuk menambahkan buku pertama.
              </p>
            )}
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.kode_buku}
              className="p-4 hover:bg-slate-50/80 transition group flex items-start justify-between gap-3"
            >
              <div
                className="space-y-1 min-w-0 flex-grow cursor-pointer"
                onClick={() => onEdit(book)}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {book.kode_buku}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                    ISBN: {book.isbn}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    {book.jml_eksemplar} Eks
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition truncate">
                  {book.judul_buku}
                </h4>

                <p className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                  <User className="w-3 h-3 shrink-0 text-slate-400" />
                  <span className="truncate">{book.pengarang}</span>
                  <span>&bull;</span>
                  <Building className="w-3 h-3 shrink-0 text-slate-400" />
                  <span className="truncate">{book.penerbit}</span>
                  <span>({book.tahun_terbit})</span>
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[200px]">
                      {book.kode_kategori} - {getCategoryLabel(book.kode_kategori)}
                    </span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{getRackLabel(book.id_rak)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => onEdit(book)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                  title="Edit Data Buku"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(book)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Hapus Buku"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
