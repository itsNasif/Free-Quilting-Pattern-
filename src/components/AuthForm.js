"use client";

import { useState, useActionState, useTransition } from "react";
import Link from "next/link";
import { signInUser, signUpUser } from "@/actions/auth";

export default function AuthForm({ initialMode = "signin", returnTo = "/profile" }) {
  const [mode, setMode] = useState(initialMode); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);

  const [signInState, signInAction, isSignInPending] = useActionState(signInUser, {});
  const [signUpState, signUpAction, isSignUpPending] = useSignUpAction();

  function useSignUpAction() {
    return useActionState(signUpUser, {});
  }

  const isPending = mode === "signin" ? isSignInPending : isSignUpPending;
  const currentError = mode === "signin" ? signInState?.error : signUpState?.error;
  const isSuccess = mode === "signup" && signUpState?.success;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-md border border-ink/15 bg-linen-light shadow-[var(--shadow-lift)]">
      {/* Header Tabs */}
      <div className="flex border-b border-ink/10 bg-linen/60">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 py-3.5 text-center text-sm font-medium transition-colors ${
            mode === "signin"
              ? "border-b-2 border-thread bg-linen-light font-semibold text-ink"
              : "text-ink-soft hover:text-ink hover:bg-linen/40"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 py-3.5 text-center text-sm font-medium transition-colors ${
            mode === "signup"
              ? "border-b-2 border-thread bg-linen-light font-semibold text-ink"
              : "text-ink-soft hover:text-ink hover:bg-linen/40"
          }`}
        >
          Join QuiltHaven (Register)
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* Intro */}
        <div className="mb-6 text-center">
          <span className="measure-label text-thread-deep">
            {mode === "signin" ? "Welcome Back" : "Quilter Community"}
          </span>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            {mode === "signin" ? "Sign in to your account" : "Create your Quilter account"}
          </h2>
          <p className="mt-1.5 text-xs text-ink-soft">
            {mode === "signin"
              ? "Access your saved patterns, craft notes, and quilter profile."
              : "New quilters get instant access to free patterns and their personal profile."}
          </p>
        </div>

        {/* Error Alert */}
        {currentError && (
          <div
            className="mb-5 rounded border border-burgundy/40 bg-burgundy/10 p-3.5 text-xs font-medium text-burgundy"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm leading-none">⚠️</span>
              <span>{currentError}</span>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div
            className="mb-5 rounded border border-forest/40 bg-forest/10 p-3.5 text-xs font-medium text-forest"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm leading-none">✨</span>
              <span>{signUpState.message}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form action={mode === "signin" ? signInAction : signUpAction} className="space-y-4">
          <input type="hidden" name="return_to" value={returnTo} />

          {mode === "signup" && (
            <div>
              <label className="field-label" htmlFor="f-display-name">
                Your Quilter Name / Display Name
              </label>
              <input
                id="f-display-name"
                name="display_name"
                type="text"
                placeholder="e.g. Clara Wood, NeedleCrafter"
                className="field"
              />
            </div>
          )}

          <div>
            <label className="field-label" htmlFor="f-email">
              Email Address <span className="text-burgundy">*</span>
            </label>
            <input
              id="f-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="field"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="field-label" htmlFor="f-password">
                Password <span className="text-burgundy">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="measure-label text-[0.65rem] text-thread-deep hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <input
                id="f-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                placeholder="••••••••"
                className="field"
              />
            </div>
            {mode === "signup" && (
              <p className="mt-1 text-[0.7rem] text-ink-soft">
                At least 6 characters. You will automatically receive the <span className="font-mono text-thread-deep font-medium">user</span> role.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-gold w-full mt-2"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-char border-t-transparent" />
                {mode === "signin" ? "Signing In…" : "Creating Account…"}
              </span>
            ) : mode === "signin" ? (
              "Sign In to QuiltHaven"
            ) : (
              "Create My Quilter Account"
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 border-t border-ink/10 pt-4 text-center">
          {mode === "signin" ? (
            <p className="text-xs text-ink-soft">
              Don’t have an account yet?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-thread-deep underline hover:text-ink"
              >
                Join for free
              </button>
            </p>
          ) : (
            <p className="text-xs text-ink-soft">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-semibold text-thread-deep underline hover:text-ink"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
