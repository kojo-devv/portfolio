-- Portfolio CMS schema for Supabase
-- Run this in the Supabase SQL editor after creating your project.
-- Disable public sign-up in Authentication > Providers > Email.

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  short_description text not null,
  full_description text not null default '',
  tech_stack text[] not null default '{}',
  github_url text,
  live_demo_url text,
  featured boolean not null default false,
  display_order integer not null default 0,
  published boolean not null default false,
  featured_image_path text,
  gallery_image_paths text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Hero (singleton)
create table if not exists public.hero_content (
  id integer primary key default 1 check (id = 1),
  label text not null,
  headline text not null,
  supporting_paragraph text not null,
  primary_button_label text not null,
  primary_button_href text not null,
  secondary_button_label text not null,
  secondary_button_href text not null,
  featured_project_id uuid references public.projects(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- About (singleton)
create table if not exists public.about_content (
  id integer primary key default 1 check (id = 1),
  section_label text not null default 'About',
  heading text not null,
  body_paragraphs text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- About strength cards
create table if not exists public.about_strengths (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  display_order integer not null default 0
);

-- Projects section intro (singleton)
create table if not exists public.projects_section (
  id integer primary key default 1 check (id = 1),
  heading text not null default 'Featured Project',
  intro_paragraph text not null,
  updated_at timestamptz not null default now()
);

-- Contact (singleton)
create table if not exists public.contact_settings (
  id integer primary key default 1 check (id = 1),
  section_label text not null default 'Contact',
  heading text not null,
  intro_paragraph text not null,
  email text not null,
  linkedin text not null,
  github text not null,
  updated_at timestamptz not null default now()
);

-- Site settings (singleton)
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'David Dapaah',
  copyright_text text,
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger hero_content_updated_at
  before update on public.hero_content
  for each row execute function public.set_updated_at();

create trigger about_content_updated_at
  before update on public.about_content
  for each row execute function public.set_updated_at();

create trigger projects_section_updated_at
  before update on public.projects_section
  for each row execute function public.set_updated_at();

create trigger contact_settings_updated_at
  before update on public.contact_settings
  for each row execute function public.set_updated_at();

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.projects enable row level security;
alter table public.hero_content enable row level security;
alter table public.about_content enable row level security;
alter table public.about_strengths enable row level security;
alter table public.projects_section enable row level security;
alter table public.contact_settings enable row level security;
alter table public.site_settings enable row level security;

-- Public read policies
create policy "Public read published projects"
  on public.projects for select
  using (published = true);

create policy "Public read hero"
  on public.hero_content for select
  using (true);

create policy "Public read about"
  on public.about_content for select
  using (true);

create policy "Public read about strengths"
  on public.about_strengths for select
  using (true);

create policy "Public read projects section"
  on public.projects_section for select
  using (true);

create policy "Public read contact"
  on public.contact_settings for select
  using (true);

create policy "Public read site settings"
  on public.site_settings for select
  using (true);

-- Authenticated admin policies
create policy "Admin manage projects"
  on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin manage hero"
  on public.hero_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin manage about"
  on public.about_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin manage about strengths"
  on public.about_strengths for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin manage projects section"
  on public.projects_section for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin manage contact"
  on public.contact_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin manage site settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Admin upload project images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Admin update project images"
  on storage.objects for update
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Admin delete project images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Public read site assets"
  on storage.objects for select
  using (bucket_id = 'site-assets');

create policy "Admin upload site assets"
  on storage.objects for insert
  with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');

create policy "Admin update site assets"
  on storage.objects for update
  using (bucket_id = 'site-assets' and auth.role() = 'authenticated');

create policy "Admin delete site assets"
  on storage.objects for delete
  using (bucket_id = 'site-assets' and auth.role() = 'authenticated');

-- Seed data (matches current portfolio content)
insert into public.projects (
  slug, name, category, short_description, full_description, tech_stack,
  github_url, live_demo_url, featured, display_order, published
) values (
  'dapworth',
  'DapWorth',
  'Personal Finance Dashboard',
  'A modern budgeting dashboard designed to help families understand their finances, plan confidently, and build long-term wealth.',
  'A budgeting dashboard I designed and built to replace the spreadsheets my wife and I used to manage our household finances. It helps us budget, track expenses, monitor financial goals, and visualize our overall financial picture.

Full case study coming soon.',
  array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Cursor AI'],
  'https://github.com/daviddapaah',
  null,
  true,
  0,
  true
) on conflict (slug) do nothing;

insert into public.hero_content (
  id, label, headline, supporting_paragraph,
  primary_button_label, primary_button_href,
  secondary_button_label, secondary_button_href,
  featured_project_id
)
select
  1,
  'Building Practical Software with AI',
  'Building practical software that solves real problems.',
  'I''ve spent nearly 15 years helping people and organizations solve operational challenges. Today, I''m applying that same mindset to designing thoughtful UI/UX and building practical software with AI for families, nonprofits, and businesses.',
  'View My Work',
  '/#projects',
  'Get In Touch',
  '/#contact',
  p.id
from public.projects p
where p.slug = 'dapworth'
on conflict (id) do nothing;

insert into public.about_content (id, section_label, heading, body_paragraphs)
values (
  1,
  'About',
  'Solving Problems Through Software',
  array[
    'For nearly 15 years, I''ve worked in social services leading teams, managing programs, collaborating with community partners, and helping organizations deliver meaningful outcomes for the people they serve.',
    'That experience taught me how to think in systems by balancing people, processes, communication, and technology to solve complex problems and improve the way organizations operate.',
    'Today, I apply that same mindset to software by designing thoughtful digital experiences and building practical applications with AI that solve real world problems. Every project I create begins with understanding the problem before writing a single line of code.'
  ]
) on conflict (id) do nothing;

insert into public.about_strengths (title, description, display_order)
values
  ('15+ Years of Problem Solving', 'Experience leading teams, managing programs, and helping organizations solve complex real world challenges.', 0),
  ('AI Powered Development', 'Building modern software faster and more intelligently by combining AI tools with strong product thinking.', 1),
  ('UI/UX Design', 'Designing intuitive interfaces that prioritize usability, simplicity, and thoughtful user experiences.', 2),
  ('Next.js & Supabase', 'Developing scalable web applications using Next.js, TypeScript, Tailwind CSS, and Supabase.', 3)
on conflict do nothing;

insert into public.projects_section (id, heading, intro_paragraph)
values (
  1,
  'Featured Project',
  'A selection of software I''ve designed and built — focused on practical tools that solve real problems for families, nonprofits, and businesses.'
) on conflict (id) do nothing;

insert into public.contact_settings (
  id, section_label, heading, intro_paragraph, email, linkedin, github
) values (
  1,
  'Contact',
  'Let''s Build Something Great',
  'Whether you''re looking to hire me, collaborate on a project, or simply connect, I''d love to hear from you.',
  'hello@daviddapaah.com',
  'https://linkedin.com/in/daviddapaah',
  'https://github.com/daviddapaah'
) on conflict (id) do nothing;

insert into public.site_settings (id, site_name, copyright_text)
values (1, 'David Dapaah', null)
on conflict (id) do nothing;
