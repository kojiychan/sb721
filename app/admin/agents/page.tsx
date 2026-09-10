import { requireAdmin } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export default async function AdminAgentsPage() {
  const { supabase } = await requireAdmin();
  const { data: agents, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();
  if (error) throw new Error(error.message);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Agents</h1>
        <p className="mt-1 text-sm text-slate-600">Agent accounts registered in the portal.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line bg-white shadow-soft">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Company</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td className="px-4 py-3 font-semibold text-navy">
                  {agent.first_name} {agent.last_name}
                </td>
                <td className="px-4 py-3 text-slate-700">{agent.email}</td>
                <td className="px-4 py-3 text-slate-700">{agent.phone ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">{agent.company ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
