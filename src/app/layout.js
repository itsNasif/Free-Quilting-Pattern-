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

export const metadata = {
  title: {
    default: "QuiltHaven — Free Quilting Patterns",
    template: "%s · QuiltHaven",
  },
  description:
    "Free, printable quilting patterns from a hand-sewn library. Preview the finished quilt, read the cutting numbers, and take the pattern home.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "QuiltHaven",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrument.variable} ${spaceMono.variable}`}
    >
      <body suppressHydrationWarning>
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
