import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CategoryDDC, RackLocation } from '../types/book';

const STORAGE_KEY_SB_URL = 'simpus_sb_url';
const STORAGE_KEY_SB_KEY = 'simpus_sb_key';

export function getSupabaseCredentials(): { url: string; key: string } {
  const envUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    '';
  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  const localUrl = localStorage.getItem(STORAGE_KEY_SB_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_SB_KEY) || '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
  };
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (url) {
    localStorage.setItem(STORAGE_KEY_SB_URL, url.trim().replace(/\/$/, ''));
  } else {
    localStorage.removeItem(STORAGE_KEY_SB_URL);
  }

  if (key) {
    localStorage.setItem(STORAGE_KEY_SB_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_SB_KEY);
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key);
}

let supabaseInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) {
    supabaseInstance = null;
    return null;
  }

  if (!supabaseInstance || url !== lastUrl || key !== lastKey) {
    lastUrl = url;
    lastKey = key;
    supabaseInstance = createClient(url, key);
  }

  return supabaseInstance;
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'URL atau Anon Key Supabase belum diisi.' };
  }

  try {
    // 1. Check tb_buku
    const { error: errBuku } = await client.from('tb_buku').select('kode_buku').limit(1);
    if (errBuku) {
      if (errBuku.code === '42P01') {
        return {
          success: false,
          message: 'Tabel "tb_buku" belum ditemukan di Supabase. Silakan jalankan skrip SQL perbaikan di SQL Editor.',
        };
      }
      return { success: false, message: `Galat tb_buku: ${errBuku.message}` };
    }

    // 2. Check foreign key master tables
    const { error: errKategori } = await client.from('tb_kategori_ddc').select('kode_kategori').limit(1);
    const { error: errRak } = await client.from('tb_lokasi_rak').select('id_rak').limit(1);

    if (errKategori || errRak) {
      return {
        success: false,
        message: 'Tabel master relasi (tb_kategori_ddc / tb_lokasi_rak) belum dibuat atau belum diberi hak akses RLS.',
      };
    }

    return {
      success: true,
      message: 'Koneksi ke Supabase berhasil! Seluruh tabel relasional (tb_kategori_ddc, tb_lokasi_rak, tb_buku) terhubung.',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghubungi server Supabase';
    return { success: false, message };
  }
}

export async function fetchMasterDataFromSupabase(): Promise<{
  categories: CategoryDDC[] | null;
  racks: RackLocation[] | null;
}> {
  const client = getSupabaseClient();
  if (!client) return { categories: null, racks: null };

  try {
    const [resCat, resRak] = await Promise.all([
      client.from('tb_kategori_ddc').select('*').order('kode_kategori', { ascending: true }),
      client.from('tb_lokasi_rak').select('*').order('id_rak', { ascending: true }),
    ]);

    return {
      categories: resCat.data as CategoryDDC[] | null,
      racks: resRak.data as RackLocation[] | null,
    };
  } catch (e) {
    console.warn('Gagal memuat master data relasi dari Supabase:', e);
    return { categories: null, racks: null };
  }
}

// SQL Schema DDL Text for user copy
export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- SISTEM INFORMASI PERPUSTAKAAN (SIMPUS) - SKEMA BASIS DATA SUPABASE
-- Arsitektur Relasional 3 Tabel: Referensi DDC, Master Rak, dan Data Buku
-- =========================================================================

-- 1. TABEL REFERENSI KATEGORI DDC (Induk Relasi Foreign Key kode_kategori)
CREATE TABLE IF NOT EXISTS public.tb_kategori_ddc (
    kode_kategori CHAR(3) PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    keterangan TEXT NULL
);

-- 2. TABEL MASTER LOKASI RAK (Induk Relasi Foreign Key id_rak)
CREATE TABLE IF NOT EXISTS public.tb_lokasi_rak (
    id_rak VARCHAR(10) PRIMARY KEY,
    nama_rak VARCHAR(50) NOT NULL,
    lantai INT NOT NULL DEFAULT 1,
    kapasitas INT NOT NULL DEFAULT 100
);

-- 3. TABEL UTAMA PENYIMPANAN DATA BUKU (tb_buku)
CREATE TABLE IF NOT EXISTS public.tb_buku (
    kode_buku VARCHAR(15) PRIMARY KEY,
    isbn VARCHAR(17) NOT NULL UNIQUE,
    judul_buku VARCHAR(150) NOT NULL,
    pengarang VARCHAR(100) NOT NULL,
    penerbit VARCHAR(100) NOT NULL,
    tahun_terbit INT NOT NULL CHECK (tahun_terbit >= 1900 AND tahun_terbit <= 2026),
    kode_kategori CHAR(3) NOT NULL,
    jml_eksemplar INT NOT NULL DEFAULT 1 CHECK (jml_eksemplar >= 1),
    id_rak VARCHAR(10) NOT NULL,
    deskripsi TEXT NULL CHECK (CHAR_LENGTH(deskripsi) <= 500),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Definisi Relasi Foreign Key (Integritas Referensial)
    CONSTRAINT fk_buku_kategori
        FOREIGN KEY (kode_kategori) 
        REFERENCES public.tb_kategori_ddc (kode_kategori)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_buku_rak
        FOREIGN KEY (id_rak) 
        REFERENCES public.tb_lokasi_rak (id_rak)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =========================================================================
-- PENGATURAN KEAMANAN SUPABASE: ROW LEVEL SECURITY (RLS) & AKSES POLISI
-- (Wajib diaktifkan agar REST API client Supabase dapat membaca & menulis data)
-- =========================================================================

ALTER TABLE public.tb_kategori_ddc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_lokasi_rak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_buku ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: tb_kategori_ddc (Hanya Baca Publik / Anon)
DROP POLICY IF EXISTS "Izinkan baca kategori ddc" ON public.tb_kategori_ddc;
CREATE POLICY "Izinkan baca kategori ddc" ON public.tb_kategori_ddc
    FOR SELECT USING (true);

-- Kebijakan Akses: tb_lokasi_rak (Hanya Baca Publik / Anon)
DROP POLICY IF EXISTS "Izinkan baca lokasi rak" ON public.tb_lokasi_rak;
CREATE POLICY "Izinkan baca lokasi rak" ON public.tb_lokasi_rak
    FOR SELECT USING (true);

-- Kebijakan Akses: tb_buku (Akses Penuh CRUD Operasional Pustakawan)
DROP POLICY IF EXISTS "Izinkan baca buku" ON public.tb_buku;
CREATE POLICY "Izinkan baca buku" ON public.tb_buku
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Izinkan tambah buku" ON public.tb_buku;
CREATE POLICY "Izinkan tambah buku" ON public.tb_buku
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Izinkan perbarui buku" ON public.tb_buku;
CREATE POLICY "Izinkan perbarui buku" ON public.tb_buku
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Izinkan hapus buku" ON public.tb_buku;
CREATE POLICY "Izinkan hapus buku" ON public.tb_buku
    FOR DELETE USING (true);

-- =========================================================================
-- DATA AWAL LENGKAP (SEED DATA)
-- Meliputi seluruh 10 Klasifikasi Utama DDC (000 - 900) agar tidak terjadi
-- pelanggaran Foreign Key Constraint saat pengguna memilih kategori apapun.
-- =========================================================================

INSERT INTO public.tb_kategori_ddc (kode_kategori, nama_kategori, keterangan) VALUES
('000', 'Komputer, Informasi & Referensi Umum', 'Karya umum, ilmu komputer, dan informasi'),
('100', 'Filsafat & Psikologi', 'Filsafat, psikologi, logika, dan etika'),
('200', 'Agama & Teologi', 'Agama, teologi, dan perbandingan agama'),
('300', 'Ilmu Sosial', 'Sosiologi, ekonomi, hukum, dan administrasi'),
('400', 'Bahasa & Linguistik', 'Tata bahasa, kamus, dan linguistik terapan'),
('500', 'Sains Murni & Matematika', 'Matematika, fisika, kimia, dan biologi'),
('600', 'Teknologi dan Ilmu Terapan', 'Rekayasa, kedokteran, manajemen, dan industri'),
('700', 'Kesenian, Desain & Arsitektur', 'Seni rupa, arsitektur, fotografi, dan musik'),
('800', 'Sastra, Retorika & Puisi', 'Novel, puisi, drama, dan kritik sastra'),
('900', 'Sejarah & Geografi', 'Sejarah dunia, geografi, dan biografi')
ON CONFLICT (kode_kategori) DO UPDATE 
SET nama_kategori = EXCLUDED.nama_kategori, keterangan = EXCLUDED.keterangan;

INSERT INTO public.tb_lokasi_rak (id_rak, nama_rak, lantai, kapasitas) VALUES
('RAK-A01', 'Rak A-01 (Referensi Umum)', 1, 150),
('RAK-A02', 'Rak A-02 (Ilmu Komputer & TI)', 1, 200),
('RAK-B01', 'Rak B-01 (Ilmu Terapan & Teknik)', 2, 180),
('RAK-B02', 'Rak B-02 (Sosial, Hukum & Ekonomi)', 2, 160),
('RAK-C01', 'Rak C-01 (Sastra, Bahasa & Sejarah)', 3, 140)
ON CONFLICT (id_rak) DO UPDATE 
SET nama_rak = EXCLUDED.nama_rak, lantai = EXCLUDED.lantai, kapasitas = EXCLUDED.kapasitas;

-- Contoh Data Buku Awal yang Memenuhi Relasi Foreign Key
INSERT INTO public.tb_buku (
    kode_buku, isbn, judul_buku, pengarang, penerbit,
    tahun_terbit, kode_kategori, jml_eksemplar, id_rak, deskripsi
) VALUES 
(
    'BK-2026-0042', '978-602-03-3295-6',
    'Pengantar Interaksi Manusia dan Komputer', 'P. Insap Santosa',
    'Penerbit Andi', 2024, '000', 5, 'RAK-A02',
    'Buku teks dasar perancangan antarmuka, ergonomi dialog, dan evaluasi kegunaan sistem.'
),
(
    'BK-2026-0043', '978-979-29-5112-7',
    'Sistem Basis Data Relasional dan SQL Modern', 'Abdul Kadir',
    'Penerbit Andi', 2023, '000', 3, 'RAK-A01',
    'Panduan praktis perancangan skema ERD, normalisasi, dan integrasi basis data modern.'
),
(
    'BK-2026-0044', '978-623-00-1982-1',
    'Desain Antarmuka Pengguna & Sistem Desain (UI/UX)', 'Rully Priyambodo',
    'Elex Media Komputindo', 2025, '700', 4, 'RAK-A02',
    'Prinsip tata letak visual, konsistensi token desain, dan riset kegunaan pengguna.'
)
ON CONFLICT (kode_buku) DO NOTHING;
`;
