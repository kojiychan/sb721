import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand text-white hover:bg-blue-700 border-brand",
  secondary: "bg-white text-navy hover:bg-slate-50 border-line",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 border-transparent",
  danger: "bg-white text-red-700 hover:bg-red-50 border-red-200",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
