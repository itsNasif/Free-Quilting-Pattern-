"use client";

import Script from "next/script";

/**
 * Adsterra Global Scripts (Popunder & Social Bar)
 * These scripts are loaded site-wide asynchronously without blocking page rendering.
 */
export default function AdsterraGlobal() {
  const popunderKey =
    process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_ID ||
    "cbcceda9d4382ce4e1b0946735a4e984";
  const socialBarKey =
    process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ID ||
    "1cc3b1ea0866be84b9d2e18be1c082b2";

  return (
    <>
      {/* Popunder script */}
      {popunderKey && (
        <Script
          id="adsterra-popunder"
          src={`https://spongeascend.com/cb/cc/ed/${popunderKey}.js`}
          strategy="afterInteractive"
        />
      )}

      {/* Social Bar script */}
      {socialBarKey && (
        <Script
          id="adsterra-socialbar"
          src={`https://spongeascend.com/1c/c3/b1/${socialBarKey}.js`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
