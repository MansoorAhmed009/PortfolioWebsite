import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "Material Informatics",
    "Materials AI",
    "Computational Materials",
    "Machine Learning for Materials",
    "Materials Engineering Portfolio"
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Material Informatics Authority Website" }]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#070912",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans antialiased`}>
        <SiteShell>{children}</SiteShell>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}