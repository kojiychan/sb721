import { MailCheck } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { PublicHeader } from "@/components/public-header";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-lg rounded-lg border border-line bg-white p-6 text-center shadow-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-brand">
            <MailCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-navy">Check Your Email</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We sent a confirmation link{email ? ` to ${email}` : ""}. Confirm your email address
            before logging into your agent portal.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ButtonLink href="/login">Go to Login</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Back to Home
            </ButtonLink>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            If you do not see the email, check your spam folder or confirm that the address was
            entered correctly.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Need to use a different email?{" "}
            <Link className="font-semibold text-brand" href="/signup">
              Create another account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
