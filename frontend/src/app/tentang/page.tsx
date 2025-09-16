import React from "react";
import { Button } from "@/components/ui/Button";
import Contributors from "@/components/Contributors";
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
                Visi SMK Telkom Jakarta
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Menjadi Sekolah Kejuruan Terdepan yang Menghasilkan Lulusan
                Berdaya Saing Global, Inovatif, dan Unggul dalam Teknologi serta
                Siap Menghadapi Tantangan Industri Digital.
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
                Misi SMK Telkom Jakarta
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
                    Menyelenggarakan pembelajaran berbasis industri
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
                    Membangun kemitraan erat dengan dunia usaha dan industri
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
                    Mengintegrasikan teknologi modern dalam pembelajaran
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
                    Memperkuat jaringan alumni sebagai mentor dan mitra industri
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
                    Mendorong sertifikasi kompetensi nasional dan internasional
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
              Sejarah SMK Telkom Jakarta
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              SMK Telkom Jakarta yang sebelumnya bernama SMK Telkom Sandhy Putra
              Jakarta, sejak Maret 2014 berubah menjadi SMK Telkom Jakarta
              dengan dicanangkannya Telkom Schools oleh Telkom Foundation.
              Sekolah ini dikelola oleh Yayasan Sandhykara Putra Telkom (YSPT)
              yang didirikan pada tanggal 17 Januari 1980.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Peluncuran Telkom Schools dilaksanakan di SMK Telkom Jakarta pada
              tanggal 23 Januari 2014 oleh Dirjen Pendidikan Menengah
              Kemendikbud RI Prof. Dr. Ir. Achmad Jazidie. Telkom Schools
              menjadi sarana pengabdian PT. Telkom grup dalam program CSR di
              bidang pengembangan pendidikan, khususnya pendidikan penguasaan
              teknologi ICT untuk mendukung industri TIMES (Telecommunication
              Information Media Edutainment & Services).
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Portal Alumni SMK Telkom Jakarta dibentuk sebagai wadah untuk
              mempererat hubungan antar alumni, memperluas jaringan profesional,
              dan mendukung perkembangan karir para alumni dalam menghadapi
              tantangan industri digital.
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
                <div className="mb-4 text-3xl font-bold text-primary">44+</div>
                <h3 className="text-xl font-semibold text-gray-900">Tahun</h3>
                <p className="mt-2 text-gray-600">
                  Pengalaman Yayasan Sandhykara Putra Telkom dalam bidang
                  pendidikan teknologi Indonesia
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 text-3xl font-bold text-primary">
                  TIMES
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Industri Focus
                </h3>
                <p className="mt-2 text-gray-600">
                  Telecommunication, Information, Media, Edutainment & Services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16">
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

      {/* Contributors Section */}
      <Contributors />
    </div>
  );
};

export default AboutPage;
