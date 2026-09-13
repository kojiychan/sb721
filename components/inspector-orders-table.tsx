import Link from "next/link";
import { ClipboardCheck, Eye } from "lucide-react";
import { Button } from "@/components/button";
import { StatusBadge } from "@/components/status-badge";
import { claimOrderAction } from "@/lib/actions";
import type { Order } from "@/lib/types";
import { formatDate, fullAddress } from "@/lib/utils";

export function InspectorOrdersTable({
  orders,
  showClaim = false,
}: {
  orders: Order[];
  showClaim?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white shadow-soft">
      <table className="min-w-full divide-y divide-line text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Order #</th>
            <th className="px-4 py-3">Property Address</th>
            <th className="px-4 py-3">Inspection Type</th>
            <th className="px-4 py-3">Date Ordered</th>
            <th className="px-4 py-3">Inspection Date</th>
            <th className="px-4 py-3">Status</th>
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
              <td className="whitespace-nowrap px-4 py-3">
                {showClaim ? (
                  <form action={claimOrderAction}>
                    <input name="id" type="hidden" value={order.id} />
                    <Button className="h-9" variant="secondary">
                      <ClipboardCheck className="h-4 w-4" />
                      Claim
                    </Button>
                  </form>
                ) : (
                  <Link
                    className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                    href={`/orders/${order.id}`}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
