import type { Metadata } from "next";
import { ClipboardList, FileText, Home, Ruler } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { BRAND, PUBLIC_ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: `SB 326 Inspections | ${BRAND.companyName}`,
  description:
    "Order and track SB 326 inspection coordination for applicable California condominium associations and HOAs.",
};

export default function SB326Page() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <section className="border-b border-line bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">SB 326 Inspections</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold text-navy">
              California SB 326 Inspection Coordination
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              SB 326 generally relates to exterior elevated element inspection coordination for
              applicable California condominium associations and HOAs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={PUBLIC_ROUTES.signup}>Order Inspection</ButtonLink>
              <ButtonLink href={PUBLIC_ROUTES.login} variant="secondary">
                Agent Login
              </ButtonLink>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-5 md:grid-cols-2">
            <InfoCard
              icon={Home}
              title="What the Inspection Generally Relates To"
              copy="These services focus on exterior elevated elements such as balconies, decks, exterior walkways, stairways, and landings."
            />
            <InfoCard
              icon={Ruler}
              title="Applicable Property Types"
              copy="SB 326 is commonly associated with certain California condominium associations and HOAs. Confirm applicability with qualified legal or compliance advisors."
            />
            <InfoCard
              icon={ClipboardList}
              title="Basic Inspection Process"
              copy="The process typically starts with order intake, property coordination, inspection scheduling, inspection completion, and report delivery."
            />
            <InfoCard
              icon={FileText}
              title="How to Place an Order"
              copy="Submit the property details and requested inspection type online. Our team coordinates the inspection process and keeps the order status available in the portal."
            />
          </div>
          <div className="mt-10 rounded-lg border border-line bg-paper p-6">
            <h2 className="text-xl font-bold text-navy">Important Note</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This page provides general service information and is not legal advice. Confirm legal
              requirements and property-specific obligations with appropriate advisors.
            </p>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Home;
  title: string;
  copy: string;
}) {
  return (
    <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
      <Icon className="h-6 w-6 text-brand" />
      <h2 className="mt-4 text-lg font-bold text-navy">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
    </article>
  );
}
