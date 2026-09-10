insert into public.profiles (id, first_name, last_name, email, phone, company, role)
values
  ('00000000-0000-0000-0000-000000000001', 'Avery', 'Morgan', 'avery@example.com', '(555) 100-1001', 'Harbor Realty', 'agent'),
  ('00000000-0000-0000-0000-000000000002', 'Jordan', 'Lee', 'jordan@example.com', '(555) 100-1002', 'Pacific HOA Group', 'agent'),
  ('00000000-0000-0000-0000-000000000003', 'Taylor', 'Reed', 'taylor@example.com', '(555) 100-1003', 'Summit Brokerage', 'agent'),
  ('00000000-0000-0000-0000-000000000010', 'Admin', 'User', 'admin@example.com', '(555) 100-1010', 'EEE Inspection Management', 'admin')
on conflict (id) do nothing;

insert into public.orders (
  order_number,
  agent_id,
  property_address,
  city,
  state,
  zip,
  number_of_units,
  property_type,
  inspection_type,
  estimated_eee_count,
  property_contact_name,
  property_contact_phone,
  property_contact_email,
  occupancy_status,
  access_instructions,
  listing_agent,
  buyer_agent,
  escrow_closing_date,
  listing_url,
  notes,
  status,
  inspection_date,
  inspector_name,
  inspector_email,
  inspector_phone
)
values
  ('SB-1001', '00000000-0000-0000-0000-000000000001', '1180 Cedar Terrace', 'Oakland', 'CA', '94610', 12, 'Apartment', 'SB 721', 18, 'Morgan Site Contact', '(555) 210-1001', 'site1@example.com', 'Occupied', 'Call manager on arrival.', 'Avery Morgan', 'Sam Patel', '2026-10-01', 'https://example.com/listing/1001', 'Escrow requests rapid scheduling.', 'Order Received', null, null, null, null),
  ('SB-1002', '00000000-0000-0000-0000-000000000001', '204 Baywalk Lane', 'Alameda', 'CA', '94501', 36, 'Multifamily', 'SB 721', 44, 'Riley Chen', '(555) 210-1002', 'site2@example.com', 'Occupied', 'Office has access keys.', 'Avery Morgan', null, null, null, null, 'Scheduling', null, null, null, null),
  ('SB-1003', '00000000-0000-0000-0000-000000000002', '77 Mission Ridge', 'San Francisco', 'CA', '94110', 24, 'Condominium / HOA', 'SB 326', 31, 'Dana Ortiz', '(555) 210-1003', 'site3@example.com', 'Occupied', 'HOA manager to escort.', 'Jordan Lee', null, '2026-10-15', null, null, 'Scheduled', '2026-09-18 10:00:00-07', 'Chris Nguyen', 'chris@example.com', '(555) 300-1003'),
  ('SB-1004', '00000000-0000-0000-0000-000000000002', '920 Palm Court', 'Pasadena', 'CA', '91101', 8, 'Mixed Use', 'Not Sure', 10, 'Elena Park', '(555) 210-1004', 'site4@example.com', 'Vacant', 'Lockbox at rear gate.', 'Jordan Lee', 'Mina Shah', '2026-09-29', null, null, 'Inspection Completed', '2026-09-12 09:30:00-07', 'Chris Nguyen', 'chris@example.com', '(555) 300-1003'),
  ('SB-1005', '00000000-0000-0000-0000-000000000003', '3100 Laurel Avenue', 'Long Beach', 'CA', '90807', 18, 'Apartment', 'SB 721', 22, 'Kai Brooks', '(555) 210-1005', 'site5@example.com', 'Occupied', null, 'Taylor Reed', null, null, null, 'Photos available on request.', 'Report In Progress', '2026-09-10 13:00:00-07', 'Maya Singh', 'maya@example.com', '(555) 300-1005'),
  ('SB-1006', '00000000-0000-0000-0000-000000000003', '16 Oceanview Walk', 'Santa Monica', 'CA', '90405', 6, 'Condominium / HOA', 'SB 326', 8, 'Noah Hayes', '(555) 210-1006', 'site6@example.com', 'Unknown', 'Tenant notice posted.', 'Taylor Reed', 'Iris Kim', '2026-09-25', 'https://example.com/listing/1006', null, 'Report Ready', '2026-09-08 11:00:00-07', 'Maya Singh', 'maya@example.com', '(555) 300-1005'),
  ('SB-1007', '00000000-0000-0000-0000-000000000001', '560 Granite Street', 'San Diego', 'CA', '92103', 20, 'Multifamily', 'SB 721', 28, 'Lena Walsh', '(555) 210-1007', 'site7@example.com', 'Occupied', null, 'Avery Morgan', null, null, null, null, 'Completed', '2026-08-29 10:30:00-07', 'Chris Nguyen', 'chris@example.com', '(555) 300-1003'),
  ('SB-1008', '00000000-0000-0000-0000-000000000002', '812 Maple Landing', 'Berkeley', 'CA', '94704', 4, 'Other', 'Not Sure', null, 'Owen Price', '(555) 210-1008', 'site8@example.com', 'Vacant', 'Gate code 7210.', 'Jordan Lee', null, null, null, null, 'Cancelled', null, null, null, null),
  ('SB-1009', '00000000-0000-0000-0000-000000000003', '1420 Westline Drive', 'Sacramento', 'CA', '95814', 16, 'Apartment', 'SB 721', 20, 'Priya Rao', '(555) 210-1009', 'site9@example.com', 'Occupied', 'Meet at leasing office.', 'Taylor Reed', null, null, null, null, 'Scheduled', '2026-09-22 14:00:00-07', 'Maya Singh', 'maya@example.com', '(555) 300-1005')
on conflict (order_number) do nothing;
