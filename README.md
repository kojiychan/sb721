# SB 721 / SB 326 Inspection Portal

Polished MVP web app for an inspection management company. Agents can create accounts, submit inspection orders, track status, and download completed reports. Admins can process orders, schedule inspections, assign inspector contact details, and upload final PDF reports.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage

## Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_admin_storage_uploads
```

`SUPABASE_SERVICE_ROLE_KEY` is used only by the admin report upload server action.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/001_initial_schema.sql` in the SQL editor.
3. Confirm the private `inspection-reports` storage bucket exists.
4. Optionally run `supabase/seed.sql` after creating matching development auth users, or remove the profile foreign key temporarily for local-only mock data.

## Create an Admin User

1. Sign up through `/signup`.
2. In Supabase SQL editor, run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

Admins can access `/admin`, `/admin/orders`, `/admin/orders/[id]`, and `/admin/agents`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database Tables

- `profiles`: one row per Supabase auth user, with `agent` or `admin` role.
- `orders`: inspection order details, workflow status, scheduling data, inspector assignment, admin notes, and secure report path.

## RLS Policies

- Agents can read only their own profile and own orders.
- Agents can create orders only for themselves with default agent-managed fields.
- Agents cannot update status, inspection date, inspector fields, internal notes, or report paths.
- Admins can read profiles and all orders.
- Admins can update all orders.
- Report files live in a private bucket and are downloaded through signed URLs only.

## Seed Data

`supabase/seed.sql` includes 3 sample agents, 1 admin profile, and 9 sample orders across the workflow statuses. Because `profiles.id` references `auth.users`, create matching auth users first or adapt the seed for your local Supabase auth setup.
