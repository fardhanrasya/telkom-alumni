import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/client";
import { getEventBySlugQuery } from "@/sanity/queries/eventQueries";
import { formatDate, formatTime } from "@/lib/utils";
import { PortableText } from "@portabletext/react";

// Definisikan tipe params sesuai dengan yang diharapkan Next.js
type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// Interface untuk speaker acara
interface Speaker {
  name: string;
  title?: string; // Jabatan
  company?: string;
  bio?: string;
  image?: {
    asset?: {
      _ref: string;
    };
  };
}

// Komponen PortableText
const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-base leading-relaxed">{children}</p>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-4 text-2xl font-bold">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-3 text-xl font-bold">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 text-lg font-bold">{children}</h3>
    ),
  },
};

// Fungsi untuk mendapatkan data acara dari server-side
async function getEventData(slug: string) {
  try {
    // Menggunakan client Sanity untuk mendapatkan data acara berdasarkan slug
    const data = await client.fetch(getEventBySlugQuery, {
      slug: slug,
    });
    return { data };
  } catch (err) {
    console.error("Error mengambil data acara:", err);
    return { error: "Terjadi kesalahan saat mengambil data acara" };
  }
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const resolvedParams = await params;
  const { data: event, error } = await getEventData(resolvedParams.slug);

  // Tampilan jika terjadi error
  if (error || !event) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Acara tidak ditemukan
        </h1>
        <p className="mb-8 text-gray-600">Silakan kembali ke halaman acara</p>
        <Link href="/acara">
          <Button variant="default">Kembali ke Daftar Acara</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header dengan tombol kembali */}
        <div className="mb-8 flex items-center">
          <Link href="/acara" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Detail Acara</h1>
        </div>

        {/* Card utama acara */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          {/* Header gambar */}
          <div className="relative h-64 w-full md:h-96">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-gray-500">Tidak ada gambar</span>
              </div>
            )}
            {event.isVirtual && (
              <div className="absolute left-4 top-4 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                Acara Online
              </div>
            )}
          </div>

          {/* Konten acara */}
          <div className="p-6 md:p-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {event.title}
            </h1>

            {/* Informasi acara */}
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Tanggal</h3>
                  <p className="text-gray-600">{formatDate(event.startDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Waktu</h3>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                        Mulai
                      </span>
                      <p className="text-gray-700">
                        {formatTime(event.startDate)}
                      </p>
                    </div>
                    {event.endDate && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          Selesai
                        </span>
                        <p className="text-gray-700">
                          {formatTime(event.endDate)}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(event.startDate)}
                      {event.endDate &&
                        new Date(event.startDate).toDateString() !==
                        new Date(event.endDate).toDateString() &&
                        ` - ${formatDate(event.endDate)}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Lokasi</h3>
                  {typeof event.location === "object" && event.location ? (
                    <div>
                      <p className="text-gray-900 font-medium">
                        {event.location.name || "Lokasi tidak tersedia"}
                      </p>
                      {event.location.address && (
                        <p className="text-gray-600 text-sm mt-1">
                          {event.location.address}
                        </p>
                      )}
                      {event.location.city && (
                        <p className="text-gray-600 text-sm">
                          {event.location.city}
                        </p>
                      )}
                      {event.location.mapLink && (
                        <a
                          href={event.location.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 text-sm mt-1 flex items-center gap-1 hover:underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 1.586l-4 4V4a1 1 0 00-2 0v4a1 1 0 001 1h4a1 1 0 000-2H9.414l4-4a1 1 0 00-1.414-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Lihat di Google Maps
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">{event.location}</p>
                  )}
                </div>
              </div>

              {event.isVirtual && event.virtualLink && (
                <div className="flex items-start gap-3">
                  <Video className="mt-1 h-5 w-5 text-primary-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Link Virtual</h3>
                    <a
                      href={event.virtualLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Buka Link Meeting
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Deskripsi acara */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-primary-500"></div>
                Deskripsi Acara
              </h2>
              <div className="prose prose-gray max-w-none rounded-xl bg-gray-50 p-6 text-gray-800">
                {typeof event.description === "string" ? (
                  <p className="whitespace-pre-line text-base leading-relaxed">
                    {event.description}
                  </p>
                ) : (
                  <div className="text-base leading-relaxed">
                    <PortableText
                      value={event.description}
                      components={portableTextComponents}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pembicara acara */}
            {Array.isArray(event.speakers) && event.speakers.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-primary-500"></div>
                  Pembicara
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {event.speakers.map((speaker: Speaker, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 border-2 border-primary-100">
                          {speaker.image?.asset?._ref ? (
                            <Image
                              src={`https://cdn.sanity.io/images/1btnolup/dev/${speaker.image.asset._ref
                                .replace("image-", "")
                                .replace("-jpg", ".jpg")
                                .replace("-png", ".png")
                                .replace("-webp", ".webp")}`}
                              alt={speaker.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-600 font-bold text-lg">
                              {speaker.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {speaker.name}
                          </h3>
                          {(speaker.title || speaker.company) && (
                            <p className="text-sm text-gray-600">
                              {speaker.title}
                              {speaker.title && speaker.company && " - "}
                              <span className="font-medium text-primary-700">
                                {speaker.company}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      {speaker.bio && (
                        <div className="mt-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                          <p className="italic">"{speaker.bio}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol registrasi */}
            {event.registrationLink && (
              <div className="mt-8 flex justify-center">
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="flex items-center gap-2 px-8 py-3">
                    <span>Daftar Sekarang</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tombol kembali */}
        <div className="mt-8 flex justify-center">
          <Link href="/acara">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-2 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali ke Daftar Acara</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}