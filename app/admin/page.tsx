import { OrdersTable } from "@/components/orders-table";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrders } from "@/lib/orders";
import type { Profile } from "@/lib/types";

const summaryStatuses = [
  ["New Orders", "Order Received"],
  ["Scheduling", "Scheduling"],
  ["Scheduled", "Scheduled"],
  ["Reports In Progress", "Report In Progress"],
  ["Reports Ready", "Report Ready"],
];

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [orders, profilesResult] = await Promise.all([
    getAdminOrders(supabase),
    supabase.from("profiles").select("*").returns<Profile[]>(),
  ]);
  if (profilesResult.error) throw new Error(profilesResult.error.message);
  const profiles = profilesResult.data;
  const month = new Date().toISOString().slice(0, 7);
  const completedThisMonth = orders.filter(
    (order) => order.status === "Completed" && order.updated_at.startsWith(month),
  ).length;
  const unassignedOrders = orders.filter((order) => !order.inspector_name && !order.inspector_email).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review orders, coordinate agents, and keep inspector work moving.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <SummaryCard label="Total Users" value={profiles.length} />
        <SummaryCard label="Agents" value={profiles.filter((profile) => profile.role === "agent").length} />
        <SummaryCard label="Inspectors" value={profiles.filter((profile) => profile.role === "inspector").length} />
        <SummaryCard label="Needs Inspector" value={unassignedOrders} />
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
