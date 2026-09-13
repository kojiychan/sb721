import { requireAdmin } from "@/lib/auth";
import { getAdminOrders } from "@/lib/orders";
import type { Profile } from "@/lib/types";

export default async function AdminInspectorsPage() {
  const { supabase } = await requireAdmin();
  const [{ data: inspectors, error }, orders] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "inspector")
      .order("created_at", { ascending: false })
      .returns<Profile[]>(),
    getAdminOrders(supabase),
  ]);
  if (error) throw new Error(error.message);

  const assignedOrders = orders.filter((order) => order.inspector_email || order.inspector_name);
  const unassignedOrders = orders.filter((order) => !order.inspector_email && !order.inspector_name);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Inspectors</h1>
        <p className="mt-1 text-sm text-slate-600">
          Inspector accounts, assigned work, and open scheduling needs.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Inspector Accounts" value={inspectors.length} />
        <SummaryCard label="Assigned Orders" value={assignedOrders.length} />
        <SummaryCard label="Needs Inspector" value={unassignedOrders.length} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-line bg-white shadow-soft">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Inspector</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Assigned Orders</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Reports In Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {inspectors.map((inspector) => {
              const inspectorOrders = orders.filter(
                (order) =>
                  order.inspector_email?.toLowerCase() === inspector.email.toLowerCase() ||
                  order.inspector_name === `${inspector.first_name} ${inspector.last_name}`,
              );
              return (
                <tr className="hover:bg-slate-50/70" key={inspector.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-navy">
                    {inspector.first_name} {inspector.last_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{inspector.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{inspector.phone ?? "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{inspector.company ?? "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{inspectorOrders.length}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {inspectorOrders.filter((order) => order.status === "Scheduled").length}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {inspectorOrders.filter((order) => order.status === "Report In Progress").length}
                  </td>
                </tr>
              );
            })}
            {inspectors.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
                  No inspector accounts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
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
