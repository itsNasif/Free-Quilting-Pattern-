"use client";

// A single, labeled, fixed-size advertising slot. Ads are "furniture,
// never walls": every unit renders inside a seam frame with an explicit
// "Ad" tag, loads lazily, and never exceeds its box.
//
// When the Adstera loader URL and a zone id are configured the Adstera
// script is injected once and the unit mounts into this frame. Without
// them the frame shows a quiet placeholder so the page layout is fully
// visible before real ad tags are added.
//
// To wire your real Adstera account: set NEXT_PUBLIC_ADSTERA_SCRIPT_URL
// and the matching NEXT_PUBLIC_ADSTERA_*_ID, then adjust `mountUnit`
// below to the exact markup your Adstera loader expects.

import { useEffect, useId, useRef } from "react";

const SIZES = {
  leaderboard: { w: 728, h: 90 },
  infeed: { w: null, h: 250 },
  download: { w: 320, h: 250 },
  sidebar: { w: 300, h: 250 },
};

const ZONE_ENV = {
  leaderboard: "NEXT_PUBLIC_ADSTERA_LEADERBOARD_ID",
  infeed: "NEXT_PUBLIC_ADSTERA_INFEED_ID",
  download: "NEXT_PUBLIC_ADSTERA_DOWNLOAD_ID",
};

const scriptUrl = process.env.NEXT_PUBLIC_ADSTERA_SCRIPT_URL || "";

function hasRealAd(variant) {
  if (!scriptUrl) return false;
  const zone = process.env[ZONE_ENV[variant]];
  return Boolean(zone);
}

/** Inject the Adstera loader exactly once. */
function ensureLoader() {
  if (!scriptUrl) return;
  const id = "adstera-loader";
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = scriptUrl;
  s.async = true;
  document.head.appendChild(s);
}

export default function AdSlot({ variant = "infeed", dark = false, className = "" }) {
  const boxRef = useRef(null);
  const uid = useId().replace(/:/g, "");
  const size = SIZES[variant];
  const realAd = hasRealAd(variant);

  useEffect(() => {
    if (!realAd || !boxRef.current) return;
    ensureLoader();
    // Mount the Adstera unit into the frame. Adjust to your loader's markup.
    const zone = process.env[ZONE_ENV[variant]];
    const holder = document.createElement("div");
    holder.setAttribute("data-adstera-zone", zone);
    holder.setAttribute("class", "adstera-unit");
    holder.style.width = "100%";
    holder.style.minHeight = `${size.h}px`;
    boxRef.current.appendChild(holder);
    return () => {
      if (holder.parentNode) holder.parentNode.removeChild(holder);
    };
  }, [realAd, variant, size.h]);

  const frame = dark ? "ad-frame ad-frame-dark" : "ad-frame";

  return (
    <aside
      className={`${frame} ${className}`}
      style={size.w ? { width: "100%", maxWidth: size.w, minHeight: size.h } : { minHeight: size.h }}
      aria-label="Advertisement"
    >
      <span
        className={`measure-label pointer-events-none absolute right-2 top-1.5 z-10 text-[0.58rem] ${
          dark ? "text-cream-dim/80" : "text-ink-soft/80"
        }`}
      >
        Ad
      </span>
      <div ref={boxRef} className="flex h-full w-full items-center justify-center">
        {!realAd && (
          <p
            className={`measure-label max-w-[26ch] text-center leading-relaxed ${
              dark ? "text-cream-dim/70" : "text-ink-soft/70"
            }`}
          >
            Advertisement · your Adstera unit renders here
          </p>
        )}
      </div>
    </aside>
  );
}
