import { Button } from "@/components/button";
import { Field, SelectField, TextareaField } from "@/components/form-fields";
import { ProgressTracker } from "@/components/progress-tracker";
import { ReportCard } from "@/components/report-card";
import { StatusBadge } from "@/components/status-badge";
import { updateAdminOrderAction, uploadReportAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrder } from "@/lib/orders";
import { ORDER_STATUSES } from "@/lib/statuses";
import { formatDate, fullAddress } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const order = await getAdminOrder(supabase, id);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Order {order.order_number}</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">{fullAddress(order)}</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <ProgressTracker status={order.status} />
      <div className="grid gap-5 lg:grid-cols-[1fr_390px]">
        <div className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-navy">Order Details</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Agent", order.profiles ? `${order.profiles.first_name} ${order.profiles.last_name}` : "—"],
                ["Agent Email", order.profiles?.email ?? "—"],
                ["Inspection Type", order.inspection_type],
                ["Date Ordered", formatDate(order.created_at)],
                ["Inspection Date", formatDate(order.inspection_date, true)],
                ["Units", String(order.number_of_units)],
                ["Property Type", order.property_type],
                ["Contact", `${order.property_contact_name} | ${order.property_contact_phone}`],
                ["Access", order.access_instructions ?? "—"],
                ["Notes", order.notes ?? "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="mt-1 break-words text-sm text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-navy">Admin Controls</h2>
            <form action={updateAdminOrderAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input name="id" type="hidden" value={order.id} />
              <SelectField label="Status" name="status" required defaultValue={order.status}>
                {ORDER_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </SelectField>
              <Field
                label="Inspection Date"
                name="inspection_date"
                type="datetime-local"
                defaultValue={order.inspection_date ? order.inspection_date.slice(0, 16) : ""}
              />
              <Field label="Inspector Name" name="inspector_name" defaultValue={order.inspector_name ?? ""} />
              <Field label="Inspector Email" name="inspector_email" type="email" defaultValue={order.inspector_email ?? ""} />
              <Field label="Inspector Phone" name="inspector_phone" defaultValue={order.inspector_phone ?? ""} />
              <TextareaField className="md:col-span-2" label="Internal Notes" name="internal_notes" defaultValue={order.internal_notes ?? ""} />
              <div className="md:col-span-2 flex justify-end">
                <Button>Save Admin Updates</Button>
              </div>
            </form>
          </section>
        </div>
        <div className="space-y-5">
          <ReportCard hasReport={Boolean(order.report_storage_path)} orderId={order.id} />
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-navy">Report Upload</h2>
            <p className="mt-1 text-sm text-slate-600">Upload or replace one final PDF report.</p>
            <form action={uploadReportAction} className="mt-4 space-y-4">
              <input name="id" type="hidden" value={order.id} />
              <input
                accept="application/pdf"
                className="block w-full rounded-md border border-line bg-white p-2 text-sm"
                name="report"
                required
                type="file"
              />
              <Button className="w-full">Upload PDF Report</Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
