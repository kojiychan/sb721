import { EmptyState } from "@/components/empty-state";
import { OrdersTable } from "@/components/orders-table";
import { ORDER_STATUSES } from "@/lib/statuses";
import { requireUser } from "@/lib/auth";
import { getAgentOrders } from "@/lib/orders";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; date?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const params = await searchParams;
  const orders = await getAgentOrders(supabase, profile.id, "all");
  const filtered = orders.filter((order) => {
    if (params.status && order.status !== params.status) return false;
    if (params.type && order.inspection_type !== params.type) return false;
    if (params.date && !order.created_at.startsWith(params.date)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">My Orders</h1>
        <p className="mt-1 text-sm text-slate-600">Filter and review all submitted inspections.</p>
      </div>
      <form className="grid gap-3 rounded-lg border border-line bg-white p-3 md:grid-cols-4">
        <select className="h-10 rounded-md border border-line px-3 text-sm" name="status" defaultValue={params.status ?? ""}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select className="h-10 rounded-md border border-line px-3 text-sm" name="type" defaultValue={params.type ?? ""}>
          <option value="">All types</option>
          <option>SB 721</option>
          <option>SB 326</option>
          <option>Not Sure</option>
        </select>
        <input className="h-10 rounded-md border border-line px-3 text-sm" name="date" type="date" defaultValue={params.date ?? ""} />
        <button className="rounded-md bg-brand px-4 text-sm font-semibold text-white">Apply Filters</button>
      </form>
      {filtered.length ? <OrdersTable orders={filtered} /> : <EmptyState />}
    </div>
  );
}
