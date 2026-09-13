import { getAdminContext } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const context = await getAdminContext();
  if (!context) return null;
  const { supabase } = context;
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();
  if (error) throw new Error(error.message);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Users</h1>
        <p className="mt-1 text-sm text-slate-600">
          All portal accounts across admins, agents, and inspectors.
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line bg-white shadow-soft">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => (
              <tr className="hover:bg-slate-50/70" key={user.id}>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-navy">
                  {user.first_name} {user.last_name}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{user.phone ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{user.company ?? "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
