import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Sign In · QuiltHaven",
  description: "Sign in to your QuiltHaven quilter account.",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const returnTo = params?.return_to || "/profile";

  const user = await getCurrentUser();
  if (user) {
    redirect(returnTo);
  }

  return (
    <section className="bg-linen-light min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm initialMode="signin" returnTo={returnTo} />
      </div>
    </section>
  );
}
