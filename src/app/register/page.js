import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Join QuiltHaven · Free Quilter Account",
  description: "Create your QuiltHaven account to access patterns, track downloads, and customize your profile.",
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const returnTo = params?.return_to || "/profile";

  const user = await getCurrentUser();
  if (user) {
    redirect(returnTo);
  }

  return (
    <section className="bg-linen-light min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm initialMode="signup" returnTo={returnTo} />
      </div>
    </section>
  );
}
