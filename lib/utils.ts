import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
}

export function fullAddress(order: {
  property_address: string;
  city: string;
  state: string;
  zip: string;
}) {
  return `${order.property_address}, ${order.city}, ${order.state} ${order.zip}`;
}

export function formatOccupancyStatus(value: string) {
  return value === "Occupied" ? "Tenant Occupied" : value;
}

const saleReportPrefix = "Report needed for property sale: ";
const rushDesiredPrefix = "Rush desired: ";

export function formatSaleReportNeeded(notes: string | null | undefined) {
  const saleLine = notes?.split("\n").find((line) => line.startsWith(saleReportPrefix));
  return saleLine?.slice(saleReportPrefix.length).replace(/\.$/, "") ?? "—";
}

export function formatRushDesired(notes: string | null | undefined) {
  const rushLine = notes?.split("\n").find((line) => line.startsWith(rushDesiredPrefix));
  return rushLine?.slice(rushDesiredPrefix.length).replace(/\.$/, "") ?? "—";
}

export function formatAdditionalNotes(notes: string | null | undefined) {
  const noteLines =
    notes
      ?.split("\n")
      .filter((line) => !line.startsWith(saleReportPrefix) && !line.startsWith(rushDesiredPrefix)) ?? [];
  return noteLines.join("\n").trim() || "—";
}

export function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function nullableFormValue(formData: FormData, key: string) {
  const value = formValue(formData, key);
  return value.length ? value : null;
}
