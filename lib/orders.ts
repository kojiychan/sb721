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

export async function getAdminOrders(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase").createClientServer>>,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, profiles(first_name,last_name,email,company)")
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
    .select("*, profiles(first_name,last_name,email,company)")
    .eq("id", id)
    .single<Order>();

  if (error || !data) notFound();
  return data;
}
