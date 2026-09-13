"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireInspector, requireUser } from "@/lib/auth";
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhoneNumber(value: string) {
  const digits = phoneDigits(value);
  return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function buildAccessInstructions(formData: FormData) {
  const needsEeeKey = formValue(formData, "eee_key_required");
  const accessMethod = formValue(formData, "eee_access_method");
  const lockboxCode = nullableFormValue(formData, "lockbox_code");
  const instructions = nullableFormValue(formData, "access_instructions");
  const accessLines = [`EEE key access needed: ${needsEeeKey}.`];

  if (needsEeeKey === "Yes") {
    accessLines.push(`Key access method: ${accessMethod}.`);
    if (accessMethod === "Lock box") accessLines.push(`Lockbox code: ${lockboxCode}.`);
  }

  if (instructions) accessLines.push(`Access instructions: ${instructions}`);
  return accessLines.join("\n");
}

function buildOrderNotes(formData: FormData) {
  const saleReportNeeded = formValue(formData, "sale_report_needed");
  const rushDesired = formValue(formData, "rush_desired");
  const paymentOption = formValue(formData, "payment_option");
  const ownerEmail = nullableFormValue(formData, "owner_email");
  const notes = nullableFormValue(formData, "notes");
  const noteLines = [
    `Report needed for property sale: ${saleReportNeeded}.`,
    `Rush desired: ${rushDesired}.`,
    `Payment option: ${paymentOption}.`,
  ];

  if (ownerEmail) noteLines.push(`Owner email: ${ownerEmail}.`);
  if (notes) noteLines.push(notes);
  return noteLines.join("\n");
}

export async function createOrderAction(
  _previousState: ActionState = defaultState,
  formData: FormData,
): Promise<ActionState> {
  void _previousState;
  const { supabase, profile } = await requireUser();
  const missing = requireFields(formData, [
    "property_address",
    "city",
    "state",
    "zip",
    "number_of_units",
    "inspection_type",
    "property_contact_name",
    "property_contact_phone",
    "property_contact_email",
    "occupancy_status",
    "eee_key_required",
    "sale_report_needed",
    "rush_desired",
    "payment_option",
  ]);
  if (missing) return { ok: false, message: missing };

  const needsEeeKey = formValue(formData, "eee_key_required");
  const accessMethod = formValue(formData, "eee_access_method");
  const saleReportNeeded = formValue(formData, "sale_report_needed");
  const rushDesired = formValue(formData, "rush_desired");
  const paymentOption = formValue(formData, "payment_option");
  const contactPhone = formValue(formData, "property_contact_phone");
  const contactEmail = formValue(formData, "property_contact_email");
  const ownerEmail = formValue(formData, "owner_email");
  if (!["Yes", "No"].includes(needsEeeKey)) {
    return { ok: false, message: "Please choose whether key access is needed." };
  }
  if (!["Yes", "No"].includes(saleReportNeeded)) {
    return { ok: false, message: "Please choose whether this report is needed for a sale." };
  }
  if (!["Yes", "No"].includes(rushDesired)) {
    return { ok: false, message: "Please choose whether rush is desired." };
  }
  if (!["Pay now", "Owner will pay"].includes(paymentOption)) {
    return { ok: false, message: "Please choose who will be paying." };
  }
  if (phoneDigits(contactPhone).length !== 10) {
    return { ok: false, message: "Point of contact phone must contain exactly 10 digits." };
  }
  if (!isValidEmail(contactEmail)) {
    return { ok: false, message: "Point of contact email must be a valid email address." };
  }
  if (paymentOption === "Owner will pay" && !isValidEmail(ownerEmail)) {
    return { ok: false, message: "Owner email must be a valid email address." };
  }
  if (needsEeeKey === "Yes" && !["Realtor to meet inspector", "Lock box"].includes(accessMethod)) {
    return { ok: false, message: "Please choose the key access method." };
  }
  if (needsEeeKey === "Yes" && accessMethod === "Lock box" && !nullableFormValue(formData, "lockbox_code")) {
    return { ok: false, message: "Please enter the lockbox code. Enter n/a if there is no code." };
  }

  const numberOfUnits = Number.parseInt(formValue(formData, "number_of_units"), 10);
  if (!Number.isFinite(numberOfUnits) || numberOfUnits < 1) {
    return { ok: false, message: "Number of units must be at least 1." };
  }

  const estimatedCount = nullableFormValue(formData, "estimated_eee_count");
  const { data, error } = await supabase
    .from("orders")
    .insert({
      agent_id: profile.id,
      property_address: formValue(formData, "property_address"),
      city: formValue(formData, "city"),
      state: formValue(formData, "state"),
      zip: formValue(formData, "zip"),
      number_of_units: numberOfUnits,
      property_type: "Multifamily",
      inspection_type: formValue(formData, "inspection_type"),
      estimated_eee_count: estimatedCount ? Number.parseInt(estimatedCount, 10) : null,
      property_contact_name: formValue(formData, "property_contact_name"),
      property_contact_phone: formatPhoneNumber(contactPhone),
      property_contact_email: contactEmail,
      occupancy_status: formValue(formData, "occupancy_status"),
      lockbox_code: accessMethod === "Lock box" ? nullableFormValue(formData, "lockbox_code") : null,
      access_instructions: buildAccessInstructions(formData),
      escrow_closing_date: nullableFormValue(formData, "escrow_closing_date"),
      notes: buildOrderNotes(formData),
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

export async function claimOrderAction(formData: FormData) {
  const { profile } = await requireInspector();
  const id = formValue(formData, "id");
  if (!id) throw new Error("Order is required.");

  const inspectorName = `${profile.first_name} ${profile.last_name}`.trim() || profile.email;
  const service = createServiceClient();
  const { data, error } = await service
    .from("orders")
    .update({
      inspector_id: profile.id,
      inspector_name: inspectorName,
      inspector_email: profile.email,
      inspector_phone: profile.phone,
    })
    .eq("id", id)
    .is("inspector_id", null)
    .is("inspector_name", null)
    .is("inspector_email", null)
    .is("inspector_phone", null)
    .in("status", ["Order Received", "Scheduling", "Scheduled", "Inspection Completed", "Report In Progress", "Report Ready"])
    .select("id")
    .single<{ id: string }>();

  if (error || !data) throw new Error("This order is no longer available to claim.");

  revalidatePath("/open-orders");
  revalidatePath("/my-orders");
  revalidatePath(`/orders/${id}`);
  redirect(`/orders/${id}`);
}

export async function signOutAction() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
  redirect("/");
}
