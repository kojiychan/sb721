"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/button";
import { Field } from "@/components/form-fields";
import { PublicHeader } from "@/components/public-header";
import { createClientBrowser, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      if (!isSupabaseConfigured()) {
        setMessage("Supabase is not configured yet. Add your project URL and anon key to .env.local, then restart the dev server.");
        return;
      }
      const supabase = createClientBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(String(formData.get("email")), {
        redirectTo: `${location.origin}/auth/callback?next=/account`,
      });
      setMessage(error ? error.message : "Password reset email sent.");
    });
  }

  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-navy">Reset Password</h1>
          <form action={onSubmit} className="mt-6 space-y-4">
            <Field label="Email" name="email" required type="email" />
            {message ? (
              <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">{message}</p>
            ) : null}
            <Button className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
