-- "order" conflicts with Supabase TS client inference (sort API).
alter table public.cms_navigation rename column "order" to sort_order;

drop index if exists cms_navigation_location_locale_order_idx;
create index cms_navigation_location_locale_sort_order_idx
  on public.cms_navigation (location, locale, sort_order);
