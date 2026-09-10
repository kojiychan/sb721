import type { Metadata } from "next";
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  Home,
  Landmark,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { BRAND, PUBLIC_ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: `California SB 721 & SB 326 Inspections | ${BRAND.companyName}`,
  description:
    "Order and track California SB 721 and SB 326 inspections through one simple inspection management portal.",
};

const audiences = [
  { label: "Real Estate Agents", icon: UserRoundCheck },
  { label: "Property Managers", icon: Building2 },
  { label: "Property Owners", icon: Home },
  { label: "HOAs", icon: UsersRound },
];

const processSteps = [
  {
    title: "Place Your Order",
    copy: "Submit the property information and inspection type through our simple online portal.",
    icon: ClipboardList,
  },
  {
    title: "We Coordinate the Inspection",
    copy: "We coordinate scheduling and inspection fulfillment so you do not have to chase multiple vendors.",
    icon: CalendarCheck,
  },
  {
    title: "Receive Your Report",
    copy: "Track the order online and access the completed inspection report when it is ready.",
    icon: FileText,
  },
];

const benefits = [
  ["SIMPLE ORDERING", "Submit an inspection request online in minutes."],
  ["COORDINATED SCHEDULING", "We manage inspection coordination and keep the order moving."],
  ["ONE POINT OF CONTACT", "One place to manage the inspection process instead of chasing multiple parties."],
  ["ONLINE ORDER TRACKING", "View inspection status, scheduled dates, and completed reports from your portal."],
];

const portalFeatures = [
  "Submit new orders",
  "Track active inspections",
  "View scheduled inspection dates",
  "Access completed reports",
  "Review previous orders",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <section className="border-b border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                California Property Inspections
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-navy md:text-5xl">
                California SB 721 & SB 326 Inspections
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Order your inspection, track its status, and receive your completed report all in
                one place.
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-700">
                For Real Estate Agents • Property Owners • Property Managers • HOAs
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={PUBLIC_ROUTES.signup}>Order an Inspection</ButtonLink>
                <ButtonLink href={PUBLIC_ROUTES.login} variant="secondary">
                  Agent Login
                </ButtonLink>
              </div>
            </div>
            <PortalPreview />
          </div>
        </section>

        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-center text-xl font-bold text-navy">
              Built for California Real Estate Professionals
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((audience) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-line bg-white p-4"
                  key={audience.label}
                >
                  <audience.icon className="h-5 w-5 text-brand" />
                  <span className="text-sm font-semibold text-slate-700">{audience.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white" id="how-it-works">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <SectionLabel label="How It Works" />
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-navy">
              From Order to Report, We Handle the Process
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div className="rounded-lg border border-line bg-white p-6 shadow-soft" key={step.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-brand">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-navy">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-paper" id="services">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <SectionLabel label="Services" />
            <h2 className="mt-3 text-3xl font-bold text-navy">California Inspection Services</h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <ServiceCard
                href={PUBLIC_ROUTES.sb721}
                learnLabel="Learn About SB 721"
                title="SB 721 Inspections"
                copy="Exterior elevated element inspections for applicable California multifamily residential properties."
              />
              <ServiceCard
                href={PUBLIC_ROUTES.sb326}
                learnLabel="Learn About SB 326"
                title="SB 326 Inspections"
                copy="Exterior elevated element inspection coordination for applicable California condominium associations and HOAs."
              />
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <SectionLabel label="Why Choose Us" />
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-navy">
              A Simpler Way to Manage Property Inspections
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {benefits.map(([title, copy]) => (
                <div className="flex gap-4 rounded-lg border border-line bg-white p-5" key={title}>
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  <div>
                    <h3 className="text-sm font-bold tracking-wide text-navy">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel label="Agent Portal" />
              <h2 className="mt-3 text-3xl font-bold text-navy">Built for Real Estate Transactions</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Keep inspection orders organized without relying on email threads and status calls.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={PUBLIC_ROUTES.login}>Agent Login</ButtonLink>
                <ButtonLink href={PUBLIC_ROUTES.signup} variant="secondary">
                  Create Account
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
              <h3 className="text-lg font-bold text-navy">Portal Features</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {portalFeatures.map((feature) => (
                  <li className="flex items-center gap-3 text-sm font-medium text-slate-700" key={feature}>
                    <CheckCircle2 className="h-4 w-4 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white" id="contact">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[1fr_1fr]">
            <div>
              <SectionLabel label="Contact" />
              <h2 className="mt-3 text-3xl font-bold text-navy">Questions Before You Order?</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Add real company contact information in one place when it is ready. These
                placeholders are configured centrally for easy updates.
              </p>
            </div>
            <div className="grid gap-4">
              <ContactRow icon={Phone} label="Phone" value={BRAND.phone} />
              <ContactRow icon={Mail} label="Email" value={BRAND.email} />
              <ContactRow icon={MapPin} label="Business Hours" value={BRAND.businessHours} />
            </div>
          </div>
        </section>

        <section className="bg-navy">
          <div className="mx-auto max-w-6xl px-4 py-14 text-white">
            <h2 className="max-w-2xl text-3xl font-bold">Need an SB 721 or SB 326 Inspection?</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Place your order online and we will coordinate the process from inspection through
              report delivery.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={PUBLIC_ROUTES.signup}>Order an Inspection</ButtonLink>
              <ButtonLink href={PUBLIC_ROUTES.login} variant="secondary">
                Agent Login
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-sm font-semibold uppercase tracking-wide text-brand">{label}</p>;
}

function PortalPreview() {
  const rows = [
    ["Property Address", "Submitted"],
    ["Inspection Type", "Selected"],
    ["Status", "Scheduled"],
    ["Inspection Date", "Confirmed"],
    ["Report", "Delivered securely"],
  ];

  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order Tracking</p>
          <h2 className="mt-1 text-lg font-bold text-navy">Inspection Portal Preview</h2>
        </div>
        <Landmark className="h-6 w-6 text-brand" />
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-line">
        {rows.map(([label, value]) => (
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line p-4 last:border-b-0" key={label}>
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <span className="text-sm font-semibold text-navy">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  title,
  copy,
  href,
  learnLabel,
}: {
  title: string;
  copy: string;
  href: string;
  learnLabel: string;
}) {
  return (
    <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
      <h3 className="text-xl font-bold text-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={href} variant="secondary">
          {learnLabel}
        </ButtonLink>
        <ButtonLink href={PUBLIC_ROUTES.signup}>Order Inspection</ButtonLink>
      </div>
    </article>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-line bg-white p-5">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-brand" />
      <div>
        <h3 className="text-sm font-bold text-navy">{label}</h3>
        <p className="mt-1 text-sm text-slate-600">{value}</p>
      </div>
    </div>
  );
}
