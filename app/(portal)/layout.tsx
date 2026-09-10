import { PortalShell } from "@/components/portal-shell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireUser();
  return <PortalShell profile={profile}>{children}</PortalShell>;
}
