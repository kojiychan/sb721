import { Download, FileText } from "lucide-react";
import { ButtonLink } from "@/components/button";

export function ReportCard({ orderId, hasReport }: { orderId: string; hasReport: boolean }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-blue-50 p-2 text-brand">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-navy">
            {hasReport ? "Inspection Report" : "Report not available yet."}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {hasReport
              ? "Download the completed inspection report through a secure signed link."
              : "You will be able to download the completed inspection report once it is ready."}
          </p>
          {hasReport ? (
            <ButtonLink className="mt-4" href={`/reports/${orderId}`} target="_blank">
              <Download className="h-4 w-4" />
              Download Report
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
