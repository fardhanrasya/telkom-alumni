import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lowongan Kerja | Portal Alumni SMK Telkom Jakarta",
  description:
    "Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner SMK Telkom Jakarta.",
  openGraph: {
    title: "Lowongan Kerja | Portal Alumni SMK Telkom Jakarta",
    description:
      "Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner SMK Telkom Jakarta.",
    type: "website",
    images: [
      {
        url: "/karir-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Lowongan Kerja SMK Telkom Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lowongan Kerja | Portal Alumni SMK Telkom Jakarta",
    description:
      "Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner SMK Telkom Jakarta.",
    images: ["/karir-hero.jpg"],
  },
};

export default function KarirLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
