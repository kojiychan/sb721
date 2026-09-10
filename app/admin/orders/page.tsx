import { OrdersTable } from "@/components/orders-table";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrders } from "@/lib/orders";
import { ORDER_STATUSES } from "@/lib/statuses";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const q = params.q?.toLowerCase() ?? "";
  const orders = (await getAdminOrders(supabase)).filter((order) => {
    if (params.status && order.status !== params.status) return false;
    if (
      q &&
      !order.order_number.toLowerCase().includes(q) &&
      !order.property_address.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Orders</h1>
        <p className="mt-1 text-sm text-slate-600">All agent inspection orders.</p>
      </div>
      <form className="grid gap-3 rounded-lg border border-line bg-white p-3 md:grid-cols-[220px_1fr_140px]">
        <select className="h-10 rounded-md border border-line px-3 text-sm" name="status" defaultValue={params.status ?? ""}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <input
          className="h-10 rounded-md border border-line px-3 text-sm"
          defaultValue={params.q ?? ""}
          name="q"
          placeholder="Search address or order #"
        />
        <button className="rounded-md bg-brand px-4 text-sm font-semibold text-white">Filter</button>
      </form>
      <OrdersTable admin orders={orders} />
    </div>
  );
}
