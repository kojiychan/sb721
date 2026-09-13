"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Field } from "@/components/form-fields";
import { PublicHeader } from "@/components/public-header";
import { PUBLIC_ROUTES } from "@/lib/brand";
import { createClientBrowser, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isInspector = searchParams.get("role") === "inspector";
  const role = isInspector ? "inspector" : "agent";
  const loginHref = isInspector ? PUBLIC_ROUTES.inspectorLogin : PUBLIC_ROUTES.login;
  const companyLabel = isInspector ? "Inspection Company" : "Company / Brokerage";

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setError("");
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured yet. Add your project URL and anon/publishable key to the environment, then restart or redeploy.");
        return;
      }
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      const supabase = createClientBrowser();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            first_name: String(formData.get("first_name")),
            last_name: String(formData.get("last_name")),
            phone: String(formData.get("phone")),
            company: String(formData.get("company")),
            role,
          },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      router.push(`/signup/check-email?email=${encodeURIComponent(email)}&role=${role}`);
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader orderHref={PUBLIC_ROUTES.login} />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-lg rounded-lg border border-line bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-navy">
            {isInspector ? "Create Inspector Account" : "Create Agent Account"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isInspector
              ? "Create an account for inspector portal access."
              : "Submit and track SB 721 / SB 326 inspections."}
          </p>
          <form action={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="First Name" name="first_name" required />
            <Field label="Last Name" name="last_name" required />
            <Field className="sm:col-span-2" label="Email" name="email" required type="email" />
            <Field label="Phone" name="phone" required />
            <Field label={companyLabel} name="company" required />
            <Field className="sm:col-span-2" label="Password" name="password" required type="password" />
            {error ? (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p>
            ) : null}
            <Button className="sm:col-span-2" disabled={isPending}>
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-brand" href={loginHref}>
              Login
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
