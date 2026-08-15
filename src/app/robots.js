export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/_next/"],
      },
    ],
    sitemap: "https://quilthaven.vercel.app/sitemap.xml",
    host: "https://quilthaven.vercel.app",
  };
}
