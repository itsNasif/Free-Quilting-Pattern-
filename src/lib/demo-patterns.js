// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · bundled demo library
//
// Synthetic patterns that power the site until real Supabase rows and
// Cloudinary images are configured. Every entry is labeled demo and the
// preview images are hand-authored quilt-block studies, not real
// photographs. The admin replaces these with real patterns.
// ─────────────────────────────────────────────────────────────────────

const DAY = 1000 * 60 * 60 * 24;

const demoPatterns = [
  {
    id: "demo-001",
    slug: "cabin-in-the-pines",
    title: "Cabin in the Pines",
    description:
      "A classic Log Cabin block turned on point, framed in deep forest and midnight strips. The warm thread center makes it feel like a fire-lit window on a winter sewing night. Ends 54 in square, nine blocks, and takes beautifully to low-volume backgrounds.",
    category: "Lap Quilt",
    difficulty: "Beginner",
    finished_size: "54 × 54 in",
    pieces: "9 blocks · 81 strips",
    fabric: "Midnight, forest, linen, one gold thread square per block",
    file_url: "/patterns/demo/cabin-in-the-pines.pdf",
    image_url: "/patterns/cabin-in-the-pines.svg",
    download_count: 1284,
    featured: true,
    created_at: new Date("2026-02-14").toISOString(),
  },
  {
    id: "demo-002",
    slug: "nine-patch-morning",
    title: "Nine Patch Morning",
    description:
      "A soft take on the nine-patch, set in burgundy and cream with indigo pinwheels between the blocks. Quick, forgiving, and small — a perfect first quilt for a new little one. Backing is a single yard of linen.",
    category: "Baby Quilt",
    difficulty: "Beginner",
    finished_size: "36 × 36 in",
    pieces: "16 blocks · 144 patches",
    fabric: "Burgundy, cream, indigo, linen backing",
    file_url: "/patterns/demo/nine-patch-morning.pdf",
    image_url: "/patterns/nine-patch-morning.svg",
    download_count: 967,
    featured: false,
    created_at: new Date("2026-03-02").toISOString(),
  },
  {
    id: "demo-003",
    slug: "flying-geese-migration",
    title: "Flying Geese Migration",
    description:
      "A V-shaped flock of flying geese sweeping across a midnight field. Directional pressing makes the seams lie flat, and the gold thread row is the only curved line in the whole quilt.",
    category: "Bed Quilt",
    difficulty: "Intermediate",
    finished_size: "72 × 84 in",
    pieces: "48 geese · 12 stars",
    fabric: "Midnight, linen, thread, indigo",
    file_url: "/patterns/demo/flying-geese-migration.pdf",
    image_url: "/patterns/flying-geese-migration.svg",
    download_count: 741,
    featured: true,
    created_at: new Date("2026-01-20").toISOString(),
  },
  {
    id: "demo-004",
    slug: "drunkards-path-noon",
    title: "Drunkard's Path at Noon",
    description:
      "Quarter-circle curves in sunlit linen and deep indigo, arranged so the arcs read like noon shadows. The curved seams ask for a slow hand; the payoff is a surface that looks like it is still moving.",
    category: "Wall Hanging",
    difficulty: "Advanced",
    finished_size: "24 × 24 in",
    pieces: "16 blocks · 64 curves",
    fabric: "Linen, indigo, thread",
    file_url: "/patterns/demo/drunkards-path-noon.pdf",
    image_url: "/patterns/drunkards-path-noon.svg",
    download_count: 523,
    featured: false,
    created_at: new Date("2026-04-11").toISOString(),
  },
  {
    id: "demo-005",
    slug: "hourglass-tides",
    title: "Hourglass Tides",
    description:
      "Interlocking hourglass blocks in four tones that shift like tide lines across the lap. A beginner-friendly block with an advanced look, all straight seams and exact corners.",
    category: "Lap Quilt",
    difficulty: "Beginner",
    finished_size: "48 × 60 in",
    pieces: "30 blocks · 120 triangles",
    fabric: "Char, indigo, linen, forest",
    file_url: "/patterns/demo/hourglass-tides.pdf",
    image_url: "/patterns/hourglass-tides.svg",
    download_count: 689,
    featured: false,
    created_at: new Date("2026-02-28").toISOString(),
  },
  {
    id: "demo-006",
    slug: "amish-diamond-patch",
    title: "Amish Diamond Patch",
    description:
      "An on-point center diamond wrapped in border stripes, in the strict medallion tradition. No curves, no fuss — just fabric and honest seams. The narrow thread border is the whole personality.",
    category: "Bed Quilt",
    difficulty: "Intermediate",
    finished_size: "80 × 80 in",
    pieces: "1 medallion · 5 borders",
    fabric: "Midnight, burgundy, linen, thread",
    file_url: "/patterns/demo/amish-diamond-patch.pdf",
    image_url: "/patterns/amish-diamond-patch.svg",
    download_count: 1110,
    featured: true,
    created_at: new Date("2026-05-01").toISOString(),
  },
  {
    id: "demo-007",
    slug: "broken-dishes",
    title: "Broken Dishes",
    description:
      "A scrappy favorite — half-square triangles set so the two-color blocks look like dishes spinning in the sink. Great for using up the ends of bolts, and it presses beautifully.",
    category: "Table Topper",
    difficulty: "Intermediate",
    finished_size: "30 × 30 in",
    pieces: "25 blocks · 50 triangles",
    fabric: "Linen, burgundy, forest, thread",
    file_url: "/patterns/demo/broken-dishes.pdf",
    image_url: "/patterns/broken-dishes.svg",
    download_count: 448,
    featured: false,
    created_at: new Date("2026-03-19").toISOString(),
  },
  {
    id: "demo-008",
    slug: "sawtooth-star-evening",
    title: "Sawtooth Star, Evening",
    description:
      "A single big sawtooth star on a dark linen field, ringed by four small ones. Dramatic, symmetrical, and surprisingly simple — the points are flying geese in a wheel.",
    category: "Bed Quilt",
    difficulty: "Advanced",
    finished_size: "64 × 64 in",
    pieces: "5 stars · 80 points",
    fabric: "Linen, midnight, thread, forest",
    file_url: "/patterns/demo/sawtooth-star-evening.pdf",
    image_url: "/patterns/sawtooth-star-evening.svg",
    download_count: 856,
    featured: false,
    created_at: new Date("2026-01-05").toISOString(),
  },
];

export const DEMO_AGE = DAY;

export function getDemoPatterns() {
  return demoPatterns.map((p) => ({ ...p }));
}

export function getDemoPattern(slug) {
  return demoPatterns.find((p) => p.slug === slug) || null;
}
