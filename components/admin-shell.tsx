import { ClipboardList, Home, LogOut, UsersRound } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/lib/actions";
import { BRAND } from "@/lib/brand";
import type { Profile } from "@/lib/types";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/agents", label: "Agents", icon: UsersRound },
];

export function AdminShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link className="text-lg font-bold text-navy" href="/admin">
          {BRAND.shortName} Admin
        </Link>
        <nav className="mt-8 space-y-1">
          {adminNav.map((item) => (
            <Link
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              href={item.href}
              key={item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            href="/dashboard"
          >
            Agent View
          </Link>
        </nav>
        <form action={signOutAction} className="absolute bottom-5 left-4 right-4">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between">
            <Link className="font-bold text-navy lg:hidden" href="/admin">
              {BRAND.shortName} Admin
            </Link>
            <div className="text-sm text-slate-600">Admin: {profile.first_name}</div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
