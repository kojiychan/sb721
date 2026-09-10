import Link from "next/link";
import { BRAND, PUBLIC_ROUTES } from "@/lib/brand";

const footerGroups = [
  {
    title: "Services",
    links: [
      { href: PUBLIC_ROUTES.sb721, label: "SB 721 Inspections" },
      { href: PUBLIC_ROUTES.sb326, label: "SB 326 Inspections" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: PUBLIC_ROUTES.howItWorks, label: "How It Works" },
      { href: PUBLIC_ROUTES.contact, label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: PUBLIC_ROUTES.login, label: "Agent Login" },
      { href: PUBLIC_ROUTES.signup, label: "Place Order" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: PUBLIC_ROUTES.privacy, label: "Privacy Policy" },
      { href: PUBLIC_ROUTES.terms, label: "Terms of Service" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Link className="text-lg font-bold" href={PUBLIC_ROUTES.home}>
            {BRAND.companyName}
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            Inspection management services for California real estate professionals, property
            owners, property managers, and HOAs.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link className="hover:text-white" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Copyright {BRAND.copyrightYear} {BRAND.companyName}. All rights reserved.
          </span>
          <span>No affiliation with California government agencies is claimed.</span>
        </div>
      </div>
    </footer>
  );
}
