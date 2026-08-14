# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are home quilters and crafters — hobbyists who search for free, printable quilting patterns, preview the finished quilt, and download the pattern (usually as a PDF) to sew it themselves. They browse on desktop and mobile, often arriving from search engines or Pinterest. Secondary user is the site owner (admin), who publishes and manages the pattern library.

## Product Purpose

QuiltHaven is a free quilting pattern download library. It makes finding and downloading a good quilting pattern fast and pleasant, and it monetizes through tasteful, non-intrusive advertising (Adstera). Success = visitors find a pattern they want, preview it, and complete the download without being annoyed by ads.

## Positioning

A clean, trustworthy pattern library where every pattern is free and the ad experience stays out of the way — the download is unlocked by viewing an ad, never interrupted by popups or clutter. The library itself (search, categories, quality previews) is the product.

## Operating Context

- Visitors: browse a pattern grid, filter by category/difficulty, open a pattern page, preview the quilt image, read the pattern details, and click Download.
- Download flow: an ad view (Adstera unit + short countdown) unlocks the direct file link. The ad step is a single clear modal, never a misleading popup.
- Admin: logs in with a passcode, adds/edits/deletes patterns, marks featured, and tracks download counts.
- Content lives in Supabase (pattern metadata + file storage for PDFs/images) and Cloudinary (pattern preview images). Ads served by Adstera.
- File formats: PDF pattern + preview images.

## Capabilities and Constraints

- Public site: homepage, browse/search/filter patterns, pattern detail page, download flow with ad unlock.
- Admin: passcode login, pattern CRUD, featured toggle, download counter.
- Supabase for data + file storage; Cloudinary for pattern images; Adstera for ads.
- Ads must be non-intrusive: fixed-size slots, lazy-loaded, labeled, no popups, capped per page, and the unlock modal must be skippable only after the ad impression completes.
- Env-driven: when Supabase/Cloudinary/Adstera credentials are absent, the site runs on bundled demo data so the design is fully visible before real assets are added.
- Seeded demo content is synthetic and labeled as such; the user replaces it with real patterns.

## Brand Commitments

- Name: QuiltHaven.
- Voice: warm, crafty, encouraging; a maker's space, not a shopfront.
- Everything else (visual world) is decided in DESIGN.md via new-work.

## Evidence on Hand

- No real patterns, assets, or Supabase/Cloudinary/Adstera credentials yet. Demo content will be authored as synthetic placeholders; the user replaces them with real files.

## Product Principles

- The pattern is the hero; ads are furniture, never walls.
- A free pattern download should feel effortless and trustworthy.
- The download unlock must be honest: one clear ad view, then the file.
- The admin should make publishing a new pattern a two-minute task.
- The design must feel like the craft: warm, precise, made with care.

## Accessibility & Inclusion

- Download flow must remain keyboard-accessible; the unlock modal focuses correctly and restores focus on close.
- Contrast and tap targets sized for desktop and mobile users, including older crafters.
