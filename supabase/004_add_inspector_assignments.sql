alter table public.orders
add column if not exists inspector_id uuid references public.profiles(id) on delete set null;

drop policy if exists "Inspectors can read open and assigned orders" on public.orders;

create policy "Inspectors can read open and assigned orders"
on public.orders for select
using (
  public.is_admin()
  or (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'inspector'
    )
    and (
      inspector_id = auth.uid()
      or (
        inspector_id is null
        and inspector_name is null
        and inspector_email is null
        and inspector_phone is null
        and status not in ('Completed', 'Cancelled')
      )
    )
  )
);
