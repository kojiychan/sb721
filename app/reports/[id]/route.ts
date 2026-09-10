import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, profile } = await requireUser();
  const { id } = await params;
  let query = supabase.from("orders").select("report_storage_path").eq("id", id);
  if (profile.role !== "admin") query = query.eq("agent_id", profile.id);

  const { data, error } = await query.single<{ report_storage_path: string | null }>();
  if (error || !data?.report_storage_path) {
    return NextResponse.json({ error: "Report not available." }, { status: 404 });
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from("inspection-reports")
    .createSignedUrl(data.report_storage_path, 60);

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Unable to create secure report link." }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
