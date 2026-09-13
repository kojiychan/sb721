import { EmptyInspectorState } from "@/components/inspector-empty-state";
import { InspectorOrdersTable } from "@/components/inspector-orders-table";
import { requireInspector } from "@/lib/auth";
import { getOpenInspectorOrders } from "@/lib/orders";

export default async function OpenOrdersPage() {
  const { supabase } = await requireInspector();
  const orders = await getOpenInspectorOrders(supabase);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Open Orders</h1>
        <p className="mt-1 text-sm text-slate-600">
          Active inspection orders that are available to claim.
        </p>
      </div>
      {orders.length ? (
        <InspectorOrdersTable orders={orders} showClaim />
      ) : (
        <EmptyInspectorState
          title="No open orders right now."
          copy="When new unassigned inspections are available, they will appear here."
        />
      )}
    </div>
  );
}
