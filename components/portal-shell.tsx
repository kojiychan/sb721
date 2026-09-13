import { ClipboardList, FilePlus2, Home, Inbox, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/lib/actions";
import { BRAND } from "@/lib/brand";
import type { Profile } from "@/lib/types";

const agentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/orders/new", label: "New Order", icon: FilePlus2 },
  { href: "/orders", label: "My Orders", icon: ClipboardList },
  { href: "/account", label: "Account", icon: UserRound },
];

const inspectorNavItems = [
  { href: "/open-orders", label: "Open Orders", icon: Inbox },
  { href: "/my-orders", label: "My Orders", icon: ClipboardList },
  { href: "/account", label: "Account", icon: UserRound },
];

export function PortalShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const navItems = profile.role === "inspector" ? inspectorNavItems : agentNavItems;
  const portalHome = profile.role === "inspector" ? "/open-orders" : "/dashboard";

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link className="text-lg font-bold text-navy" href={portalHome}>
          {BRAND.companyName}
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              href={item.href}
              key={item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
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
          <div className="flex items-center justify-between gap-4">
            <Link className="font-bold text-navy lg:hidden" href={portalHome}>
              {BRAND.shortName} Portal
            </Link>
            <div className="hidden gap-2 lg:flex">
              {profile.role === "admin" ? (
                <Link className="text-sm font-semibold text-brand" href="/admin">
                  Admin
                </Link>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden text-sm text-slate-600 sm:block">
                {profile.first_name ? `Hi, ${profile.first_name}` : profile.email}
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                href="/account"
              >
                <UserRound className="h-4 w-4" />
                Account
              </Link>
              <form action={signOutAction}>
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  type="submit"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <Link
                className="whitespace-nowrap rounded-md border border-line bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
