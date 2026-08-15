import { redirect } from "next/navigation";
import Link from "next/link";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminDashboard from "@/components/AdminDashboard";
import { isAdmin, getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { listAllPatterns } from "@/lib/patterns";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata = {
  title: "Pattern Workshop · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authorized = await isAdmin();
  const demoMode = !isSupabaseConfigured();
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;

  if (!authorized) {
    // Anyone with role 'user' (normal quilter) navigating to /admin is automatically redirected to the homepage
    if (user && (!profile || profile.role !== "admin")) {
      redirect("/");
    }

    // Guest / Unauthenticated visitor without admin access
    return (
      <section className="bg-linen-light min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="measure-label text-thread-deep">Admin · pattern workshop</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
            The door is sewn shut
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            Publishing and editing the library is reserved for administrators.
            Enter the workshop passcode from your <code className="rounded bg-black/[.06] px-1 py-0.5 font-mono text-[0.85em]">ADMIN_PASSWORD</code> env var or sign in with an admin account.
          </p>
          <AdminLoginForm />
          <div className="mt-6 flex items-center gap-2 text-xs text-ink-soft">
            <span>Are you a quilter?</span>
            <Link href="/login" className="font-semibold text-thread-deep underline hover:text-ink">
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const patterns = await listAllPatterns();
  return <AdminDashboard patterns={patterns} demoMode={demoMode} />;
}
