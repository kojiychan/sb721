import { ClipboardList } from "lucide-react";

export function EmptyInspectorState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center">
      <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />
      <h2 className="mt-3 text-lg font-semibold text-navy">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{copy}</p>
    </div>
  );
}
