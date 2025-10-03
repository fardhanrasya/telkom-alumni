import { ReactNode } from "react";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { getEventBySlugQuery } from "@/sanity/queries/eventQueries";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
  children: ReactNode;
};

const options = { next: { revalidate: 300 } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const event = await client.fetch(getEventBySlugQuery, { slug }, options);

    if (!event) {
      return {
        title: "Acara Tidak Ditemukan | Portal Alumni SMK Telkom Jakarta",
        description: "Acara yang Anda cari tidak ditemukan.",
      };
    }

    // Ekstrak deskripsi dari portable text atau gunakan string langsung
    let description = "";
    if (typeof event.description === "string") {
      description = event.description.substring(0, 155);
    } else if (
      Array.isArray(event.description) &&
      event.description.length > 0
    ) {
      description = event.description
        .filter((block: any) => block._type === "block" && block.children)
        .map((block: any) =>
          block.children
            .filter((child: any) => child._type === "span" && child.text)
            .map((child: any) => child.text)
            .join("")
        )
        .join(" ")
        .substring(0, 155);
    }

    const eventDate = formatDate(event.startDate);
    const eventLocation =
      typeof event.location === "object" && event.location
        ? event.location.name
        : event.location;

    return {
      title: `${event.title} | Portal Alumni SMK Telkom Jakarta`,
      description:
        description ||
        `Acara ${event.title} pada ${eventDate} di ${eventLocation}`,
      openGraph: {
        title: `${event.title} | Portal Alumni SMK Telkom Jakarta`,
        description:
          description ||
          `Acara ${event.title} pada ${eventDate} di ${eventLocation}`,
        type: "article",
        images: [
          {
            url: event.imageUrl || "/acara-hero.jpg",
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${event.title} | Portal Alumni SMK Telkom Jakarta`,
        description: description || `Acara ${event.title} pada ${eventDate}`,
        images: [event.imageUrl || "/acara-hero.jpg"],
      },
      alternates: {
        canonical: `/acara/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error fetching event metadata:", error);
    return {
      title: "Acara | Portal Alumni SMK Telkom Jakarta",
      description: "Acara SMK Telkom Jakarta",
    };
  }
}

export const revalidate = 300;

export default function AcaraSlugLayout({ children }: Props) {
  return <>{children}</>;
}
