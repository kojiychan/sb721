import Link from "next/link";
import { ButtonLink } from "@/components/button";

export function PublicHeader({ cta = "login" }: { cta?: "login" | "signup" }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="text-lg font-bold text-navy" href="/">
          EEE Inspection Management
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/">Home</Link>
          <Link href="/#how">How It Works</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <ButtonLink href={cta === "login" ? "/login" : "/signup"} variant="secondary">
          {cta === "login" ? "Agent Login" : "Place an Order"}
        </ButtonLink>
      </div>
    </header>
  );
}
