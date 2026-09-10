import type { Metadata } from "next";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND.companyName}`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold text-navy">Privacy Policy</h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          TODO: Replace this placeholder with the company privacy policy before production launch.
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
