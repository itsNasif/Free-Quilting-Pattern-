import { Fraunces, Instrument_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdsterraGlobal from "@/components/AdsterraGlobal";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const SITE_URL = "https://quilthaven.vercel.app";

export const metadata = {
  // ── Titles ────────────────────────────────────────────────────────
  title: {
    default: "QuiltHaven — Free Quilting Patterns to Download",
    template: "%s · QuiltHaven",
  },

  // ── Description ───────────────────────────────────────────────────
  description:
    "Browse QuiltHaven's free, printable quilting pattern library. Download beginner to advanced quilt patterns — lap quilts, baby quilts, bed quilts, and wall hangings — no sign-up required.",

  // ── Canonical & base ──────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // ── Keywords ──────────────────────────────────────────────────────
  keywords: [
    "free quilting patterns",
    "free quilt patterns download",
    "printable quilt patterns",
    "quilting patterns PDF",
    "beginner quilt patterns",
    "easy quilt patterns",
    "lap quilt patterns",
    "baby quilt patterns",
    "bed quilt patterns",
    "wall hanging quilt patterns",
    "modern quilt patterns",
    "traditional quilt patterns",
    "Amish quilt patterns",
    "patchwork quilt patterns",
    "free sewing patterns quilts",
    "quilt block patterns",
    "quilting for beginners",
    "free quilting downloads",
    "QuiltHaven",
    "quilthaven.vercel.app",
  ],

  // ── Robots ────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // ── Google Search Console verification ───────────────────────────
  verification: {
    google: "_UpXCtDL5XeS1ehPHiJbbOMwKzjYCgsDGQvRrGBh7aU",
  },

  // ── Open Graph ────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    siteName: "QuiltHaven",
    url: SITE_URL,
    title: "QuiltHaven — Free Quilting Patterns to Download",
    description:
      "Browse QuiltHaven's free, printable quilting pattern library. Download beginner to advanced quilt patterns — no sign-up required.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "QuiltHaven — Free Quilting Patterns",
      },
    ],
    locale: "en_US",
  },

  // ── Twitter / X Card ──────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "QuiltHaven — Free Quilting Patterns to Download",
    description:
      "Browse QuiltHaven's free, printable quilting pattern library. Download beginner to advanced quilt patterns — no sign-up required.",
    images: [`${SITE_URL}/og-image.png`],
    site: "@quilthaven",
  },

  // ── Author / Category ─────────────────────────────────────────────
  authors: [{ name: "QuiltHaven", url: SITE_URL }],
  category: "Crafts & Hobbies",
  creator: "QuiltHaven",
  publisher: "QuiltHaven",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "QuiltHaven",
    url: SITE_URL,
    description:
      "Free, printable quilting patterns. Preview the finished quilt, read the cutting numbers, and take the pattern home — no sign-up required.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/patterns?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrument.variable} ${spaceMono.variable}`}
    >
      <body suppressHydrationWarning>
        {/* JSON-LD structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AdsterraGlobal />
        {/*
          THESIS: QuiltHaven is a free quilting-pattern library built like a
          hand-sewn Amish medallion quilt — bold solid color fields, strict
          geometry, dense hand-stitch texture. It refuses the pastel "craft
          shop" default by making the library itself the heirloom: dark, warm,
          precise, with ads as quiet furniture that never block the download.
          OWN-WORLD: deep midnight indigo, burgundy, forest green and black
          fabric fields on a warm undyed-linen ground; a single gold thread
          accent; Fraunces display, Instrument Sans body, Space Mono
          measurement labels; stitch dashes and seam hairlines instead of
          borders; soft elevation carried by shadow with real offset.
          STORY: a quilter arrives, sees a wall of bold blocks, opens a pattern
          like turning over a quilt, reads its numbers, and takes the file home
          after one honest ad moment.
          FIRST VIEWPORT: a dark medallion of featured pattern blocks on linen,
          the wordmark monumental in Fraunces, a gold-thread Download path, and
          a quiet labeled ad slot tucked below the fold seam.
          FORM: Amish Quilt Heritage — candidate 6 of the grounded list, seed
          key quilthaven.
          FINISH: unreviewed and undocumented is unfinished; this build ends
          with the finish review, the verdict, and DESIGN.md
        */}
        <div className="flex min-h-screen flex-col bg-linen-light text-ink">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
