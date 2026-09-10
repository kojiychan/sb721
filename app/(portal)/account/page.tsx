import { Button } from "@/components/button";
import { Field } from "@/components/form-fields";
import { updateProfileAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const { profile } = await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Account</h1>
        <p className="mt-1 text-sm text-slate-600">Keep your contact information current.</p>
      </div>
      <form action={updateProfileAction} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First Name" name="first_name" required defaultValue={profile.first_name} />
          <Field label="Last Name" name="last_name" required defaultValue={profile.last_name} />
          <Field label="Phone" name="phone" defaultValue={profile.phone ?? ""} />
          <Field label="Company / Brokerage" name="company" defaultValue={profile.company ?? ""} />
          <Field className="sm:col-span-2" label="Email" name="email" disabled defaultValue={profile.email} />
        </div>
        <div className="mt-5 flex justify-end">
          <Button>Save Account</Button>
        </div>
      </form>
    </div>
  );
}
