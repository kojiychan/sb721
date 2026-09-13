"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/button";
import { Field, SelectField, TextareaField } from "@/components/form-fields";
import { createOrderAction } from "@/lib/actions";

export default function NewOrderPage() {
  const [state, action, pending] = useActionState(createOrderAction, { ok: false, message: "" });
  const [needsEeeKey, setNeedsEeeKey] = useState("");
  const [accessMethod, setAccessMethod] = useState("");
  const [rushDesired, setRushDesired] = useState("");

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">New Inspection Order</h1>
        <p className="mt-1 text-sm text-slate-600">Submit one complete request for admin scheduling.</p>
      </div>
      <form action={action} className="space-y-5">
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
        <FormSection title="REPORT TIMING">
          <div className="space-y-4 md:col-span-2">
            <Field className="max-w-sm" label="Desired Completion Date" name="escrow_closing_date" type="date" />
            <SelectField
              label="Is this report needed for a sale of the property?"
              name="sale_report_needed"
              required
            >
              <option value="">Select answer</option>
              <option>Yes</option>
              <option>No</option>
            </SelectField>
          </div>
          <YesNoToggle
            className="max-w-sm"
            label="Is a rush desired?"
            name="rush_desired"
            onChange={setRushDesired}
            value={rushDesired}
          />
        </FormSection>
        <FormSection title="PROPERTY INFORMATION">
          <Field className="md:col-span-2" label="Property Address" name="property_address" required />
          <Field label="City" name="city" required />
          <Field label="State" name="state" required defaultValue="CA" />
          <Field label="ZIP" name="zip" required />
          <Field label="Number of Units" min={1} name="number_of_units" required type="number" />
        </FormSection>
        <FormSection title="PROPERTY CONTACT">
          <Field label="Contact Name" name="property_contact_name" required />
          <Field label="Phone" name="property_contact_phone" required />
          <Field label="Email" name="property_contact_email" required type="email" />
        </FormSection>
        <FormSection title="ACCESS INFORMATION">
          <SelectField label="Occupancy" name="occupancy_status" required>
            <option value="">Select occupancy</option>
            <option value="Occupied">Tenant Occupied</option>
            <option>Vacant</option>
            <option>Unknown</option>
          </SelectField>
          <SelectField
            className="md:col-span-2 md:whitespace-nowrap"
            label="Do you need a key to access any of the Exterior Elevated Elements?"
            name="eee_key_required"
            onChange={(event) => {
              setNeedsEeeKey(event.target.value);
              if (event.target.value !== "Yes") setAccessMethod("");
            }}
            required
            value={needsEeeKey}
          >
            <option value="">Select answer</option>
            <option>Yes</option>
            <option>No</option>
          </SelectField>
          {needsEeeKey === "Yes" ? (
            <SelectField
              label="Key Access Method"
              name="eee_access_method"
              onChange={(event) => setAccessMethod(event.target.value)}
              required
              value={accessMethod}
            >
              <option value="">Select method</option>
              <option>Realtor to meet inspector</option>
              <option>Lock box</option>
            </SelectField>
          ) : null}
          {needsEeeKey === "Yes" && accessMethod === "Lock box" ? (
            <Field
              hint="Enter n/a if there is no code."
              label="Lockbox Code"
              name="lockbox_code"
              required
            />
          ) : null}
          <TextareaField className="md:col-span-3" label="Access Instructions" name="access_instructions" />
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

function YesNoToggle({
  label,
  name,
  onChange,
  value,
  className,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  value: string;
  className?: string;
}) {
  return (
    <fieldset className={`block text-sm font-medium text-slate-700 ${className ?? ""}`}>
      <legend>{label}</legend>
      <div className="mt-1 grid h-10 grid-cols-2 rounded-md border border-line bg-white p-1">
        {["Yes", "No"].map((option) => (
          <label
            className={`flex cursor-pointer items-center justify-center rounded text-sm font-semibold transition ${
              value === option ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
            key={option}
          >
            <input
              checked={value === option}
              className="sr-only"
              name={name}
              onChange={() => onChange(option)}
              required
              type="radio"
              value={option}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
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
