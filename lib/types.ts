import type { OrderStatus } from "@/lib/statuses";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: "agent" | "admin";
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  agent_id: string;
  property_address: string;
  city: string;
  state: string;
  zip: string;
  number_of_units: number;
  property_type: string;
  inspection_type: "SB 721" | "SB 326" | "Not Sure";
  estimated_eee_count: number | null;
  property_contact_name: string;
  property_contact_phone: string;
  property_contact_email: string;
  occupancy_status: string;
  lockbox_code: string | null;
  access_instructions: string | null;
  listing_agent: string | null;
  buyer_agent: string | null;
  escrow_closing_date: string | null;
  listing_url: string | null;
  notes: string | null;
  status: OrderStatus;
  inspection_date: string | null;
  inspector_name: string | null;
  inspector_email: string | null;
  inspector_phone: string | null;
  internal_notes: string | null;
  report_storage_path: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "first_name" | "last_name" | "email" | "company"> | null;
};
