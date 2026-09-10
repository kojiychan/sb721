import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-1 h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-blue-100";

export function Field({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className={cn("block text-sm font-medium text-slate-700", className)}>
      {label}
      <input className={fieldClass} {...props} />
      {hint ? <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={cn("block text-sm font-medium text-slate-700", className)}>
      {label}
      <select className={fieldClass} {...props}>
        {children}
      </select>
    </label>
  );
}

export function TextareaField({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={cn("block text-sm font-medium text-slate-700", className)}>
      {label}
      <textarea
        className="mt-1 min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-blue-100"
        {...props}
      />
    </label>
  );
}
