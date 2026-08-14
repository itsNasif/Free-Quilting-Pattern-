// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · admin passcode auth
//
// A deliberately small, dependency-free session. The passcode never goes
// into the cookie; instead the cookie carries a constant value signed with
// an HMAC keyed by ADMIN_PASSWORD. Change ADMIN_PASSWORD and every old
// session stops verifying.
// ─────────────────────────────────────────────────────────────────────

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "quilthaven_admin";

const CLAIM = "quilthaven-admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "quilthaven-change-me";
}

export function issueToken() {
  const sig = createHmac("sha256", secret()).update(CLAIM).digest("base64url");
  return `${CLAIM}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return false;
  const [value, sig] = token.split(".");
  if (value !== CLAIM || !sig) return false;
  const expected = createHmac("sha256", secret())
    .update(CLAIM)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Reads the admin cookie and returns true when the session is valid. */
export async function isAdmin() {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}
