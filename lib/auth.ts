import { redirect } from "next/navigation";
import { createClientServer } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

export async function getCurrentProfile() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { supabase: null, user: null, profile: null };
  }

  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return { supabase, user, profile };
}

export async function requireUser() {
  const context = await getCurrentProfile();
  if (!context.user || !context.profile) redirect("/login");
  return context as typeof context & {
    supabase: NonNullable<typeof context.supabase>;
    user: NonNullable<typeof context.user>;
    profile: Profile;
  };
}

export async function requireAdmin() {
  const context = await requireUser();
  if (context.profile.role !== "admin") redirect("/dashboard");
  return context;
}
