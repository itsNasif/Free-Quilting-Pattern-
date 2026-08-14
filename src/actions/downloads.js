"use server";

// Fired once the ad-view countdown in the download modal completes.

import { incrementDownloadCount } from "@/lib/patterns";

export async function recordDownload(id) {
  if (!id) return { ok: false, count: 0 };
  const count = await incrementDownloadCount(id);
  return { ok: true, count };
}
