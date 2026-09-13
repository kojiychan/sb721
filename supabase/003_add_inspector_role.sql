alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check check (role in ('agent', 'inspector', 'admin'));

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
    case
      when new.raw_user_meta_data->>'role' = 'admin' then 'admin'
      when new.raw_user_meta_data->>'role' = 'inspector' then 'inspector'
      else 'agent'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
