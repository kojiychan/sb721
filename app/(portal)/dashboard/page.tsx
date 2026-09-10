import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { OrdersTable } from "@/components/orders-table";
import { requireUser } from "@/lib/auth";
import { getAgentOrders } from "@/lib/orders";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const params = await searchParams;
  const tab = params.tab === "completed" ? "completed" : params.tab === "all" ? "all" : "active";
  const orders = await getAgentOrders(supabase, profile.id, tab);
  const q = params.q?.toLowerCase() ?? "";
  const filtered = q
    ? orders.filter(
        (order) =>
          order.property_address.toLowerCase().includes(q) ||
          order.order_number.toLowerCase().includes(q),
      )
    : orders;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Orders</h1>
          <p className="mt-1 text-sm text-slate-600">Track active inspections and completed reports.</p>
        </div>
        <ButtonLink href="/orders/new">
          <Plus className="h-4 w-4" />
          New Inspection Order
        </ButtonLink>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[
            ["active", "Active Orders"],
            ["completed", "Completed Orders"],
            ["all", "All Orders"],
          ].map(([value, label]) => (
            <a
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                tab === value ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
              href={`/dashboard?tab=${value}`}
              key={value}
            >
              {label}
            </a>
          ))}
        </div>
        <form>
          <input name="tab" type="hidden" value={tab} />
          <input
            className="h-10 w-full rounded-md border border-line px-3 text-sm sm:w-72"
            defaultValue={params.q}
            name="q"
            placeholder="Search address or order #"
          />
        </form>
      </div>
      {filtered.length ? <OrdersTable orders={filtered} /> : <EmptyState />}
    </div>
  );
}
