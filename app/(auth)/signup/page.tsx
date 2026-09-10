"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Field } from "@/components/form-fields";
import { PublicHeader } from "@/components/public-header";
import { createClientBrowser, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

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
            role: "agent",
          },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-lg rounded-lg border border-line bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-navy">Create Agent Account</h1>
          <p className="mt-2 text-sm text-slate-600">Submit and track SB 721 / SB 326 inspections.</p>
          <form action={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="First Name" name="first_name" required />
            <Field label="Last Name" name="last_name" required />
            <Field className="sm:col-span-2" label="Email" name="email" required type="email" />
            <Field label="Phone" name="phone" required />
            <Field label="Company / Brokerage" name="company" required />
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
            <Link className="font-semibold text-brand" href="/login">
              Login
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
