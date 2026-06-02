-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: default CMS content for the landing page (EN + RO)
-- Run with: yarn db:reset  (applies all migrations then this file)
-- ─────────────────────────────────────────────────────────────────────────────

-- Feature flags ---------------------------------------------------------------
insert into public.cms_feature_flags (flag_key, enabled, description) values
  ('locale.en.enabled',          true,  'English language (default)'),
  ('locale.ro.enabled',          true,  'Romanian language'),
  ('section.trust_bar.visible',  true,  'Industry sectors strip below hero'),
  ('section.products.visible',   false, 'Products section — enable when NedAI launches'),
  ('section.stats.visible',      true,  'Stats row in hero (10+, 40+, 90%)'),
  ('contact.newsletter_opt_in',  true,  'Newsletter opt-in checkbox on contact form'),
  ('contact.phone_field',        false, 'Phone number field on contact form'),
  ('nedai.early_access',         false, 'NedAI early access waitlist'),
  ('nedai.pricing_visible',      false, 'NedAI pricing section')
on conflict (flag_key) do update set enabled = excluded.enabled;

-- Pages -----------------------------------------------------------------------
insert into public.cms_pages (slug, locale, title, published) values
  ('landing', 'en', 'Nedora — Enterprise Software, Built with Intent', true),
  ('landing', 'ro', 'Nedora — Software Enterprise, Construit cu Intenție', true),
  ('privacy', 'en', 'Privacy Policy', true)
on conflict (slug, locale) do nothing;

-- Landing page content blocks (EN) -------------------------------------------
insert into public.cms_content_blocks (page_slug, block_key, locale, value) values
  -- Hero
  ('landing','hero.eyebrow',       'en', 'Enterprise Software · Bucharest, Romania'),
  ('landing','hero.heading',       'en', 'Enterprise software, built for the way your business actually works.'),
  ('landing','hero.subheading',    'en', 'Nedora designs and delivers mission-critical applications and integrations for organisations that can''t afford guesswork. Fixed-scope certainty when requirements are clear. Flexible partnership when the roadmap is still taking shape.'),
  ('landing','hero.cta_primary',   'en', 'Request an offer'),
  ('landing','hero.cta_secondary', 'en', 'See how we work'),
  -- Stats
  ('landing','stats.years_value',     'en', '10+'),
  ('landing','stats.years_label',     'en', 'Years in enterprise software'),
  ('landing','stats.projects_value',  'en', '40+'),
  ('landing','stats.projects_label',  'en', 'Projects delivered'),
  ('landing','stats.retention_value', 'en', '90%'),
  ('landing','stats.retention_label', 'en', 'Client retention rate'),
  -- Trust bar
  ('landing','trust_bar.label', 'en', 'Trusted by'),
  -- Commitments
  ('landing','commitments.label',       'en', 'What you can count on'),
  ('landing','commitments.title',       'en', 'Six commitments on every engagement.'),
  ('landing','commitments.description', 'en', 'Enterprise software fails most often not because of bad code, but because of misaligned expectations, vanishing vendors, and commitments nobody wrote down.'),
  -- Process
  ('landing','process.label',       'en', 'Process'),
  ('landing','process.title',       'en', 'Four phases from first conversation through launch.'),
  ('landing','process.description', 'en', 'Clear milestones and shared documentation at every step. No verbal estimates, no surprise invoices.'),
  -- Engagement
  ('landing','engagement.label',       'en', 'Engagement models'),
  ('landing','engagement.title',       'en', 'Choose the model that matches your certainty of scope.'),
  ('landing','engagement.description', 'en', 'Many clients begin with a time-based discovery to sharpen requirements, then move to fixed-scope delivery for the build.'),
  ('landing','engagement.note',        'en', 'Not sure which model fits? Start with a discovery call — we''ll help you choose the structure that gives you the most confidence at each stage.'),
  -- Contact form
  ('landing','contact.title',       'en', 'Request an offer'),
  ('landing','contact.description', 'en', 'Tell us about your project. We typically respond within two business days.'),
  ('landing','contact.legal_text',  'en', 'By submitting this form you agree that Nedora may process your data to respond to your enquiry.'),
  -- Footer
  ('landing','footer.tagline',   'en', 'Nedora designs and delivers enterprise-grade applications and integrations for businesses that need software built with intent.'),
  ('landing','footer.copyright', 'en', '© Nedora · 2026. All rights reserved.')
on conflict (page_slug, block_key, locale) do update set value = excluded.value;

-- Landing page content blocks (RO) -------------------------------------------
insert into public.cms_content_blocks (page_slug, block_key, locale, value) values
  ('landing','hero.eyebrow',       'ro', 'Software Enterprise · București, România'),
  ('landing','hero.heading',       'ro', 'Software enterprise construit pentru felul în care afacerea ta funcționează cu adevărat.'),
  ('landing','hero.subheading',    'ro', 'Nedora proiectează și livrează aplicații și integrări critice pentru organizații care nu-și pot permite improvizații.'),
  ('landing','hero.cta_primary',   'ro', 'Solicită o ofertă'),
  ('landing','hero.cta_secondary', 'ro', 'Cum lucrăm'),
  ('landing','stats.years_label',     'ro', 'Ani în software enterprise'),
  ('landing','stats.projects_label',  'ro', 'Proiecte livrate'),
  ('landing','stats.retention_label', 'ro', 'Rată de retenție clienți'),
  ('landing','footer.copyright',   'ro', '© Nedora · 2026. Toate drepturile rezervate.')
on conflict (page_slug, block_key, locale) do update set value = excluded.value;

-- Navigation ------------------------------------------------------------------
insert into public.cms_navigation (location, label, href, locale, sort_order) values
  ('main', 'Solutions',   '#solutions',  'en', 1),
  ('main', 'Why Nedora',  '#why',        'en', 2),
  ('main', 'Process',     '#process',    'en', 3),
  ('main', 'Engagement',  '#engagement', 'en', 4),
  ('main', 'Soluții',     '#solutions',  'ro', 1),
  ('main', 'De ce Nedora','#why',        'ro', 2),
  ('main', 'Proces',      '#process',    'ro', 3),
  ('main', 'Angajament',  '#engagement', 'ro', 4),
  ('footer_company', 'Solutions',  '#solutions',  'en', 1),
  ('footer_company', 'Why Nedora', '#why',        'en', 2),
  ('footer_company', 'Process',    '#process',    'en', 3),
  ('footer_company', 'Engagement', '#engagement', 'en', 4),
  ('footer_connect', 'Request an offer', '#contact',                        'en', 1),
  ('footer_connect', 'LinkedIn',         'https://linkedin.com/company/nedora-tech', 'en', 2),
  ('footer_connect', 'Privacy Policy',   '/privacy',                        'en', 3),
  ('footer_products', 'NedAI', '/nedai', 'en', 1)
on conflict do nothing;
