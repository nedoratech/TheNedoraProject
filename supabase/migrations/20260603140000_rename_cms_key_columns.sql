-- Rename columns named "key" — reserved for Supabase TypeScript client inference.
alter table public.cms_content_blocks rename column key to block_key;
alter table public.cms_feature_flags rename column key to flag_key;
alter table public.cms_media rename column key to media_key;
