import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getGalleryBySlug, getAllGalleries } from "@/sanity/services/gallery";
import { urlFor } from "@/sanity/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

// Configure ISR with 30-second revalidation as fallback
export const revalidate = 30;

export async function generateStaticParams() {
  const galleries = await getAllGalleries();
  return galleries.map((gallery) => ({
    slug: gallery.slug.current,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    return {
      title: "Galeri Not Found",
    };
  }

  return {
    title: `${gallery.title} - Galeri SMK Telkom Jakarta`,
    description:
      gallery.description || `Galeri ${gallery.title} SMK Telkom Jakarta`,
    openGraph: {
      title: `${gallery.title} - Galeri SMK Telkom Jakarta`,
      description:
        gallery.description || `Galeri ${gallery.title} SMK Telkom Jakarta`,
      type: "article",
      images:
        gallery.images.length > 0
          ? [
              {
                url:
                  urlFor(gallery.images[0].image.asset)
                    ?.width(1200)
                    .quality(85)
                    .url() || "/galeri-hero.jpg",
                width: 1200,
                height: 630,
                alt: gallery.images[0].alt || gallery.title,
              },
            ]
          : [
              {
                url: "/galeri-hero.jpg",
                width: 1200,
                height: 630,
                alt: gallery.title,
              },
            ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${gallery.title} - Galeri SMK Telkom Jakarta`,
      description:
        gallery.description || `Galeri ${gallery.title} SMK Telkom Jakarta`,
      images:
        gallery.images.length > 0
          ? [
              urlFor(gallery.images[0].image.asset)
                ?.width(1200)
                .quality(85)
                .url() || "/galeri-hero.jpg",
            ]
          : ["/galeri-hero.jpg"],
    },
    alternates: {
      canonical: `/galeri/${slug}`,
    },
  };
}

export default async function GaleriDetailPage({ params }: Props) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/galeri"
            className="inline-flex items-center text-primary hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Galeri
          </Link>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {gallery.title}
            </h1>

            {gallery.description && (
              <p className="text-lg text-gray-600 mb-4">
                {gallery.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Dipublikasikan: {formatDate(gallery.publishedAt)}</span>
              {gallery.category && (
                <span>
                  Kategori: {gallery.category.replace("-", " ").toUpperCase()}
                </span>
              )}
              <span>{gallery.images.length} Foto</span>
            </div>
          </div>
        </div>
      </section>

      {/* Images Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {gallery.images.map((img, index) => (
              <div key={index} className="break-inside-avoid mb-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={
                      urlFor(img.image.asset)?.width(600).quality(85).url() ||
                      ""
                    }
                    alt={img.alt}
                    width={600}
                    height={
                      (600 * img.image.asset.metadata.dimensions.height) /
                      img.image.asset.metadata.dimensions.width
                    }
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {img.caption && (
                    <div className="p-4">
                      <p className="text-sm text-gray-600">{img.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
