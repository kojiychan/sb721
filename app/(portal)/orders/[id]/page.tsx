import { CheckCircle2 } from "lucide-react";
import { ProgressTracker } from "@/components/progress-tracker";
import { ReportCard } from "@/components/report-card";
import { StatusBadge } from "@/components/status-badge";
import { requireUser } from "@/lib/auth";
import { getAgentOrder } from "@/lib/orders";
import { formatDate, fullAddress } from "@/lib/utils";

export default async function AgentOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const order = await getAgentOrder(supabase, profile.id, id);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {query.created ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          Inspection order submitted successfully.
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Order {order.order_number}</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">{fullAddress(order)}</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <ProgressTracker status={order.status} />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <DetailSection title="Property Information" rows={[
            ["Address", fullAddress(order)],
            ["Number of Units", String(order.number_of_units)],
            ["Property Type", order.property_type],
          ]} />
          <DetailSection title="Inspection" rows={[
            ["Inspection Type", order.inspection_type],
            ["Date Ordered", formatDate(order.created_at)],
            ["Inspection Date", formatDate(order.inspection_date, true)],
          ]} />
          <DetailSection title="Property Contact" rows={[
            ["Name", order.property_contact_name],
            ["Phone", order.property_contact_phone],
            ["Email", order.property_contact_email],
          ]} />
          <DetailSection title="Access" rows={[
            ["Occupancy", order.occupancy_status],
            ["Lockbox Code", order.lockbox_code ?? "—"],
            ["Access Instructions", order.access_instructions ?? "—"],
          ]} />
          <DetailSection title="Real Estate Transaction" rows={[
            ["Listing Agent", order.listing_agent ?? "—"],
            ["Buyer Agent", order.buyer_agent ?? "—"],
            ["Escrow Closing Date", formatDate(order.escrow_closing_date)],
            ["Listing URL", order.listing_url ?? "—"],
          ]} />
          <DetailSection title="Notes" rows={[["Additional Notes", order.notes ?? "—"]]} />
        </div>
        <ReportCard hasReport={Boolean(order.report_storage_path)} orderId={order.id} />
      </div>
    </div>
  );
}

function DetailSection({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 break-words text-sm text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
