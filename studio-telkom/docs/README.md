# Dokumentasi Sanity Studio Telkom Alumni

## 1. Ringkasan Proyek

Proyek Sanity ini digunakan sebagai backend CMS untuk platform Telkom Alumni. Sistem ini mengelola data alumni, berita, acara, lowongan kerja, serta metadata SEO untuk setiap bagian utama situs. Semua data terstruktur dan saling terhubung melalui referensi antar skema.

---

## 2. Skema Utama & Relasi

### a. Alumni (`alumni`)

- **Deskripsi:** Menyimpan data profil alumni.
- **Field Utama:**
  - `name`: Nama lengkap
  - `slug`: Slug unik
  - `yearGraduated`: Tahun lulus
  - `major`: Jurusan
  - `profileImage`: Foto profil
  - `email`: Email
  - `socialMedia`: Media sosial (LinkedIn, Instagram, Twitter/X)
  - `currentJob`: Pekerjaan saat ini (jabatan, perusahaan, tanggal mulai)
  - `bio`: Biografi
  - `achievements`: Prestasi (judul, tahun, deskripsi)
- **Relasi:**
  - Direferensikan oleh skema `jobPosting` pada field `postedBy` (alumni yang memposting lowongan).

### b. Berita (`NewsPost`)

- **Deskripsi:** Menyimpan artikel berita.
- **Field Utama:**
  - `title`, `subtitle`, `slug`, `mainImage`, `excerpt`, `body`, `featured`, `status`
  - `author`: Referensi ke skema `Author`
  - `tags`: Array referensi ke skema `NewsTag`
  - `publishedAt`, `updatedAt`: Tanggal publikasi & update
- **Relasi:**
  - Referensi ke `Author` (penulis berita)
  - Referensi ke `NewsTag` (kategori/tag berita)

### c. Author (`Author`)

- **Deskripsi:** Data penulis berita.
- **Field Utama:**
  - `name`, `image`, `position`
- **Relasi:**
  - Direferensikan oleh `NewsPost` pada field `author`

### d. News Tag (`NewsTag`)

- **Deskripsi:** Tag/kategori berita.
- **Field Utama:**
  - `name`, `slug`, `description`
- **Relasi:**
  - Direferensikan oleh `NewsPost` pada field `tags`

### e. Acara (`event`)

- **Deskripsi:** Menyimpan data acara/event.
- **Field Utama:**
  - `title`, `slug`, `startDate`, `endDate`, `location`, `isVirtual`, `virtualLink`, `image`, `description`, `registrationLink`
  - `speakers`: Array objek pembicara (nama, jabatan, perusahaan, bio, foto)
- **Relasi:**
  - Pembicara berupa objek, bukan referensi ke dokumen lain.

### f. Lowongan Kerja (`jobPosting`)

- **Deskripsi:** Menyimpan data lowongan kerja.
- **Field Utama:**
  - `title`, `slug`, `company` (nama, logo, website, lokasi), `publishedAt`, `expiresAt`, `jobType`, `workplaceType`, `salaryRange`, `description`, `requirements`, `responsibilities`, `applyLink`, `contactEmail`
  - `postedBy`: Referensi ke alumni (yang memposting lowongan)
- **Relasi:**
  - Referensi ke `alumni` pada field `postedBy`

---

## 3. Metadata Singleton

Setiap bagian utama situs memiliki dokumen metadata (hanya satu dokumen per jenis) untuk keperluan SEO dan social sharing:

- `beritaMetadata` (Berita)
- `karirMetadata` (Karir/Lowongan)
- `alumniMetadata` (Alumni)
- `acaraMetadata` (Acara)
- `tentangMetadata` (Tentang)
- `homeMetadata` (Beranda)

**Field Metadata:**

- `title`, `description`, `keywords` (SEO)
- `ogTitle`, `ogDescription`, `ogImage`, `ogImageAlt` (Open Graph)
- `twitterTitle`, `twitterDescription`, `twitterImage` (Twitter Card)

---

## 4. Fungsi Utama Proyek

- **Manajemen Konten:** Admin dapat membuat, mengedit, dan menghubungkan data alumni, berita, acara, dan lowongan kerja.
- **Relasi Data:** Menggunakan referensi untuk menghubungkan alumni dengan lowongan, penulis dengan berita, dan tag dengan berita.
- **SEO & Social Sharing:** Metadata singleton memastikan setiap halaman utama situs optimal untuk mesin pencari dan media sosial.
- **Mudah Dikembangkan:** Struktur modular, mudah ditambah skema atau relasi baru sesuai kebutuhan.

---

## 5. Struktur File Skema

Semua skema berada di folder `schemaTypes/`:

- `alumniType.ts`, `newsPostType.ts`, `eventType.ts`, `jobPostingType.ts` (skema utama)
- `beritaMetadata.ts`, `karirMetadata.ts`, `alumniMetadata.ts`, `acaraMetadata.ts`, `tentangMetadata.ts`, `homeMetadata.ts` (metadata)
- `index.ts` (menggabungkan semua skema)

---

> **Catatan:**
>
> - Setiap perubahan pada struktur skema harus diupdate di file terkait di folder `schemaTypes/`.
> - Metadata hanya boleh ada satu dokumen per jenis (singleton) untuk setiap bagian.
