"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import { Field, SelectField, TextareaField } from "@/components/form-fields";
import { createOrderAction } from "@/lib/actions";

export default function NewOrderPage() {
  const [state, action, pending] = useActionState(createOrderAction, { ok: false, message: "" });

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">New Inspection Order</h1>
        <p className="mt-1 text-sm text-slate-600">Submit one complete request for admin scheduling.</p>
      </div>
      <form action={action} className="space-y-5">
        <FormSection title="PROPERTY INFORMATION">
          <Field className="md:col-span-2" label="Property Address" name="property_address" required />
          <Field label="City" name="city" required />
          <Field label="State" name="state" required defaultValue="CA" />
          <Field label="ZIP" name="zip" required />
          <Field label="Number of Units" min={1} name="number_of_units" required type="number" />
          <SelectField label="Property Type" name="property_type" required>
            <option value="">Select type</option>
            <option>Multifamily</option>
            <option>Condominium / HOA</option>
            <option>Apartment</option>
            <option>Mixed Use</option>
            <option>Other</option>
          </SelectField>
        </FormSection>
        <FormSection title="INSPECTION INFORMATION">
          <SelectField label="Inspection Type" name="inspection_type" required>
            <option value="">Select type</option>
            <option>SB 721</option>
            <option>SB 326</option>
            <option>Not Sure</option>
          </SelectField>
          <Field
            hint="Examples include balconies, decks, exterior walkways, stairways, and landings."
            label="Estimated Exterior Elevated Elements"
            min={0}
            name="estimated_eee_count"
            type="number"
          />
        </FormSection>
        <FormSection title="PROPERTY CONTACT">
          <Field label="Contact Name" name="property_contact_name" required />
          <Field label="Phone" name="property_contact_phone" required />
          <Field label="Email" name="property_contact_email" required type="email" />
        </FormSection>
        <FormSection title="ACCESS INFORMATION">
          <SelectField label="Occupancy" name="occupancy_status" required>
            <option value="">Select occupancy</option>
            <option>Occupied</option>
            <option>Vacant</option>
            <option>Unknown</option>
          </SelectField>
          <Field label="Lockbox Code" name="lockbox_code" />
          <TextareaField className="md:col-span-3" label="Access Instructions" name="access_instructions" />
        </FormSection>
        <FormSection title="REAL ESTATE TRANSACTION">
          <Field label="Listing Agent" name="listing_agent" />
          <Field label="Buyer Agent" name="buyer_agent" />
          <Field label="Escrow Closing Date" name="escrow_closing_date" type="date" />
          <Field label="MLS or Listing URL" name="listing_url" type="url" />
        </FormSection>
        <FormSection title="ADDITIONAL NOTES">
          <TextareaField className="md:col-span-3" label="Notes" name="notes" />
        </FormSection>
        {state.message ? (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.message}</p>
        ) : null}
        <div className="flex justify-end">
          <Button disabled={pending}>{pending ? "Submitting..." : "Submit Inspection Order"}</Button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-xs font-bold tracking-wide text-slate-500">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">{children}</div>
    </section>
  );
}
