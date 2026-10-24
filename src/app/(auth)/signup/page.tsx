import { redirect } from "next/navigation";
import { AuthForm } from "@/components/features/auth/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCurrentUser } from "@/lib/auth/session";
import { signup } from "../actions";

export const metadata = { title: "Sign up · CAGEMETA" };

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title="Create account" subtitle="Free. Points only, no real money." />
      <AuthForm mode="signup" action={signup} />
    </div>
  );
}
