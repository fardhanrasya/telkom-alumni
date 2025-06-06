import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang ",
  description: "Tentang Portal Alumni SMK Telkom Jakarta",
};

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Tentang Portal Alumni{" "}
              <span className="text-primary">SMK Telkom Jakarta</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Menghubungkan, membangun jaringan, dan menginspirasi para alumni
              untuk mencapai keunggulan.
            </p>
          </div>
        </div>
      </div>

      {/* Visi dan Misi */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 md:grid-cols-2">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Visi Kami
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Menjadi platform alumni terkemuka yang menghubungkan dan
                memberdayakan alumni SMK Telkom Jakarta untuk berkolaborasi,
                berbagi pengetahuan, dan memberikan kontribusi positif bagi
                komunitas dan industri.
              </p>
            </div>
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Misi Kami
              </h2>
              <ul className="mt-4 space-y-2 text-lg text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2">
                    Membangun jaringan profesional yang kuat antar alumni
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2">
                    Memfasilitasi berbagai kegiatan untuk pengembangan karir dan
                    profesional
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2">
                    Mendukung perkembangan SMK Telkom Jakarta dan siswa-siswinya
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2">
                    Menginspirasi alumni untuk terus berinovasi dan
                    berkontribusi dalam industri
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sejarah Singkat */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sejarah Singkat
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              SMK Telkom Jakarta didirikan pada tahun 1992 oleh Yayasan
              Sandhykara Putra Telkom, sebagai sekolah menengah kejuruan yang
              berfokus pada pendidikan teknologi informasi dan komunikasi.
              Selama lebih dari 30 tahun, SMK Telkom Jakarta telah menghasilkan
              lulusan berkualitas yang tersebar di berbagai perusahaan terkemuka
              di Indonesia maupun internasional.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Portal Alumni SMK Telkom Jakarta dibentuk pada tahun 2023 sebagai
              wadah untuk mempererat hubungan antar alumni, memperluas jaringan
              profesional, dan mendukung perkembangan karir para alumni.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 text-3xl font-bold text-primary">
                  5000+
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Alumni</h3>
                <p className="mt-2 text-gray-600">
                  Terhubung dalam komunitas alumni yang solid dan terus
                  berkembang
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 text-3xl font-bold text-primary">30+</div>
                <h3 className="text-xl font-semibold text-gray-900">Tahun</h3>
                <p className="mt-2 text-gray-600">
                  Pengalaman dalam mendidik generasi teknologi informasi
                  Indonesia
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 text-3xl font-bold text-primary">100+</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Perusahaan Partner
                </h3>
                <p className="mt-2 text-gray-600">
                  Bekerja sama dengan industri untuk meningkatkan kualitas
                  lulusan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tim Pengurus */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tim Pengurus Portal Alumni
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Kenali tim di balik Portal Alumni SMK Telkom Jakarta yang
              berdedikasi untuk menghubungkan dan memberdayakan alumni.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Anggota Tim 1 */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 overflow-hidden rounded-full">
                <div className="relative h-full w-full">
                  <Image
                    src="/team-1.jpg"
                    alt="Foto Ketua"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Ahmad Fauzi
              </h3>
              <p className="text-primary">Ketua Ikatan Alumni</p>
              <p className="mt-2 text-sm text-gray-600">Alumni Angkatan 2005</p>
            </div>

            {/* Anggota Tim 2 */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 overflow-hidden rounded-full">
                <div className="relative h-full w-full">
                  <Image
                    src="/team-2.jpg"
                    alt="Foto Wakil Ketua"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Siti Rahmawati
              </h3>
              <p className="text-primary">Wakil Ketua</p>
              <p className="mt-2 text-sm text-gray-600">Alumni Angkatan 2008</p>
            </div>

            {/* Anggota Tim 3 */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 overflow-hidden rounded-full">
                <div className="relative h-full w-full">
                  <Image
                    src="/team-3.jpg"
                    alt="Foto Sekretaris"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Dimas Pratama
              </h3>
              <p className="text-primary">Sekretaris</p>
              <p className="mt-2 text-sm text-gray-600">Alumni Angkatan 2010</p>
            </div>

            {/* Anggota Tim 4 */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 overflow-hidden rounded-full">
                <div className="relative h-full w-full">
                  <Image
                    src="/team-4.jpg"
                    alt="Foto Bendahara"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Anita Wijaya
              </h3>
              <p className="text-primary">Bendahara</p>
              <p className="mt-2 text-sm text-gray-600">Alumni Angkatan 2012</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pertanyaan Umum
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Berikut adalah beberapa pertanyaan yang sering diajukan tentang
              Portal Alumni SMK Telkom Jakarta.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bagaimana cara bergabung dengan Portal Alumni SMK Telkom
                  Jakarta?
                </h3>
                <p className="mt-2 text-gray-600">
                  Anda dapat mendaftar melalui website ini dengan mengklik
                  tombol "Daftar" di bagian atas halaman. Anda perlu memberikan
                  informasi alumni seperti nama lengkap, tahun kelulusan, dan
                  jurusan. Tim kami akan memverifikasi data Anda dalam waktu 1-2
                  hari kerja.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">
                  Apa saja manfaat bergabung dengan Portal Alumni?
                </h3>
                <p className="mt-2 text-gray-600">
                  Dengan bergabung, Anda akan mendapatkan akses ke direktori
                  alumni, informasi lowongan kerja eksklusif, undangan acara
                  networking, kesempatan mentoring, dan berbagai kegiatan
                  pengembangan profesional lainnya.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bagaimana cara memposting lowongan kerja di portal ini?
                </h3>
                <p className="mt-2 text-gray-600">
                  Alumni yang sudah terdaftar dapat memposting lowongan kerja
                  dengan masuk ke akun mereka dan mengklik tombol "Posting
                  Lowongan" di halaman Karir. Anda perlu mengisi detail lowongan
                  seperti judul, deskripsi, persyaratan, dan informasi kontak.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900">
                  Apakah ada biaya untuk bergabung dengan Portal Alumni?
                </h3>
                <p className="mt-2 text-gray-600">
                  Tidak, bergabung dengan Portal Alumni SMK Telkom Jakarta
                  sepenuhnya gratis. Semua fitur dan layanan yang disediakan di
                  portal ini dapat diakses tanpa biaya untuk mendukung komunitas
                  alumni.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Gabung Dengan Komunitas Alumni Kami
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Jalin koneksi dengan ribuan alumni SMK Telkom Jakarta dan akses
              berbagai kesempatan pengembangan karir.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href="/daftar"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Daftar Sekarang
              </Button>
              <Button
                href="/kontak"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
