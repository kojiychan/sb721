import type { Metadata } from "next";
import { ClipboardCheck, LogIn, UserPlus } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { BRAND, PUBLIC_ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Inspector Access | ${BRAND.companyName}`,
  description: "Sign in or create an inspector account for California inspection management.",
};

export default function InspectorsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader loginHref={PUBLIC_ROUTES.inspectorLogin} loginLabel="Inspector Login" />
      <main className="mx-auto grid min-h-[calc(100vh-145px)] max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Inspector Portal</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-normal text-navy md:text-5xl">
            Inspector Access
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Sign in to access assigned inspection work, or create an inspector account if you are
            joining the portal for the first time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={PUBLIC_ROUTES.inspectorLogin}>
              <LogIn className="h-4 w-4" />
              Inspector Login
            </ButtonLink>
            <ButtonLink href={PUBLIC_ROUTES.inspectorSignup} variant="secondary">
              <UserPlus className="h-4 w-4" />
              Create Account
            </ButtonLink>
          </div>
        </section>
        <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-brand">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-navy">For Inspection Partners</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use this access point for inspection assignments, scheduling details, and portal
            account setup.
          </p>
          <div className="mt-6 grid gap-3 border-t border-line pt-6">
            <InspectorDetail label="Existing inspectors" value="Sign in with your email and password." />
            <InspectorDetail label="New inspectors" value="Create an account to request portal access." />
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

function InspectorDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy">{label}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}
