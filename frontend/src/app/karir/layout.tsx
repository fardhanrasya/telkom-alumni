import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lowongan Kerja | Portal Alumni SMK Telkom Jakarta",
  description: "Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner. Dapatkan pekerjaan impian Anda di sini.",
  openGraph: {
    title: "Lowongan Kerja | Portal Alumni SMK Telkom Jakarta",
    description: "Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner.",
    type: "website",
    images: [
      {
        url: "/karir-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Lowongan Kerja Alumni SMK Telkom Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lowongan Kerja Alumni SMK Telkom Jakarta",
    description: "Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner.",
    images: ["/karir-hero.jpg"],
  },
  alternates: {
    canonical: "/karir",
  },
};

export default function KarirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}