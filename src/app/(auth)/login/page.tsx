import { redirect } from "next/navigation";
import { AuthForm } from "@/components/features/auth/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCurrentUser } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/schemas";
import { login } from "../actions";

export const metadata = { title: "Log in · CAGEMETA" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const destination = safeNextPath(next);
  if (await getCurrentUser()) redirect(destination);

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title="Log in" />
      {error === "confirmation" ? (
        <p role="alert" className="mb-4 text-sm text-accent-hot">
          That confirmation link is invalid or expired. Try logging in, or sign up again.
        </p>
      ) : null}
      <AuthForm mode="login" action={login} next={destination === "/" ? undefined : destination} />
    </div>
  );
}
