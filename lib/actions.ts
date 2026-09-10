"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireUser } from "@/lib/auth";
import { isOrderStatus } from "@/lib/statuses";
import { createServiceClient } from "@/lib/supabase";
import { formValue, nullableFormValue } from "@/lib/utils";

export type ActionState = {
  ok: boolean;
  message: string;
};

const defaultState: ActionState = { ok: false, message: "" };

function requireFields(formData: FormData, fields: string[]) {
  const missing = fields.filter((field) => !formValue(formData, field));
  if (missing.length) {
    return `Please complete: ${missing.join(", ")}.`;
  }
  return null;
}

export async function createOrderAction(
  _previousState: ActionState = defaultState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, profile } = await requireUser();
  const missing = requireFields(formData, [
    "property_address",
    "city",
    "state",
    "zip",
    "number_of_units",
    "property_type",
    "inspection_type",
    "property_contact_name",
    "property_contact_phone",
    "property_contact_email",
    "occupancy_status",
  ]);
  if (missing) return { ok: false, message: missing };

  const numberOfUnits = Number.parseInt(formValue(formData, "number_of_units"), 10);
  if (!Number.isFinite(numberOfUnits) || numberOfUnits < 1) {
    return { ok: false, message: "Number of units must be at least 1." };
  }

  const estimatedCount = nullableFormValue(formData, "estimated_eee_count");
  const agentName = `${profile.first_name} ${profile.last_name}`.trim();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      agent_id: profile.id,
      property_address: formValue(formData, "property_address"),
      city: formValue(formData, "city"),
      state: formValue(formData, "state"),
      zip: formValue(formData, "zip"),
      number_of_units: numberOfUnits,
      property_type: formValue(formData, "property_type"),
      inspection_type: formValue(formData, "inspection_type"),
      estimated_eee_count: estimatedCount ? Number.parseInt(estimatedCount, 10) : null,
      property_contact_name: formValue(formData, "property_contact_name"),
      property_contact_phone: formValue(formData, "property_contact_phone"),
      property_contact_email: formValue(formData, "property_contact_email"),
      occupancy_status: formValue(formData, "occupancy_status"),
      lockbox_code: nullableFormValue(formData, "lockbox_code"),
      access_instructions: nullableFormValue(formData, "access_instructions"),
      listing_agent: nullableFormValue(formData, "listing_agent") ?? agentName,
      buyer_agent: nullableFormValue(formData, "buyer_agent"),
      escrow_closing_date: nullableFormValue(formData, "escrow_closing_date"),
      listing_url: nullableFormValue(formData, "listing_url"),
      notes: nullableFormValue(formData, "notes"),
      status: "Order Received",
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) return { ok: false, message: error?.message ?? "Unable to create order." };
  redirect(`/orders/${data.id}?created=1`);
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, profile } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: formValue(formData, "first_name"),
      last_name: formValue(formData, "last_name"),
      phone: nullableFormValue(formData, "phone"),
      company: nullableFormValue(formData, "company"),
    })
    .eq("id", profile.id);

  if (error) throw new Error(error.message);
  revalidatePath("/account");
}

export async function updateAdminOrderAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formValue(formData, "id");
  const status = formValue(formData, "status");
  if (!id || !isOrderStatus(status)) throw new Error("Invalid order update.");

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      inspection_date: nullableFormValue(formData, "inspection_date"),
      inspector_name: nullableFormValue(formData, "inspector_name"),
      inspector_email: nullableFormValue(formData, "inspector_email"),
      inspector_phone: nullableFormValue(formData, "inspector_phone"),
      internal_notes: nullableFormValue(formData, "internal_notes"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/orders/${id}`);
}

export async function uploadReportAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formValue(formData, "id");
  const file = formData.get("report");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose a PDF report.");
  if (file.type !== "application/pdf") throw new Error("Only PDF reports are supported.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("id", id)
    .single<{ id: string; order_number: string }>();
  if (orderError || !order) throw new Error("Order not found.");

  const storagePath = `${order.id}/${order.order_number}-final-report.pdf`;
  const service = createServiceClient();
  const { error: uploadError } = await service.storage
    .from("inspection-reports")
    .upload(storagePath, file, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (uploadError) throw new Error(uploadError.message);

  const { error: updateError } = await supabase
    .from("orders")
    .update({ report_storage_path: storagePath })
    .eq("id", id);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/orders/${id}`);
}

export async function signOutAction() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
  redirect("/");
}
