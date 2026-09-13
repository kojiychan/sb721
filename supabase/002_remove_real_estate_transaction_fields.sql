-- Run after the deployment that removes the Real Estate Transaction section.
-- The app still uses escrow_closing_date as the stored Desired Completion Date.

alter table public.orders
  drop column if exists listing_agent,
  drop column if exists buyer_agent,
  drop column if exists listing_url;
