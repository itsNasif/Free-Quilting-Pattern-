import AdminLoginForm from "@/components/AdminLoginForm";
import AdminDashboard from "@/components/AdminDashboard";
import { isAdmin } from "@/lib/auth";
import { listAllPatterns } from "@/lib/patterns";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata = {
  title: "Pattern Workshop",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authorized = await isAdmin();
  const demoMode = !isSupabaseConfigured();

  if (!authorized) {
    return (
      <section className="bg-linen-light">
        <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="measure-label text-thread-deep">Admin · pattern workshop</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
            The door is sewn shut
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            Publishing the library is reserved for the shop owner. Enter the
            workshop passcode from your <code className="rounded bg-black/[.06] px-1 py-0.5 font-mono text-[0.85em]">ADMIN_PASSWORD</code> env var to continue.
          </p>
          <AdminLoginForm />
        </div>
      </section>
    );
  }

  const patterns = await listAllPatterns();
  return <AdminDashboard patterns={patterns} demoMode={demoMode} />;
}
