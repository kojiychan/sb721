import { FilePlus2 } from "lucide-react";
import { ButtonLink } from "@/components/button";

export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center">
      <FilePlus2 className="mx-auto h-10 w-10 text-slate-400" />
      <h2 className="mt-3 text-lg font-semibold text-navy">No inspection orders yet.</h2>
      <p className="mt-1 text-sm text-slate-600">Start by placing your first inspection order.</p>
      <ButtonLink className="mt-5" href="/orders/new">
        Place Your First Order
      </ButtonLink>
    </div>
  );
}
