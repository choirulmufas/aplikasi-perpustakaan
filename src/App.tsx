import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DialogStepper } from './components/DialogStepper';
import { BookForm } from './components/BookForm';
import { BookCatalog } from './components/BookCatalog';
import { TestCasesCard } from './components/TestCasesCard';
import { DuplicateModal } from './components/DuplicateModal';
import { DeleteModal } from './components/DeleteModal';
import { ImkSpecTab } from './components/ImkSpecTab';
import { SupabaseTab } from './components/SupabaseTab';
import { Toast, type ToastData } from './components/Toast';

import {
  type Book,
  type DialogState,
  type FormErrors,
  type StatusMessage,
  type AlertBannerState,
  type CategoryDDC,
  type RackLocation,
  DEFAULT_DDC_CATEGORIES,
  DEFAULT_RACK_LOCATIONS,
} from './types/book';
import {
  getLocalBooks,
  saveLocalBooks,
  getNextBookCode,
  DEMO_SAMPLE_BOOKS,
} from './lib/storage';
import {
  isSupabaseConfigured,
  getSupabaseClient,
  fetchMasterDataFromSupabase,
} from './lib/supabase';

export function App() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'imk-spec' | 'supabase'>('workspace');
  const [isSupabase, setIsSupabase] = useState<boolean>(() => isSupabaseConfigured());
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<CategoryDDC[]>(DEFAULT_DDC_CATEGORIES);
  const [racks, setRacks] = useState<RackLocation[]>(DEFAULT_RACK_LOCATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<DialogState>('idle');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Book>({
    kode_buku: '',
    isbn: '',
    judul_buku: '',
    pengarang: '',
    penerbit: '',
    tahun_terbit: new Date().getFullYear(),
    kode_kategori: '',
    jml_eksemplar: 1,
    id_rak: '',
    deskripsi: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    text: 'Siap menerima masukan data buku baru.',
    type: 'info',
  });
  const [alertBanner, setAlertBanner] = useState<AlertBannerState>({
    show: false,
    message: '',
    type: 'info',
  });

  // Modals & Toasts
  const [duplicateModal, setDuplicateModal] = useState<{
    isOpen: boolean;
    existingBook: Book | null;
    newCopiesToAdd: number;
  }>({
    isOpen: false,
    existingBook: null,
    newCopiesToAdd: 1,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    book: Book | null;
  }>({
    isOpen: false,
    book: null,
  });

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [demoIndex, setDemoIndex] = useState<number>(0);

  // Helper Toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Books and Master Data from Supabase or LocalStorage
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    const configured = isSupabaseConfigured();
    setIsSupabase(configured);

    if (configured) {
      const client = getSupabaseClient();
      if (client) {
        try {
          // Fetch master data (categories & racks)
          const master = await fetchMasterDataFromSupabase();
          if (master.categories && master.categories.length > 0) {
            setCategories(master.categories);
          }
          if (master.racks && master.racks.length > 0) {
            setRacks(master.racks);
          }

          // Fetch books
          const { data, error } = await client
            .from('tb_buku')
            .select('*')
            .order('kode_buku', { ascending: false });

          if (error) {
            console.warn('Supabase query error, fallback to local:', error.message);
            showToast(
              `Gagal mengambil data dari Supabase (${error.message}). Menggunakan penyimpanan lokal sementara.`,
              'error'
            );
            const localData = getLocalBooks();
            setBooks(localData);
          } else if (data) {
            setBooks(data as Book[]);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Kesalahan jaringan Supabase';
          showToast(`Koneksi Supabase gagal: ${message}. Beralih ke data lokal.`, 'error');
          const localData = getLocalBooks();
          setBooks(localData);
        }
      }
    } else {
      const localData = getLocalBooks();
      setBooks(localData);
      setCategories(DEFAULT_DDC_CATEGORIES);
      setRacks(DEFAULT_RACK_LOCATIONS);
    }
    setIsLoading(false);
  }, [showToast]);

  // Initial load
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Update initial kode_buku once books load
  useEffect(() => {
    if (!isEditMode && !formData.kode_buku && books.length > 0) {
      const nextCode = getNextBookCode(books);
      setFormData((prev) => ({ ...prev, kode_buku: nextCode }));
    }
  }, [books, isEditMode, formData.kode_buku]);

  // Regenerate Book Code
  const handleRegenerateCode = () => {
    if (isEditMode) return;
    const nextCode = getNextBookCode(books);
    setFormData((prev) => ({ ...prev, kode_buku: nextCode }));
    if (errors.kode_buku) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.kode_buku;
        return copy;
      });
    }
  };

  // Quick Demo Book Fill
  const handleFillDemo = () => {
    const demo = DEMO_SAMPLE_BOOKS[demoIndex % DEMO_SAMPLE_BOOKS.length];
    setDemoIndex((prev) => prev + 1);

    const code = isEditMode ? formData.kode_buku : getNextBookCode(books);

    setFormData({
      kode_buku: code,
      isbn: demo.isbn,
      judul_buku: demo.judul_buku,
      pengarang: demo.pengarang,
      penerbit: demo.penerbit,
      tahun_terbit: demo.tahun_terbit,
      kode_kategori: demo.kode_kategori,
      jml_eksemplar: demo.jml_eksemplar,
      id_rak: demo.id_rak,
      deskripsi: demo.deskripsi || '',
    });

    setErrors({});
    setAlertBanner({ show: false, message: '', type: 'info' });
    setDialogState('typing');
    setStatusMessage({
      text: 'Contoh data buku perpustakaan telah diisikan ke borang. Tekan SIMPAN untuk menguji validasi.',
      type: 'info',
    });
  };

  // Reset Form
  const handleReset = (showNotice: boolean = true) => {
    const nextCode = getNextBookCode(books);
    setFormData({
      kode_buku: nextCode,
      isbn: '',
      judul_buku: '',
      pengarang: '',
      penerbit: '',
      tahun_terbit: new Date().getFullYear(),
      kode_kategori: '',
      jml_eksemplar: 1,
      id_rak: '',
      deskripsi: '',
    });
    setIsEditMode(false);
    setErrors({});
    setAlertBanner({ show: false, message: '', type: 'info' });
    setDialogState('idle');

    if (showNotice) {
      setStatusMessage({
        text: 'Borang telah dibersihkan. Siap menerima masukan data buku baru.',
        type: 'info',
      });
      showToast('Borang telah dibersihkan.', 'info');
    }
  };

  // Cancel Action
  const handleCancel = () => {
    handleReset(false);
    setStatusMessage({
      text: 'Aksi dibatalkan. Borang kembali ke kondisi awal siap masukan baru.',
      type: 'info',
    });
  };

  // Load Book for Editing
  const handleEditBook = (book: Book) => {
    setIsEditMode(true);
    setFormData({
      kode_buku: book.kode_buku,
      isbn: book.isbn,
      judul_buku: book.judul_buku,
      pengarang: book.pengarang,
      penerbit: book.penerbit,
      tahun_terbit: book.tahun_terbit,
      kode_kategori: book.kode_kategori,
      jml_eksemplar: book.jml_eksemplar,
      id_rak: book.id_rak,
      deskripsi: book.deskripsi || '',
    });
    setErrors({});
    setAlertBanner({ show: false, message: '', type: 'info' });
    setDialogState('typing');
    setStatusMessage({
      text: `Sedang mengedit buku [${book.kode_buku}] "${book.judul_buku}". Ubah kolom lalu tekan Perbarui Data.`,
      type: 'info',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Book Request
  const handleDeleteRequest = (book: Book) => {
    setDeleteModal({ isOpen: true, book });
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    const bookToDelete = deleteModal.book;
    if (!bookToDelete) return;

    setDeleteModal({ isOpen: false, book: null });

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { error } = await client
            .from('tb_buku')
            .delete()
            .eq('kode_buku', bookToDelete.kode_buku);

          if (error) {
            showToast(`Gagal menghapus dari Supabase: ${error.message}`, 'error');
            return;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Kesalahan jaringan Supabase';
          showToast(`Gagal menghapus dari Supabase: ${message}`, 'error');
          return;
        }
      }
    } else {
      const updated = books.filter((b) => b.kode_buku !== bookToDelete.kode_buku);
      saveLocalBooks(updated);
    }

    await fetchBooks();
    showToast(`Buku "${bookToDelete.judul_buku}" (${bookToDelete.kode_buku}) berhasil dihapus.`, 'info');
    setStatusMessage({
      text: `Data buku ${bookToDelete.kode_buku} telah dihapus dari basis data.`,
      type: 'info',
    });
  };

  // Save Book (Insert or Update)
  const executeSaveBook = async (bookToSave: Book, isStockMerge: boolean = false) => {
    setDialogState('saving');
    setStatusMessage({
      text: 'Menyimpan data buku ke basis data...',
      type: 'info',
    });

    const isUpdating = isEditMode || isStockMerge;

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          // Clean object: only columns of tb_buku
          const cleanRow = {
            kode_buku: bookToSave.kode_buku,
            isbn: bookToSave.isbn,
            judul_buku: bookToSave.judul_buku,
            pengarang: bookToSave.pengarang,
            penerbit: bookToSave.penerbit,
            tahun_terbit: bookToSave.tahun_terbit,
            kode_kategori: bookToSave.kode_kategori,
            jml_eksemplar: bookToSave.jml_eksemplar,
            id_rak: bookToSave.id_rak,
            deskripsi: bookToSave.deskripsi || null,
          };

          if (isUpdating) {
            const { error } = await client
              .from('tb_buku')
              .update(cleanRow)
              .eq('kode_buku', cleanRow.kode_buku);

            if (error) throw error;
          } else {
            const { error } = await client.from('tb_buku').insert([cleanRow]);
            if (error) throw error;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Gagal menyimpan ke Supabase';
          setDialogState('idle');
          setAlertBanner({
            show: true,
            message: `KESALAHAN BASIS DATA SUPABASE: ${message}`,
            type: 'error',
          });
          setStatusMessage({
            text: `Gagal menyimpan ke Supabase: ${message}`,
            type: 'error',
          });
          showToast(`Supabase Error: ${message}`, 'error');
          return;
        }
      }
    } else {
      // Local Storage Save
      let currentLocal = getLocalBooks();
      if (isUpdating) {
        currentLocal = currentLocal.map((b) =>
          b.kode_buku === bookToSave.kode_buku ? bookToSave : b
        );
      } else {
        currentLocal = [bookToSave, ...currentLocal];
      }
      saveLocalBooks(currentLocal);
    }

    await fetchBooks();
    handleReset(false);
    setDialogState('idle');

    const successMsg = isStockMerge
      ? `SUKSES: Stok buku '${bookToSave.judul_buku}' (${bookToSave.kode_buku}) diperbarui menjadi ${bookToSave.jml_eksemplar} eksemplar.`
      : `SUKSES: Data buku '${bookToSave.judul_buku}' (${bookToSave.kode_buku}) berhasil disimpan ke basis data!`;

    setAlertBanner({ show: true, message: successMsg, type: 'success' });
    setStatusMessage({ text: successMsg, type: 'success' });
    showToast(successMsg, 'success');
  };

  // Form Submission & IMK Validations
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAlertBanner({ show: false, message: '', type: 'info' });
    setDialogState('validating');

    const newErrors: FormErrors = {};

    // 1. Mandatory Fields Validation
    const requiredChecklist: { key: keyof Book; label: string }[] = [
      { key: 'kode_buku', label: 'Kode Buku (ID)' },
      { key: 'isbn', label: 'Nomor ISBN' },
      { key: 'judul_buku', label: 'Judul Buku' },
      { key: 'pengarang', label: 'Pengarang' },
      { key: 'penerbit', label: 'Penerbit' },
      { key: 'tahun_terbit', label: 'Tahun Terbit' },
      { key: 'jml_eksemplar', label: 'Jumlah Eksemplar' },
      { key: 'id_rak', label: 'Lokasi Rak' },
      { key: 'kode_kategori', label: 'Kategori (DDC)' },
    ];

    for (const item of requiredChecklist) {
      const val = formData[item.key];
      if (val === undefined || val === null || String(val).trim() === '') {
        newErrors[item.key as keyof FormErrors] = `Kolom [${item.label}] wajib diisi.`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      setErrors(newErrors);
      setAlertBanner({
        show: true,
        message: `PERINGATAN VALIDASI: ${firstError}`,
        type: 'error',
      });
      setStatusMessage({
        text: `PERINGATAN: ${firstError}`,
        type: 'error',
      });
      setDialogState('typing');
      return;
    }

    // 2. Kode Buku Pattern: BK-YYYY-XXXX
    if (!/^BK-\d{4}-\d{3,6}$/i.test(formData.kode_buku)) {
      const msg = 'KESALAHAN FORMAT: Kode Buku harus mengikuti pola BK-YYYY-XXXX (contoh: BK-2026-0042).';
      setErrors({ kode_buku: msg });
      setAlertBanner({ show: true, message: msg, type: 'error' });
      setStatusMessage({ text: msg, type: 'error' });
      setDialogState('typing');
      return;
    }

    // 3. ISBN Validation: 10 or 13 clean digits
    const cleanIsbn = formData.isbn.replace(/-/g, '');
    if (!/^\d+$/.test(cleanIsbn) || (cleanIsbn.length !== 10 && cleanIsbn.length !== 13)) {
      const msg = `KESALAHAN FORMAT: Nomor ISBN harus terdiri dari 10 atau 13 digit angka (saat ini: ${cleanIsbn.length} digit).`;
      setErrors({ isbn: msg });
      setAlertBanner({ show: true, message: msg, type: 'error' });
      setStatusMessage({ text: msg, type: 'error' });
      setDialogState('typing');
      return;
    }

    // 4. Tahun Terbit Validation: 1900 to current year
    const currentYear = new Date().getFullYear();
    const yearNum = Number(formData.tahun_terbit);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
      const msg = `KESALAHAN NILAI: Tahun terbit harus berada di antara 1900 hingga ${currentYear}.`;
      setErrors({ tahun_terbit: msg });
      setAlertBanner({ show: true, message: msg, type: 'error' });
      setStatusMessage({ text: msg, type: 'error' });
      setDialogState('typing');
      return;
    }

    // 5. Eksemplar >= 1
    const copiesNum = Number(formData.jml_eksemplar);
    if (isNaN(copiesNum) || copiesNum < 1) {
      const msg = 'KESALAHAN NILAI: Jumlah eksemplar minimal adalah 1 buku.';
      setErrors({ jml_eksemplar: msg });
      setAlertBanner({ show: true, message: msg, type: 'error' });
      setStatusMessage({ text: msg, type: 'error' });
      setDialogState('typing');
      return;
    }

    // 6. Deskripsi <= 500
    if (formData.deskripsi && formData.deskripsi.length > 500) {
      const msg = 'KESALAHAN PANJANG: Deskripsi tidak boleh melebihi 500 karakter.';
      setErrors({ general: msg });
      setAlertBanner({ show: true, message: msg, type: 'error' });
      setStatusMessage({ text: msg, type: 'error' });
      setDialogState('typing');
      return;
    }

    // 7. Duplicate Key Checks (when inserting new book)
    if (!isEditMode) {
      // Check duplicate ISBN
      const existingIsbn = books.find(
        (b) => b.isbn.replace(/-/g, '') === cleanIsbn
      );
      if (existingIsbn) {
        setDuplicateModal({
          isOpen: true,
          existingBook: existingIsbn,
          newCopiesToAdd: copiesNum,
        });
        setStatusMessage({
          text: `DATA GANDA: ISBN ${existingIsbn.isbn} sudah terdaftar. Menunggu konfirmasi penambahan stok...`,
          type: 'warning',
        });
        return;
      }

      // Check duplicate Kode Buku
      const existingCode = books.find(
        (b) => b.kode_buku.toUpperCase() === formData.kode_buku.toUpperCase()
      );
      if (existingCode) {
        const msg = `DATA GANDA: Kode Buku ${formData.kode_buku} sudah digunakan oleh "${existingCode.judul_buku}". Silakan gunakan Generate Ulang.`;
        setErrors({ kode_buku: msg });
        setAlertBanner({ show: true, message: msg, type: 'error' });
        setStatusMessage({ text: msg, type: 'error' });
        setDialogState('typing');
        return;
      }
    }

    // All validation passed -> Execute Save
    const cleanPayload: Book = {
      ...formData,
      kode_buku: formData.kode_buku.trim().toUpperCase(),
      isbn: formData.isbn.trim(),
      judul_buku: formData.judul_buku.trim(),
      pengarang: formData.pengarang.trim(),
      penerbit: formData.penerbit.trim(),
      tahun_terbit: yearNum,
      jml_eksemplar: copiesNum,
      deskripsi: formData.deskripsi ? formData.deskripsi.trim() : '',
    };

    await executeSaveBook(cleanPayload, false);
  };

  // Confirm Merge Stock on Duplicate ISBN
  const handleConfirmMergeStock = async () => {
    if (!duplicateModal.existingBook) return;

    const targetBook = duplicateModal.existingBook;
    const addedCopies = duplicateModal.newCopiesToAdd;
    const updatedBook: Book = {
      ...targetBook,
      jml_eksemplar: (targetBook.jml_eksemplar || 1) + addedCopies,
    };

    setDuplicateModal({ isOpen: false, existingBook: null, newCopiesToAdd: 1 });
    await executeSaveBook(updatedBook, true);
  };

  // Step 4 IMK: Test Case Triggers
  const handleRunTestCase = (caseType: 'empty_title' | 'invalid_isbn' | 'duplicate_isbn' | 'invalid_year') => {
    // Fill with sample book first
    const demo = DEMO_SAMPLE_BOOKS[0];
    const code = getNextBookCode(books);

    const baseBook: Book = {
      kode_buku: code,
      isbn: demo.isbn,
      judul_buku: demo.judul_buku,
      pengarang: demo.pengarang,
      penerbit: demo.penerbit,
      tahun_terbit: demo.tahun_terbit,
      kode_kategori: demo.kode_kategori,
      jml_eksemplar: demo.jml_eksemplar,
      id_rak: demo.id_rak,
      deskripsi: demo.deskripsi || '',
    };

    setIsEditMode(false);

    if (caseType === 'empty_title') {
      baseBook.judul_buku = '';
      setFormData(baseBook);
      setErrors({ judul_buku: 'Kolom [Judul Buku] wajib diisi.' });
      setAlertBanner({
        show: true,
        message: 'SIMULASI UJI KASUS 1: Kolom [Judul Buku] sengaja dikosongkan untuk menguji validasi wajib isi.',
        type: 'error',
      });
      setStatusMessage({
        text: 'UJI KASUS: Kolom [Judul Buku] wajib diisi.',
        type: 'error',
      });
    } else if (caseType === 'invalid_isbn') {
      baseBook.isbn = '978-602';
      setFormData(baseBook);
      setErrors({
        isbn: 'KESALAHAN FORMAT: Nomor ISBN harus terdiri dari 10 atau 13 digit angka (saat ini: 6 digit).',
      });
      setAlertBanner({
        show: true,
        message: 'SIMULASI UJI KASUS 2: Format ISBN tidak lengkap (hanya 6 digit, standar adalah 10 atau 13 digit).',
        type: 'error',
      });
      setStatusMessage({
        text: 'UJI KASUS: Format ISBN salah (bukan 10 atau 13 digit).',
        type: 'error',
      });
    } else if (caseType === 'duplicate_isbn') {
      if (books.length > 0) {
        baseBook.isbn = books[0].isbn;
        setFormData(baseBook);
        setErrors({});
        setDuplicateModal({
          isOpen: true,
          existingBook: books[0],
          newCopiesToAdd: baseBook.jml_eksemplar || 1,
        });
        setStatusMessage({
          text: `SIMULASI UJI KASUS 3: Deteksi ISBN ganda (${books[0].isbn}) memicu dialog penambahan stok.`,
          type: 'warning',
        });
      } else {
        showToast('Tambahkan minimal 1 buku ke katalog untuk menguji deteksi ISBN ganda.', 'info');
      }
    } else if (caseType === 'invalid_year') {
      baseBook.tahun_terbit = 2099;
      setFormData(baseBook);
      setErrors({
        tahun_terbit: `KESALAHAN NILAI: Tahun terbit harus berada di antara 1900 hingga ${new Date().getFullYear()}.`,
      });
      setAlertBanner({
        show: true,
        message: 'SIMULASI UJI KASUS 4: Tahun terbit 2099 melebihi tahun berjalan saat ini.',
        type: 'error',
      });
      setStatusMessage({
        text: 'UJI KASUS: Tahun terbit tidak logis (melebihi batas maksimal).',
        type: 'error',
      });
    }

    setDialogState('typing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSupabase={isSupabase}
      />

      {/* Step 2 IMK: Dialog Stepper Bar */}
      <DialogStepper currentState={dialogState} />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Borang & Katalog Buku */}
        {activeTab === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Fill-In Borang Buku (7 Cols) */}
            <div className="lg:col-span-7">
              <BookForm
                formData={formData}
                setFormData={setFormData}
                isEditMode={isEditMode}
                errors={errors}
                setErrors={setErrors}
                statusMessage={statusMessage}
                setStatusMessage={setStatusMessage}
                setDialogState={setDialogState}
                onSave={handleFormSubmit}
                onReset={() => handleReset(true)}
                onCancel={handleCancel}
                onRegenerateCode={handleRegenerateCode}
                onFillDemo={handleFillDemo}
                alertBanner={alertBanner}
                setAlertBanner={setAlertBanner}
                categories={categories}
                racks={racks}
              />
            </div>

            {/* Right Column: Catalog List & Test Cases (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <BookCatalog
                books={books}
                isLoading={isLoading}
                categories={categories}
                racks={racks}
                onRefresh={fetchBooks}
                onEdit={handleEditBook}
                onDeleteRequest={handleDeleteRequest}
              />

              <TestCasesCard onRunTest={handleRunTestCase} />
            </div>
          </div>
        )}

        {/* Tab 2: Spesifikasi 5 Langkah IMK & Desain */}
        {activeTab === 'imk-spec' && <ImkSpecTab />}

        {/* Tab 3: Integrasi Supabase & SQL Schema */}
        {activeTab === 'supabase' && (
          <SupabaseTab
            onConfigUpdated={fetchBooks}
            showToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      <DuplicateModal
        isOpen={duplicateModal.isOpen}
        existingBook={duplicateModal.existingBook}
        newCopiesToAdd={duplicateModal.newCopiesToAdd}
        onConfirmMerge={handleConfirmMergeStock}
        onClose={() => {
          setDuplicateModal({ isOpen: false, existingBook: null, newCopiesToAdd: 1 });
          setStatusMessage({
            text: 'Penambahan stok dibatalkan. Silakan periksa kembali nomor ISBN.',
            type: 'info',
          });
        }}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        book={deleteModal.book}
        onConfirmDelete={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, book: null })}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
