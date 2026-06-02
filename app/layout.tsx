import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Wheelz",
  title: {
    default: "Wheelz - Used Car Comparison",
    template: "%s | Wheelz"
  },
  description:
    "Compare used cars by value score, market price, mileage, ownership, service history, and seller trust signals.",
  keywords: [
    "used cars",
    "car comparison",
    "used car deals",
    "value score",
    "car marketplace",
    "second hand cars"
  ],
  authors: [{ name: "Wheelz" }],
  creator: "Wheelz",
  publisher: "Wheelz",
  category: "Automotive",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Wheelz",
    title: "Wheelz - Used Car Comparison",
    description:
      "Search, compare, save, and score used-car listings with a premium value-for-money experience.",
    images: [
      {
        url: "/images/hero-cars.svg",
        width: 1200,
        height: 630,
        alt: "Wheelz used-car comparison interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheelz - Used Car Comparison",
    description: "Compare used-car listings by value score, market price, mileage, ownership, and trust signals.",
    images: ["/images/hero-cars.svg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
