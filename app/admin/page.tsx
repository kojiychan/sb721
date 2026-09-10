import { OrdersTable } from "@/components/orders-table";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrders } from "@/lib/orders";

const summaryStatuses = [
  ["New Orders", "Order Received"],
  ["Scheduling", "Scheduling"],
  ["Scheduled", "Scheduled"],
  ["Reports In Progress", "Report In Progress"],
  ["Reports Ready", "Report Ready"],
];

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const orders = await getAdminOrders(supabase);
  const month = new Date().toISOString().slice(0, 7);
  const completedThisMonth = orders.filter(
    (order) => order.status === "Completed" && order.updated_at.startsWith(month),
  ).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Review, schedule, and process inspection orders.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {summaryStatuses.map(([label, status]) => (
          <SummaryCard
            key={label}
            label={label}
            value={orders.filter((order) => order.status === status).length}
          />
        ))}
        <SummaryCard label="Completed This Month" value={completedThisMonth} />
      </div>
      <OrdersTable admin orders={orders} />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-navy">{value}</p>
    </div>
  );
}
