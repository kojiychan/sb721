create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  phone text,
  company text,
  role text not null default 'agent' check (role in ('agent', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  agent_id uuid not null references public.profiles(id) on delete cascade,
  property_address text not null,
  city text not null,
  state text not null,
  zip text not null,
  number_of_units integer not null check (number_of_units > 0),
  property_type text not null,
  inspection_type text not null check (inspection_type in ('SB 721', 'SB 326', 'Not Sure')),
  estimated_eee_count integer,
  property_contact_name text not null,
  property_contact_phone text not null,
  property_contact_email text not null,
  occupancy_status text not null check (occupancy_status in ('Occupied', 'Vacant', 'Unknown')),
  lockbox_code text,
  access_instructions text,
  listing_agent text,
  buyer_agent text,
  escrow_closing_date date,
  listing_url text,
  notes text,
  status text not null default 'Order Received' check (
    status in (
      'Order Received',
      'Scheduling',
      'Scheduled',
      'Inspection Completed',
      'Report In Progress',
      'Report Ready',
      'Completed',
      'Cancelled'
    )
  ),
  inspection_date timestamptz,
  inspector_name text,
  inspector_email text,
  inspector_phone text,
  internal_notes text,
  report_storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists public.order_number_seq start 1001;

create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'SB-' || nextval('public.order_number_seq')::text;
  end if;
  return new;
end;
$$;

create trigger set_order_number_before_insert
before insert on public.orders
for each row execute function public.set_order_number();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    company,
    role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'company', ''),
    case when new.raw_user_meta_data->>'role' = 'admin' then 'admin' else 'agent' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Users can read own profile"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "Users can update own non-role profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create or replace function public.prevent_agent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role <> new.role and not public.is_admin() then
    raise exception 'Only admins can change profile roles.';
  end if;
  return new;
end;
$$;

create trigger prevent_agent_role_escalation_before_update
before update on public.profiles
for each row execute function public.prevent_agent_role_escalation();

create policy "Agents can read own orders"
on public.orders for select
using (agent_id = auth.uid() or public.is_admin());

create policy "Agents can create own orders"
on public.orders for insert
with check (
  agent_id = auth.uid()
  and status = 'Order Received'
  and inspection_date is null
  and inspector_name is null
  and inspector_email is null
  and inspector_phone is null
  and internal_notes is null
  and report_storage_path is null
);

create policy "Admins can update all orders"
on public.orders for update
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('inspection-reports', 'inspection-reports', false)
on conflict (id) do update set public = false;

create policy "Authenticated users can sign own report URLs"
on storage.objects for select
using (
  bucket_id = 'inspection-reports'
  and (
    public.is_admin()
    or exists (
      select 1 from public.orders
      where orders.report_storage_path = storage.objects.name
      and orders.agent_id = auth.uid()
    )
  )
);
