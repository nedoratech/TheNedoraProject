-- ─────────────────────────────────────────────────────────────────────────────
-- 002: microCMS tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Pages -----------------------------------------------------------------------
create table public.cms_pages (
  id         uuid primary key default uuid_generate_v4(),
  slug       text not null,
  locale     text not null default 'en',
  title      text,
  published  boolean not null default false,
  meta_title text,
  meta_desc  text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

-- Content blocks --------------------------------------------------------------
create table public.cms_content_blocks (
  id         uuid primary key default uuid_generate_v4(),
  page_slug  text not null,
  key        text not null,           -- e.g. 'hero.heading'
  locale     text not null default 'en',
  value      text,
  type       text not null default 'text'
               check (type in ('text', 'html', 'markdown', 'image_url', 'json')),
  updated_at timestamptz not null default now(),
  unique (page_slug, key, locale)
);

-- Feature flags ---------------------------------------------------------------
create table public.cms_feature_flags (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,   -- e.g. 'locale.ro.enabled'
  enabled     boolean not null default false,
  description text,
  updated_at  timestamptz not null default now()
);

-- Navigation ------------------------------------------------------------------
create table public.cms_navigation (
  id       uuid primary key default uuid_generate_v4(),
  location text not null,            -- 'main' | 'footer_company' | 'footer_connect' | 'footer_products'
  label    text not null,
  href     text not null,
  locale   text not null default 'en',
  "order"  integer not null default 0,
  visible  boolean not null default true
);

-- Media -----------------------------------------------------------------------
create table public.cms_media (
  id           uuid primary key default uuid_generate_v4(),
  key          text unique not null,  -- e.g. 'hero.image'
  storage_path text not null,
  alt_text     text,
  uploaded_at  timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.cms_pages            enable row level security;
alter table public.cms_content_blocks   enable row level security;
alter table public.cms_feature_flags    enable row level security;
alter table public.cms_navigation       enable row level security;
alter table public.cms_media            enable row level security;

-- Public reads (landing page fetches CMS over anon key)
create policy "CMS pages: public read published"
  on cms_pages for select using (published = true);

create policy "CMS blocks: public read"
  on cms_content_blocks for select using (true);

create policy "CMS flags: public read"
  on cms_feature_flags for select using (true);

create policy "CMS nav: public read visible"
  on cms_navigation for select using (visible = true);

create policy "CMS media: public read"
  on cms_media for select using (true);

-- Authenticated users (microCMS admin) can do everything
create policy "CMS pages: auth full access"
  on cms_pages for all using (auth.role() = 'authenticated');

create policy "CMS blocks: auth full access"
  on cms_content_blocks for all using (auth.role() = 'authenticated');

create policy "CMS flags: auth full access"
  on cms_feature_flags for all using (auth.role() = 'authenticated');

create policy "CMS nav: auth full access"
  on cms_navigation for all using (auth.role() = 'authenticated');

create policy "CMS media: auth full access"
  on cms_media for all using (auth.role() = 'authenticated');
