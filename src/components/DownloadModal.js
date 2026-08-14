"use client";

// The honest download moment. One clear modal: a labeled ad unit plus a
// short countdown unlocks the direct file link. You may close the modal at
// any time, but the file only appears after the ad impression completes.
// Keyboard-accessible: opens with focus in the dialog, Esc closes, focus
// returns to the trigger.

import { useCallback, useEffect, useRef, useState } from "react";
import AdSlot from "./AdSlot";
import { recordDownload } from "@/actions/downloads";

const COUNTDOWN_SECONDS = 5;

export default function DownloadModal({ pattern, downloadUrl, initialCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [unlocked, setUnlocked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const openModal = useCallback(() => {
    setOpen(true);
    setSecondsLeft(COUNTDOWN_SECONDS);
    setUnlocked(false);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Countdown drives the unlock.
  useEffect(() => {
    if (!open || unlocked) return;
    if (secondsLeft <= 0) {
      setUnlocked(true);
      recordDownload(pattern.id).then((res) => {
        if (res?.ok && typeof res.count === "number") setCount(res.count);
      });
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [open, secondsLeft, unlocked, pattern.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  if (!downloadUrl) {
    return (
      <p className="text-sm text-ink-soft">
        The pattern file is not uploaded yet — check back soon.
      </p>
    );
  }

  const progress = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100;

  return (
    <>
      <button type="button" ref={triggerRef} onClick={openModal} className="btn btn-gold">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M4 19h16" />
        </svg>
        Download pattern
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-char/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          onClick={closeModal}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-md border border-thread-deep/40 bg-linen-light p-6 shadow-[var(--shadow-lift)] outline-none sm:rounded-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="measure-label text-thread-deep">QuiltHaven download</p>
                <h2 id="download-title" className="mt-1 font-display text-2xl font-semibold text-ink">
                  {pattern.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close download dialog"
                className="rounded-sm border border-ink/20 px-2 py-1 text-sm text-ink-soft transition-colors hover:border-thread hover:text-thread-deep"
              >
                Esc ✕
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-ink-soft">
              {unlocked
                ? "Your pattern is ready. Thank you for supporting a free library."
                : "Your download unlocks in a moment — the ad keeps this pattern free."}
            </p>

            <div className="mt-4">
              <AdSlot variant="download" />
            </div>

            {/* Countdown seam */}
            {!unlocked ? (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="measure-label text-ink-soft">Unlocking</span>
                  <span className="measure-label text-thread-deep">{secondsLeft}s</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-linen-deep">
                  <div
                    className="h-full rounded-full bg-thread transition-[width] duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={downloadUrl}
                  download
                  className="btn btn-gold w-full"
                  onClick={() => recordDownload(pattern.id)}
                >
                  Take the file home
                </a>
                <p className="measure-label text-center text-ink-soft">
                  {count > 0 ? `${count.toLocaleString()} downloads so far` : "Enjoy your sewing"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
