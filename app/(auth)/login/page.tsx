"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Field } from "@/components/form-fields";
import { PublicHeader } from "@/components/public-header";
import { PUBLIC_ROUTES } from "@/lib/brand";
import { createClientBrowser, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const isAdmin = nextPath?.startsWith("/admin") || searchParams.get("role") === "admin";
  const isInspector = searchParams.get("role") === "inspector";
  const title = isAdmin ? "Admin Login" : isInspector ? "Inspector Login" : "Agent Login";
  const subtitle = isAdmin
    ? "Access the admin management portal."
    : isInspector
      ? "Access your inspector portal account."
      : "Access your inspection orders and reports.";
  const signupHref = isInspector ? PUBLIC_ROUTES.inspectorSignup : PUBLIC_ROUTES.signup;

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setError("");
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured yet. Add your project URL and anon/publishable key to the environment, then restart or redeploy.");
        return;
      }
      const supabase = createClientBrowser();
      const login = String(formData.get("email")).trim();
      const email = login === "kojiychan" ? "kojiychan@example.com" : login;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: String(formData.get("password")),
      });
      if (signInError) {
        setError(signInError.message);
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

      if (nextPath) {
        router.push(nextPath);
      } else if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    });
  }

  return (
    <AuthFrame isInspector={isInspector} title={title} subtitle={subtitle}>
      <form action={onSubmit} className="space-y-4">
        <Field label="Email or Username" name="email" required />
        <Field label="Password" name="password" required type="password" />
        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <Button className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Login"}
        </Button>
      </form>
      {isAdmin ? (
        <p className="mt-5 border-t border-line pt-5 text-center text-sm text-slate-600">
          Admin accounts are managed internally.
        </p>
      ) : (
        <div className="mt-5 border-t border-line pt-5 text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link className="font-semibold text-brand" href={signupHref}>
            Create an account
          </Link>
        </div>
      )}
      <div className="mt-4 text-center text-sm">
        <Link className="font-semibold text-brand" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </AuthFrame>
  );
}

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

function AuthFrame({
  isInspector,
  title,
  subtitle,
  children,
}: {
  isInspector: boolean;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader
        loginHref={isInspector ? PUBLIC_ROUTES.inspectorLogin : PUBLIC_ROUTES.login}
        loginLabel={isInspector ? "Inspector Login" : "Agent Login"}
        orderHref={PUBLIC_ROUTES.login}
      />
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
