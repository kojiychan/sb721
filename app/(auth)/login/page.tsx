"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Field } from "@/components/form-fields";
import { PublicHeader } from "@/components/public-header";
import { createClientBrowser, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setError("");
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured yet. Add your project URL and anon key to .env.local, then restart the dev server.");
        return;
      }
      const supabase = createClientBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <AuthFrame title="Agent Login" subtitle="Access your inspection orders and reports.">
      <form action={onSubmit} className="space-y-4">
        <Field label="Email" name="email" required type="email" />
        <Field label="Password" name="password" required type="password" />
        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <Button className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Login"}
        </Button>
      </form>
      <div className="mt-5 flex justify-between text-sm">
        <Link className="font-semibold text-brand" href="/signup">
          Create account
        </Link>
        <Link className="font-semibold text-brand" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </AuthFrame>
  );
}

function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-navy">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </section>
      </main>
    </div>
  );
}
