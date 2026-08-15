import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileEditor from "@/components/ProfileEditor";
import PatternCard from "@/components/PatternCard";
import { getCurrentUser, getCurrentProfile, isAdmin } from "@/lib/auth";
import { getPopularPatterns } from "@/lib/patterns";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export const metadata = {
  title: "My Quilter Profile · QuiltHaven",
  description: "Manage your QuiltHaven profile, craft preferences, and account details.",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?return_to=/profile");
  }

  const profile = await getCurrentProfile();
  const popularPatterns = await getPopularPatterns(3);
  const isCloudinaryReady = isCloudinaryConfigured();
  const adminAccess = await isAdmin();

  return (
    <div className="bg-linen-light py-10 sm:py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-soft">
          <Link href="/" className="hover:text-ink hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">Quilter Profile</span>
        </nav>

        {/* Profile Editor */}
        <ProfileEditor
          profile={profile}
          user={user}
          isCloudinaryReady={isCloudinaryReady}
        />

        {/* Quick Pattern Discoveries Rail */}
        <div className="border-t border-ink/10 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="measure-label text-thread-deep">Free Pattern Library</span>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
                Popular Quilts in the Library
              </h2>
            </div>
            <Link href="/patterns" className="btn btn-seam btn-sm">
              View All Patterns →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {popularPatterns.map((pattern) => (
              <PatternCard key={pattern.id || pattern.slug} pattern={pattern} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
