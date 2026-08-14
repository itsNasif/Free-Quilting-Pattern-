import Image from "next/image";

// Renders a pattern preview inside a sized (position: relative) parent.
// Demo previews are square SVGs and render as plain <img>; real Cloudinary
// photos go through next/image for optimization. SVGs bypass the optimizer
// to avoid needing dangerouslyAllowSVG.

export default function PatternImage({ src, alt, sizes = "50vw", priority = false }) {
  if (!src) {
    return <div className="h-full w-full bg-linen-deep" aria-hidden="true" />;
  }
  if (typeof src === "string" && src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={640}
        height={640}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
  );
}
