"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/button";
import { Field } from "@/components/form-fields";
import { BRAND } from "@/lib/brand";
import { createClientBrowser, isSupabaseConfigured } from "@/lib/supabase-browser";

const ADMIN_EMAIL = "kojiychan@example.com";

export function AdminLoginPanel() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setError("");
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured yet. Add the project URL and publishable key.");
        return;
      }

      const supabase = createClientBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: String(formData.get("password")),
      });

      if (signInError) {
        setError("Incorrect admin password.");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single<{ role: "agent" | "inspector" | "admin" }>();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("This account is not an admin.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {BRAND.shortName} Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy">Admin Password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the admin password to manage users, orders, and inspectors.
        </p>
        <form action={onSubmit} className="mt-6 space-y-4">
          <Field
            autoComplete="current-password"
            autoFocus
            label="Password"
            name="password"
            required
            type="password"
          />
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          <Button className="w-full" disabled={isPending}>
            {isPending ? "Checking..." : "Enter Admin"}
          </Button>
        </form>
      </section>
    </div>
  );
}
