import { ReactNode } from "react";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { getNewsBySlugQuery } from "@/sanity/queries/newsQueries";
import { type SanityDocument } from "next-sanity";

type Props = {
  params: Promise<{ slug: string }>;
  children: ReactNode;
};

const options = { next: { revalidate: 300 } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const news = await client.fetch<SanityDocument>(
      getNewsBySlugQuery,
      { slug },
      options
    );

    if (!news) {
      return {
        title: "Berita Tidak Ditemukan | Portal Alumni SMK Telkom Jakarta",
        description: "Berita yang Anda cari tidak ditemukan.",
      };
    }

    const description =
      news.excerpt || `Berita terbaru dari SMK Telkom Jakarta: ${news.title}`;
    const imageUrl = news.mainImageUrl || "/berita-hero.jpg";

    return {
      title: `${news.title} | Portal Alumni SMK Telkom Jakarta`,
      description: description,
      openGraph: {
        title: `${news.title} | Portal Alumni SMK Telkom Jakarta`,
        description: description,
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ],
        publishedTime: news.publishedAt,
        authors: news.authorName ? [news.authorName] : undefined,
        tags: news.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: `${news.title} | Portal Alumni SMK Telkom Jakarta`,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/berita/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error fetching news metadata:", error);
    return {
      title: "Berita | Portal Alumni SMK Telkom Jakarta",
      description: "Berita SMK Telkom Jakarta",
    };
  }
}

export const revalidate = 300;

export default function BeritaSlugLayout({ children }: Props) {
  return <>{children}</>;
}
