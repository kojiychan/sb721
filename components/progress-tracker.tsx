import { ORDER_STATUSES, statusStep } from "@/lib/statuses";
import { cn } from "@/lib/utils";

const stages = ORDER_STATUSES.filter((status) => status !== "Cancelled");

export function ProgressTracker({ status }: { status: string }) {
  if (status === "Cancelled") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
        This order has been cancelled.
      </div>
    );
  }

  const current = statusStep(status);
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white p-4">
      <div className="flex min-w-[760px] items-center">
        {stages.map((stage, index) => {
          const filled = index < current;
          const active = index === current;
          return (
            <div className="flex flex-1 items-center" key={stage}>
              <div className="flex min-w-0 flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
                    filled && "border-brand bg-brand text-white",
                    active && "border-brand bg-blue-50 text-brand",
                    !filled && !active && "border-line bg-slate-50 text-slate-400",
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    "max-w-24 text-center text-xs font-medium",
                    active ? "text-brand" : filled ? "text-navy" : "text-slate-400",
                  )}
                >
                  {stage}
                </span>
              </div>
              {index < stages.length - 1 ? (
                <div
                  className={cn(
                    "mx-2 h-px flex-1",
                    index < current ? "bg-brand" : "bg-line",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
