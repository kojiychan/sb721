import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  "Order Received": "bg-slate-100 text-slate-700 border-slate-200",
  Scheduling: "bg-amber-50 text-amber-800 border-amber-200",
  Scheduled: "bg-blue-50 text-blue-800 border-blue-200",
  "Inspection Completed": "bg-indigo-50 text-indigo-800 border-indigo-200",
  "Report In Progress": "bg-purple-50 text-purple-800 border-purple-200",
  "Report Ready": "bg-emerald-50 text-emerald-800 border-emerald-200",
  Completed: "bg-green-50 text-green-800 border-green-200",
  Cancelled: "bg-red-50 text-red-800 border-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-semibold",
        colors[status] ?? colors["Order Received"],
      )}
    >
      {status}
    </span>
  );
}
