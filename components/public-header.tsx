"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/button";
import { BRAND, PUBLIC_ROUTES } from "@/lib/brand";

const navItems = [
  { href: PUBLIC_ROUTES.sb721, label: "SB 721" },
  { href: PUBLIC_ROUTES.sb326, label: "SB 326" },
  { href: PUBLIC_ROUTES.howItWorks, label: "How It Works" },
  { href: PUBLIC_ROUTES.contact, label: "Contact" },
];

export function PublicHeader({ cta = "order" }: { cta?: "login" | "order" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="flex items-center gap-3" href={PUBLIC_ROUTES.home}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-sm font-bold text-white">
            {BRAND.shortName}
          </span>
          <span className="text-base font-bold text-navy sm:text-lg">{BRAND.companyName}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link className="hover:text-navy" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link className="text-sm font-semibold text-slate-700 hover:text-navy" href={PUBLIC_ROUTES.login}>
            Agent Login
          </Link>
          <ButtonLink href={cta === "login" ? PUBLIC_ROUTES.login : PUBLIC_ROUTES.signup}>
            {cta === "login" ? "Agent Login" : "Order Inspection"}
          </ButtonLink>
        </div>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-navy lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isOpen ? (
        <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1">
            {navItems.map((item) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2 border-t border-line pt-4">
              <ButtonLink href={PUBLIC_ROUTES.signup}>Order Inspection</ButtonLink>
              <ButtonLink href={PUBLIC_ROUTES.login} variant="secondary">
                Agent Login
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
