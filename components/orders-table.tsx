import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { Order } from "@/lib/types";
import { formatDate, fullAddress } from "@/lib/utils";

export function OrdersTable({
  orders,
  admin = false,
}: {
  orders: Order[];
  admin?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white shadow-soft">
      <table className="min-w-full divide-y divide-line text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Order #</th>
            <th className="px-4 py-3">Property Address</th>
            {admin ? <th className="px-4 py-3">Agent</th> : null}
            <th className="px-4 py-3">Inspection Type</th>
            <th className="px-4 py-3">Date Ordered</th>
            <th className="px-4 py-3">Inspection Date</th>
            <th className="px-4 py-3">Status</th>
            {admin ? <th className="px-4 py-3">Inspector</th> : null}
            <th className="px-4 py-3">Report</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((order) => (
            <tr className="hover:bg-slate-50/70" key={order.id}>
              <td className="whitespace-nowrap px-4 py-3 font-semibold text-navy">
                {order.order_number}
              </td>
              <td className="min-w-72 px-4 py-3 text-slate-700">{fullAddress(order)}</td>
              {admin ? (
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {order.profiles
                    ? `${order.profiles.first_name} ${order.profiles.last_name}`
                    : "—"}
                </td>
              ) : null}
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                {order.inspection_type}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                {formatDate(order.created_at)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                {formatDate(order.inspection_date, true)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              {admin ? (
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {order.inspector_name ?? "—"}
                </td>
              ) : null}
              <td className="whitespace-nowrap px-4 py-3">
                {order.report_storage_path ? (
                  <Link
                    className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                    href={`/reports/${order.id}`}
                    target="_blank"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Link>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <Link
                  className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                  href={admin ? `/admin/orders/${order.id}` : `/orders/${order.id}`}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
