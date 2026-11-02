export interface CategoryDDC {
  kode_kategori: string;  // CHAR(3) PK: '000' s.d '900'
  nama_kategori: string;  // VARCHAR(100)
  keterangan?: string | null;
}

export interface RackLocation {
  id_rak: string;         // VARCHAR(10) PK: 'RAK-A01'
  nama_rak: string;       // VARCHAR(50)
  lantai: number;         // INT, DEFAULT 1
  kapasitas: number;      // INT, DEFAULT 100
}

export interface Book {
  kode_buku: string;       // PK: BK-YYYY-XXXX (15 chars)
  isbn: string;            // 10 or 13 digits (with hyphens, 17 chars, UNIQUE)
  judul_buku: string;      // Max 150 chars, NOT NULL
  pengarang: string;       // Max 100 chars, NOT NULL
  penerbit: string;        // Max 100 chars, NOT NULL
  tahun_terbit: number;    // 1900 - current year, NOT NULL
  kode_kategori: string;   // FK to tb_kategori_ddc.kode_kategori (CHAR 3)
  jml_eksemplar: number;   // >= 1, NOT NULL, DEFAULT 1
  id_rak: string;          // FK to tb_lokasi_rak.id_rak (VARCHAR 10)
  deskripsi?: string;      // Optional, max 500 chars (CHECK CHAR_LENGTH <= 500)
  created_at?: string;     // TIMESTAMPTZ DEFAULT NOW()

  // Optional relations populated via JOIN query
  tb_kategori_ddc?: CategoryDDC;
  tb_lokasi_rak?: RackLocation;
}

export type DialogState = 'idle' | 'typing' | 'validating' | 'saving';

export interface FormErrors {
  kode_buku?: string;
  isbn?: string;
  judul_buku?: string;
  pengarang?: string;
  penerbit?: string;
  tahun_terbit?: string;
  jml_eksemplar?: string;
  id_rak?: string;
  kode_kategori?: string;
  general?: string;
}

export interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export type BannerType = 'error' | 'warning' | 'success' | 'info';

export interface AlertBannerState {
  show: boolean;
  message: string;
  type: BannerType;
}

// Master Fallback Data (Lokal & Offline)
export const DEFAULT_DDC_CATEGORIES: CategoryDDC[] = [
  { kode_kategori: '000', nama_kategori: 'Komputer, Informasi & Referensi Umum', keterangan: 'Karya umum, ilmu komputer, dan informasi' },
  { kode_kategori: '100', nama_kategori: 'Filsafat & Psikologi', keterangan: 'Filsafat, psikologi, logika, dan etika' },
  { kode_kategori: '200', nama_kategori: 'Agama & Teologi', keterangan: 'Agama, teologi, dan perbandingan agama' },
  { kode_kategori: '300', nama_kategori: 'Ilmu Sosial', keterangan: 'Sosiologi, ekonomi, hukum, dan administrasi' },
  { kode_kategori: '400', nama_kategori: 'Bahasa & Linguistik', keterangan: 'Tata bahasa, kamus, dan linguistik terapan' },
  { kode_kategori: '500', nama_kategori: 'Sains Murni & Matematika', keterangan: 'Matematika, fisika, kimia, dan biologi' },
  { kode_kategori: '600', nama_kategori: 'Teknologi dan Ilmu Terapan', keterangan: 'Rekayasa, kedokteran, manajemen, dan industri' },
  { kode_kategori: '700', nama_kategori: 'Kesenian, Desain & Arsitektur', keterangan: 'Seni rupa, arsitektur, fotografi, dan musik' },
  { kode_kategori: '800', nama_kategori: 'Sastra, Retorika & Puisi', keterangan: 'Novel, puisi, drama, dan kritik sastra' },
  { kode_kategori: '900', nama_kategori: 'Sejarah & Geografi', keterangan: 'Sejarah dunia, geografi, dan biografi' },
];

export const DEFAULT_RACK_LOCATIONS: RackLocation[] = [
  { id_rak: 'RAK-A01', nama_rak: 'Rak A-01 (Referensi Umum)', lantai: 1, kapasitas: 150 },
  { id_rak: 'RAK-A02', nama_rak: 'Rak A-02 (Ilmu Komputer & TI)', lantai: 1, kapasitas: 200 },
  { id_rak: 'RAK-B01', nama_rak: 'Rak B-01 (Ilmu Terapan & Teknik)', lantai: 2, kapasitas: 180 },
  { id_rak: 'RAK-B02', nama_rak: 'Rak B-02 (Sosial, Hukum & Ekonomi)', lantai: 2, kapasitas: 160 },
  { id_rak: 'RAK-C01', nama_rak: 'Rak C-01 (Sastra, Bahasa & Sejarah)', lantai: 3, kapasitas: 140 },
];
