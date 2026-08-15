"use client";

/**
 * AdsterraSlot — Direct export & alias for AdSlot
 * Supports all Adsterra ad formats for QuiltHaven.
 */

import AdSlot from "./AdSlot";

export default function AdsterraSlot(props) {
  return <AdSlot {...props} />;
}

export function AdsterraPopunder() {
  return null;
}