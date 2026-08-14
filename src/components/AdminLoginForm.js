"use client";

import { useActionState } from "react";
import { login } from "@/actions/admin";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <form action={formAction} className="mt-6 w-full max-w-sm">
      <label className="field-label" htmlFor="admin-passcode">
        Workshop passcode
      </label>
      <input
        id="admin-passcode"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        className="field"
        placeholder="••••••••"
      />
      {state?.error && (
        <p className="mt-2 text-sm font-medium text-burgundy" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-gold mt-4 w-full">
        {pending ? "Checking…" : "Open the workshop"}
      </button>
    </form>
  );
}
