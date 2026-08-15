// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · PatternImage
//
// Renders a pattern thumbnail inside a sized (position:relative) parent.
//
// Routing logic:
//  • No src            → linen placeholder
//  • Local .svg        → plain <img> (no optimizer; avoids dangerouslyAllowSVG)
//  • External URL      → plain <img> with loading="lazy" so it always renders
//                        without going through the Next.js image proxy pipeline.
//                        (Supabase Storage & Cloudinary already serve optimised
//                        WebP/AVIF — running them through /_next/image again adds
//                        latency without benefit and can silently fail when the
//                        optimizer quota or cache isn't warm.)
// ─────────────────────────────────────────────────────────────────────

export default function PatternImage({
  src,
  alt = "",
  sizes,          // accepted but unused – kept for drop-in compatibility
  priority = false,
}) {
  if (!src) {
    return <div className="h-full w-full bg-linen-deep" aria-hidden="true" />;
  }

  // All image URLs (local SVGs, Supabase Storage, Cloudinary) are rendered
  // via a standard <img> tag so the browser fetches them directly.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}
