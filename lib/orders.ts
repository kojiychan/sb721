import { notFound } from "next/navigation";
import { ACTIVE_STATUSES } from "@/lib/statuses";
import type { Order } from "@/lib/types";

export async function getAgentOrders(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
  agentId: string,
  mode: "active" | "completed" | "all" = "active",
) {
  let query = supabase
    .from("orders")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (mode === "active") query = query.in("status", ACTIVE_STATUSES);
  if (mode === "completed") query = query.eq("status", "Completed");

  const { data, error } = await query.returns<Order[]>();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAgentOrder(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
  agentId: string,
  id: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("agent_id", agentId)
    .single<Order>();

  if (error || !data) notFound();
  return data;
}

export async function getOpenInspectorOrders(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .is("inspector_id", null)
    .is("inspector_name", null)
    .is("inspector_email", null)
    .is("inspector_phone", null)
    .in("status", ACTIVE_STATUSES)
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  if (error) throw new Error(error.message);
  return data;
}

export async function getInspectorOrders(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
  inspectorId: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("inspector_id", inspectorId)
    .in("status", ACTIVE_STATUSES)
    .order("inspection_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  if (error) throw new Error(error.message);
  return data;
}

export async function getInspectorVisibleOrder(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
  inspectorId: string,
  id: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single<Order>();

  if (
    error ||
    !data ||
    data.status === "Completed" ||
    data.status === "Cancelled" ||
    (data.inspector_id && data.inspector_id !== inspectorId)
  ) {
    notFound();
  }
  return data;
}

export async function getAdminOrders(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, profiles!orders_agent_id_fkey(first_name,last_name,email,company)")
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAdminOrder(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
  id: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, profiles!orders_agent_id_fkey(first_name,last_name,email,company)")
    .eq("id", id)
    .single<Order>();

  if (error || !data) notFound();
  return data;
}
