# SIMPUS - Sistem Informasi Perpustakaan (IMK Form Fill-In & Supabase)

Aplikasi perancangan sistem berbasis **Pengisian Borang (Form Fill-In)** untuk penyimpanan data buku perpustakaan. Dibangun menggunakan **React + TypeScript + Vite + Tailwind CSS**, terintegrasi dengan **Supabase PostgreSQL** dengan skema relasional 3 tabel (`tb_kategori_ddc`, `tb_lokasi_rak`, `tb_buku`) dan mode simulasi **LocalStorage** offline.

---

## 🎯 5 Langkah Perancangan Tampilan (IMK)

1. **Langkah 1: Pemilihan Ragam Dialog**
   - Menggunakan pendekatan **Form Fill-In (Pengisian Borang)** terstruktur dengan urutan navigasi tombol `Tab`, kolom wajib bintang (`*`), pilihan terkontrol (*dropdown* DDC 000–900 & Master Rak), dan tombol pintasan cepat (`Enter`, `Alt+R`, `Esc`).

2. **Langkah 2: Perancangan Struktur Dialog**
   - Dilengkapi *Interactive Dialog Stepper* real-time:
     `1. Siap Menerima Masukan` &rarr; `2. Mengisi Borang` &rarr; `3. Validasi Masukan` &rarr; `4. Simpan Basis Data`.

3. **Langkah 3: Perancangan Format Pesan**
   - Banner prompt/petunjuk pengisian jelas di atas borang.
   - Batasan dan penghitung karakter langsung (*character counter* untuk judul, digit ISBN 10/13, deskripsi maks. 500 karakter).
   - *Status bar* di kaki borang dilengkapi jam lokal real-time.

4. **Langkah 4: Penanganan Kesalahan (Error Handling)**
   - **Preventif:** *Input masking* angka saja untuk ISBN, Tahun Terbit (1900–2026), dan Eksemplar ($\ge 1$).
   - **Korektif:** Animasi getar (`shake-error`) & bingkai merah, fokus otomatis ke kolom salah.
   - **Smart Duplicate Resolution:** Jika nomor ISBN sudah terdaftar, muncul dialog konfirmasi untuk menambahkan eksemplar ke stok buku yang sudah ada alih-alih melempar pesan galat buntu.
   - **Test Case Runner:** Kartu simulasi 4 kasus uji (Field kosong, ISBN salah format, Duplikasi ISBN, Tahun masa depan).

5. **Langkah 5: Perancangan Struktur Data (Skema Relasional Supabase)**
   - **`tb_kategori_ddc`**: Tabel referensi klasifikasi DDC (`kode_kategori` CHAR(3) PK).
   - **`tb_lokasi_rak`**: Tabel master lokasi rak (`id_rak` VARCHAR(10) PK).
   - **`tb_buku`**: Tabel utama penyimpanan buku dengan Foreign Key `fk_buku_kategori` dan `fk_buku_rak` (`ON UPDATE CASCADE ON DELETE RESTRICT`).

---

## 🚀 Cara Menjalankan Aplikasi

1. **Jalankan server pengembangan (Dev Server):**
   ```bash
   npm run dev
   ```
2. Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:5173`).

---

## 🗄️ Menghubungkan ke Database Supabase

1. Buka [Supabase Dashboard](https://supabase.com) dan buat proyek baru.
2. Buka menu **SQL Editor**, lalu salin dan jalankan skrip DDL berikut (juga dapat disalin dengan 1 klik pada tab "3. Integrasi Supabase & SQL Schema" di dalam aplikasi):

```sql
-- 1. TABEL REFERENSI KATEGORI DDC
CREATE TABLE IF NOT EXISTS public.tb_kategori_ddc (
    kode_kategori CHAR(3) PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    keterangan TEXT NULL
);

-- 2. TABEL MASTER LOKASI RAK
CREATE TABLE IF NOT EXISTS public.tb_lokasi_rak (
    id_rak VARCHAR(10) PRIMARY KEY,
    nama_rak VARCHAR(50) NOT NULL,
    lantai INT NOT NULL DEFAULT 1,
    kapasitas INT NOT NULL DEFAULT 100
);

-- 3. TABEL UTAMA PENYIMPANAN DATA BUKU
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

-- 4. PENGATURAN ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE public.tb_kategori_ddc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_lokasi_rak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_buku ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Izinkan baca kategori ddc" ON public.tb_kategori_ddc FOR SELECT USING (true);
CREATE POLICY "Izinkan baca lokasi rak" ON public.tb_lokasi_rak FOR SELECT USING (true);

CREATE POLICY "Izinkan baca buku" ON public.tb_buku FOR SELECT USING (true);
CREATE POLICY "Izinkan tambah buku" ON public.tb_buku FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan perbarui buku" ON public.tb_buku FOR UPDATE USING (true);
CREATE POLICY "Izinkan hapus buku" ON public.tb_buku FOR DELETE USING (true);

-- 5. SEED DATA LENGKAP (000 - 900)
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
ON CONFLICT (kode_kategori) DO NOTHING;

INSERT INTO public.tb_lokasi_rak (id_rak, nama_rak, lantai, kapasitas) VALUES
('RAK-A01', 'Rak A-01 (Referensi Umum)', 1, 150),
('RAK-A02', 'Rak A-02 (Ilmu Komputer & TI)', 1, 200),
('RAK-B01', 'Rak B-01 (Ilmu Terapan & Teknik)', 2, 180),
('RAK-B02', 'Rak B-02 (Sosial, Hukum & Ekonomi)', 2, 160),
('RAK-C01', 'Rak C-01 (Sastra, Bahasa & Sejarah)', 3, 140)
ON CONFLICT (id_rak) DO NOTHING;
```

3. Masuk ke tab **"3. Integrasi Supabase & SQL Schema"** pada aplikasi web, masukkan **Supabase Project URL** dan **Anon Key**, lalu klik **Simpan & Hubungkan**.
4. Aplikasi akan secara dinamis menyinkronkan data kategori DDC, master rak, serta buku dari Supabase!
