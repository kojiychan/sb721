import { EmptyInspectorState } from "@/components/inspector-empty-state";
import { InspectorOrdersTable } from "@/components/inspector-orders-table";
import { requireInspector } from "@/lib/auth";
import { getInspectorOrders } from "@/lib/orders";

export default async function InspectorMyOrdersPage() {
  const { supabase, profile } = await requireInspector();
  const orders = await getInspectorOrders(supabase, profile.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">My Orders</h1>
        <p className="mt-1 text-sm text-slate-600">
          Assigned inspections that need your attention.
        </p>
      </div>
      {orders.length ? (
        <InspectorOrdersTable orders={orders} />
      ) : (
        <EmptyInspectorState
          title="No assigned orders yet."
          copy="Claim an open order when you are ready to take on inspection work."
        />
      )}
    </div>
  );
}
