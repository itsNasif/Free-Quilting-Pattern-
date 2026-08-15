import { getPatterns } from "@/lib/patterns";

const SITE_URL = "https://quilthaven.vercel.app";

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/patterns`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamic pattern pages
  let patternPages = [];
  try {
    const { items } = await getPatterns({ limit: 1000 });
    patternPages = items.map((p) => ({
      url: `${SITE_URL}/patterns/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // Silently skip if DB unavailable during build
  }

  return [...staticPages, ...patternPages];
}
