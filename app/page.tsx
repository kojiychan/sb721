import { ArrowRight, ClipboardCheck, FileText, SearchCheck } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PublicHeader } from "@/components/public-header";

const benefits = [
  {
    title: "Easy Ordering",
    copy: "Submit a property inspection request in minutes.",
    icon: ClipboardCheck,
  },
  {
    title: "Simple Tracking",
    copy: "See inspection status and scheduled dates from your dashboard.",
    icon: SearchCheck,
  },
  {
    title: "Report Delivery",
    copy: "Access completed inspection reports directly from your account.",
    icon: FileText,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <section className="border-b border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                California balcony and EEE compliance
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-navy md:text-5xl">
                SB 721 & SB 326 Inspections Made Simple
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Order and track California balcony and exterior elevated element inspections
                through one simple portal.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/signup">
                  Place an Order
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary">
                  Agent Login
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
              <div className="border-b border-line pb-4">
                <p className="text-sm font-semibold text-slate-500">Order SB-1014</p>
                <h2 className="mt-1 text-xl font-bold text-navy">1250 Harbor View Drive</h2>
              </div>
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Inspection Type</dt>
                  <dd className="font-semibold text-navy">SB 326</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="font-semibold text-brand">Scheduled</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Inspection Date</dt>
                  <dd className="font-semibold text-navy">Sep 18, 2026</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Report</dt>
                  <dd className="font-semibold text-slate-400">Pending</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-12" id="how">
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div className="rounded-lg border border-line bg-white p-5 shadow-soft" key={benefit.title}>
                <benefit.icon className="h-6 w-6 text-brand" />
                <h2 className="mt-4 font-semibold text-navy">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-line bg-paper" id="contact">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <span>EEE Inspection Management</span>
          <span>orders@example.com | (555) 014-7210</span>
        </div>
      </footer>
    </div>
  );
}
