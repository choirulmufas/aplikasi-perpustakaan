import type { Book } from '../types/book';

const STORAGE_KEY_BOOKS = 'simpus_imk_books_v2';

export const INITIAL_BOOKS: Book[] = [
  {
    kode_buku: 'BK-2026-0042',
    isbn: '978-602-03-3295-6',
    judul_buku: 'Pengantar Interaksi Manusia dan Komputer',
    pengarang: 'P. Insap Santosa',
    penerbit: 'Penerbit Andi',
    tahun_terbit: 2024,
    kode_kategori: '000',
    jml_eksemplar: 5,
    id_rak: 'RAK-A02',
    deskripsi: 'Buku teks dasar perancangan antarmuka, ergonomi dialog, dan evaluasi kegunaan sistem.',
    created_at: new Date('2026-01-15T08:00:00Z').toISOString(),
  },
  {
    kode_buku: 'BK-2026-0043',
    isbn: '978-979-29-5112-7',
    judul_buku: 'Sistem Basis Data Relasional dan SQL Modern',
    pengarang: 'Abdul Kadir',
    penerbit: 'Penerbit Andi',
    tahun_terbit: 2023,
    kode_kategori: '000',
    jml_eksemplar: 3,
    id_rak: 'RAK-A01',
    deskripsi: 'Panduan praktis perancangan skema ERD, normalisasi, dan integrasi basis data modern.',
    created_at: new Date('2026-02-10T09:30:00Z').toISOString(),
  },
  {
    kode_buku: 'BK-2026-0044',
    isbn: '978-623-00-1982-1',
    judul_buku: 'Desain Antarmuka Pengguna & Sistem Desain (UI/UX)',
    pengarang: 'Rully Priyambodo',
    penerbit: 'Elex Media Komputindo',
    tahun_terbit: 2025,
    kode_kategori: '700',
    jml_eksemplar: 4,
    id_rak: 'RAK-A02',
    deskripsi: 'Prinsip tata letak visual, konsistensi token desain, dan riset kegunaan pengguna.',
    created_at: new Date('2026-03-01T11:15:00Z').toISOString(),
  },
];

export function getLocalBooks(): Book[] {
  const raw = localStorage.getItem(STORAGE_KEY_BOOKS);
  if (!raw) {
    saveLocalBooks(INITIAL_BOOKS);
    return INITIAL_BOOKS;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveLocalBooks(INITIAL_BOOKS);
    return INITIAL_BOOKS;
  } catch {
    saveLocalBooks(INITIAL_BOOKS);
    return INITIAL_BOOKS;
  }
}

export function saveLocalBooks(books: Book[]) {
  localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
}

export function getNextBookCode(books: Book[]): string {
  let maxNum = 44;
  const currentYear = new Date().getFullYear();

  books.forEach((b) => {
    const match = String(b.kode_buku).match(/BK-\d{4}-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  });

  return `BK-${currentYear}-${String(maxNum + 1).padStart(4, '0')}`;
}

export const DEMO_SAMPLE_BOOKS: Omit<Book, 'kode_buku'>[] = [
  {
    isbn: '978-602-04-8812-3',
    judul_buku: 'Rekayasa Perangkat Lunak Berorientasi Objek',
    pengarang: 'Rosa A.S. & M. Shalahuddin',
    penerbit: 'Informatika Bandung',
    tahun_terbit: 2024,
    kode_kategori: '000',
    jml_eksemplar: 6,
    id_rak: 'RAK-A01',
    deskripsi: 'Pembahasan lengkap analisis kebutuhan pengguna, perancangan diagram UML, dan siklus hidup SDLC.',
  },
  {
    isbn: '978-623-7131-44-1',
    judul_buku: 'Arsitektur Cloud dan Microservices Modern',
    pengarang: 'Budi Raharjo',
    penerbit: 'Informatika Bandung',
    tahun_terbit: 2025,
    kode_kategori: '600',
    jml_eksemplar: 4,
    id_rak: 'RAK-B01',
    deskripsi: 'Panduan implementasi container, orkestrasi microservices, dan basis data terdistribusi.',
  },
  {
    isbn: '978-979-22-3870-9',
    judul_buku: 'Psikologi Komunikasi Interpersonal',
    pengarang: 'Jalaluddin Rakhmat',
    penerbit: 'Remaja Rosdakarya',
    tahun_terbit: 2023,
    kode_kategori: '100',
    jml_eksemplar: 3,
    id_rak: 'RAK-B02',
    deskripsi: 'Telaah interaksi manusia, persepsi kognitif, dan proses penyampaian pesan antarmuka.',
  },
];
