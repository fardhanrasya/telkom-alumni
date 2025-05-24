# Portal Alumni Telkom

Portal Alumni untuk menghubungkan para alumni SMK Telkom Jakarta.

## 🚀 Teknologi yang Digunakan

- **Frontend**: Next.js 13 (App Router)
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (Frontend) & Sanity (CMS)

## 🛠️ Pengembangan Lokal

### Prasyarat

- Node.js 18.x atau lebih baru
- npm 9.x atau lebih baru
- Akun Sanity.io

### Langkah-langkah Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/telkom-alumni.git
   cd telkom-alumni
   ```

2. **Setup Sanity Studio**
   ```bash
   cd studio-telkom
   npm install
   cp .env.example .env.local
   ```
   
   Isi variabel lingkungan di `.env.local`:
   ```
   SANITY_AUTH_TOKEN=your-sanity-token
   SANITY_STUDIO_HOSTNAME=localhost:3333
   ```

3. **Jalankan Sanity Studio**
   ```bash
   npm run dev
   ```
   Buka http://localhost:3333 di browser Anda

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.local.example .env.local
   ```
   
   Isi variabel lingkungan yang diperlukan di `.env.local`

5. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Buka http://localhost:3000 di browser Anda

## 🤝 Berkontribusi

Kami sangat menghargai kontribusi Anda! Berikut cara untuk berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/namafitur`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/namafitur`)
5. Buat Pull Request

### Panduan Kontribusi

- Pastikan kode Anda mengikuti standar koding yang ada
- Tuliskan deskripsi yang jelas untuk setiap perubahan
- Update dokumentasi jika diperlukan
- Pastikan semua test berhasil dijalankan

## 🚀 Deployment

### Sanity Studio

Deployment otomatis diatur melalui GitHub Actions. Setiap push ke branch `main` akan memicu proses deployment ke Sanity.io.

### Variabel Lingkungan yang Diperlukan

Tambahkan secret berikut di GitHub Repository Settings > Secrets:
- `SANITY_AUTH_TOKEN`: Token akses Sanity.io

Dan tambahkan variabel berikut di GitHub Repository Settings > Variables:
- `SANITY_STUDIO_HOSTNAME`: Hostname untuk Sanity Studio (contoh: studio.telkom-alumni.com)

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
