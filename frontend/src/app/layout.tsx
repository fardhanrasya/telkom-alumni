import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";
import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("home");
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://telkom-alumni.vercel.app'),
    title: meta?.title || "Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Selamat datang di portal alumni SMK Telkom Jakarta.",
    openGraph: {
      title: meta?.ogTitle || meta?.title,
      description: meta?.ogDescription || meta?.description,
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/home-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Portal Alumni SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitterTitle || meta?.title,
      description: meta?.twitterDescription || meta?.description,
      images: [meta?.twitterImage || "/home-hero.jpg"],
    },
    keywords: meta?.keywords || [],
    alternates: {
      canonical: "/",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
