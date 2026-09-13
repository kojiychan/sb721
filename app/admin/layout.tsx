import { AdminShell } from "@/components/admin-shell";
import { AdminLoginPanel } from "@/components/admin-login-panel";
import { signOutAction } from "@/lib/actions";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getCurrentProfile();
  if (!profile) return <AdminLoginPanel />;
  if (profile.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 text-center shadow-soft">
          <h1 className="text-2xl font-bold text-navy">Admin Access Required</h1>
          <p className="mt-2 text-sm text-slate-600">
            You are signed in to the ordering portal. Sign out and use the admin password to continue.
          </p>
          <form action={signOutAction} className="mt-6">
            <button className="inline-flex h-10 items-center justify-center rounded-md border border-brand bg-brand px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
              Sign Out
            </button>
          </form>
        </section>
      </div>
    );
  }
  return <AdminShell profile={profile}>{children}</AdminShell>;
}
