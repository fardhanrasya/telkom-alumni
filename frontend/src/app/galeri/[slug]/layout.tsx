import { ReactNode } from "react";
import { Metadata } from "next";
import { getGalleryBySlug } from "@/sanity/services/gallery";
import { urlFor } from "@/sanity/utils";

type Props = {
  params: Promise<{ slug: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const gallery = await getGalleryBySlug(slug);

    if (!gallery) {
      return {
        title: "Galeri Tidak Ditemukan | Portal Alumni SMK Telkom Jakarta",
        description: "Galeri yang Anda cari tidak ditemukan.",
      };
    }

    const imageUrl =
      gallery.images.length > 0
        ? urlFor(gallery.images[0].image.asset)
            ?.width(1200)
            .quality(85)
            .url() || "/galeri-hero.jpg"
        : "/galeri-hero.jpg";

    return {
      title: `${gallery.title} | Galeri Portal Alumni SMK Telkom Jakarta`,
      description:
        gallery.description || `Galeri ${gallery.title} SMK Telkom Jakarta`,
      openGraph: {
        title: `${gallery.title} | Galeri Portal Alumni SMK Telkom Jakarta`,
        description:
          gallery.description || `Galeri ${gallery.title} SMK Telkom Jakarta`,
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: gallery.images[0]?.alt || gallery.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${gallery.title} | Galeri Portal Alumni SMK Telkom Jakarta`,
        description:
          gallery.description || `Galeri ${gallery.title} SMK Telkom Jakarta`,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/galeri/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error fetching gallery metadata:", error);
    return {
      title: "Galeri | Portal Alumni SMK Telkom Jakarta",
      description: "Galeri SMK Telkom Jakarta",
    };
  }
}

export const revalidate = 300;

export default function GaleriSlugLayout({ children }: Props) {
  return <>{children}</>;
}
