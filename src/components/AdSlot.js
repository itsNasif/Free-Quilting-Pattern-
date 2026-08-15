"use client";

/**
 * AdSlot — Adsterra Advertising Unit for QuiltHaven.
 * Renders verified Adsterra ad formats (728x90 Leaderboard, Native Banner, Smartlink)
 * within a labeled, responsive seam frame.
 */

import { useId } from "react";

const BANNER_728X90_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728X90_ID ||
  "d271bc5ea80da947787f13dde8a02f77";

const NATIVE_BANNER_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_ID ||
  "c6d3de3e1b3bcdb420e24ca97ecfcb30";

const SMARTLINK_URL =
  process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL ||
  `https://spongeascend.com/zmrzjg6yv7?key=${
    process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_ID || "ad3ba3d1a22637f2aceb6a1848b3a7bc"
  }`;

export default function AdSlot({
  variant = "infeed",
  dark = false,
  className = "",
}) {
  const isLeaderboard = variant === "leaderboard" || variant === "banner728x90";
  const isSmartlink = variant === "smartlink";
  const isNative = variant === "infeed" || variant === "nativeBanner" || variant === "download";

  if (isSmartlink) {
    return (
      <a
        href={SMARTLINK_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`measure-label inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-thread/30 bg-linen-light hover:bg-linen-deep/50 transition-colors ${
          dark
            ? "text-thread-light border-thread/50 bg-char"
            : "text-ink-soft"
        } ${className}`}
        aria-label="Sponsored Link"
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Sponsored Partner
      </a>
    );
  }

  const frame = dark ? "ad-frame ad-frame-dark" : "ad-frame";

  if (isLeaderboard) {
    const bannerDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <base target="_blank">
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${BANNER_728X90_KEY}',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://spongeascend.com/${BANNER_728X90_KEY}/invoke.js"></script>
  </body>
</html>`;

    return (
      <aside
        className={`${frame} ${className} overflow-hidden w-full flex flex-col items-center justify-center`}
        style={{ maxWidth: "728px", minHeight: "90px" }}
        aria-label="Advertisement"
      >
        <span
          className={`measure-label pointer-events-none absolute right-2 top-1.5 z-10 text-[0.58rem] ${
            dark ? "text-cream-dim/80" : "text-ink-soft/80"
          }`}
        >
          Ad
        </span>
        <div className="w-full flex items-center justify-center overflow-x-auto">
          <iframe
            title="Adsterra 728x90 Banner"
            srcDoc={bannerDoc}
            width="728"
            height="90"
            style={{ border: "none", width: "728px", height: "90px", overflow: "hidden" }}
            loading="lazy"
          />
        </div>
      </aside>
    );
  }

  // Native banner (infeed, download, or general banner)
  const nativeDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <base target="_blank">
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        min-height: 100%;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #container-${NATIVE_BANNER_KEY} {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <script async="async" data-cfasync="false" src="https://spongeascend.com/${NATIVE_BANNER_KEY}/invoke.js"></script>
    <div id="container-${NATIVE_BANNER_KEY}"></div>
  </body>
</html>`;

  const minHeight = variant === "download" ? 200 : 250;

  return (
    <aside
      className={`${frame} ${className} overflow-hidden w-full`}
      style={{ minHeight: `${minHeight}px` }}
      aria-label="Advertisement"
    >
      <span
        className={`measure-label pointer-events-none absolute right-2 top-1.5 z-10 text-[0.58rem] ${
          dark ? "text-cream-dim/80" : "text-ink-soft/80"
        }`}
      >
        Ad
      </span>
      <div className="flex h-full w-full items-center justify-center">
        <iframe
          title="Adsterra Native Banner"
          srcDoc={nativeDoc}
          width="100%"
          height={minHeight}
          style={{ border: "none", width: "100%", minHeight: `${minHeight}px`, overflow: "hidden" }}
          loading="lazy"
        />
      </div>
    </aside>
  );
}
