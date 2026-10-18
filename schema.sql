-- Run in Supabase Dashboard > SQL Editor.
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, description text, icon text, sort_order int default 0);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null, summary text not null, body text not null default '',
  cover_url text, cover_alt text,
  category_id uuid references public.categories(id) on delete set null,
  author_name text not null, status text not null default 'draft' check (status in ('draft','published')),
  is_featured boolean default false, reading_minutes int default 5,
  seo_title text, seo_description text,
  published_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create index on public.articles (status, published_at desc);

create table public.tags (id uuid primary key default gen_random_uuid(), name text unique not null);
create table public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade, primary key (article_id, tag_id));

create table public.article_references (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  citation text not null, url text, sort_order int default 0);

create table public.site_content (key text primary key, value jsonb not null, updated_at timestamptz default now());
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 5 and 4000),
  created_at timestamptz default now());

create or replace function public.touch() returns trigger language plpgsql as
$$ begin new.updated_at = now(); return new; end $$;
create trigger articles_touch before update on public.articles for each row execute function public.touch();

insert into public.categories (slug,name,description,icon,sort_order) values
 ('oncology','Oncology and Cancer Awareness','Understanding cancer, risk and care.','ribbon',1),
 ('diabetes','Diabetes Mellitus','Blood sugar, monitoring and daily management.','droplet',2),
 ('hypertension','Hypertension','Blood pressure and heart health.','heart-pulse',3),
 ('asthma','Asthma','Triggers, inhalers and control.','wind',4),
 ('screening','Cancer Prevention and Screening','Finding cancer early, lowering risk.','scan-search',5),
 ('prevention','Healthy Living and Disease Prevention','Habits that protect long-term health.','leaf',6);

-- Row Level Security
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.tags enable row level security;
alter table public.article_tags enable row level security;
alter table public.article_references enable row level security;
alter table public.site_content enable row level security;
alter table public.messages enable row level security;

create policy "admins read self" on public.admins for select to authenticated using (user_id = auth.uid());
create policy "public read categories" on public.categories for select using (true);
create policy "admin write categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read published" on public.articles for select using (status = 'published');
create policy "admin all articles" on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read tags" on public.tags for select using (true);
create policy "admin write tags" on public.tags for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read article_tags" on public.article_tags for select using (exists (select 1 from public.articles a where a.id = article_id and a.status = 'published'));
create policy "admin write article_tags" on public.article_tags for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read refs" on public.article_references for select using (exists (select 1 from public.articles a where a.id = article_id and a.status = 'published'));
create policy "admin write refs" on public.article_references for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public read site_content" on public.site_content for select using (true);
create policy "admin write site_content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone sends message" on public.messages for insert to anon, authenticated with check (true);
create policy "admin reads messages" on public.messages for select to authenticated using (public.is_admin());
create policy "admin deletes messages" on public.messages for delete to authenticated using (public.is_admin());

-- Storage: public bucket for images; only admins may write.
insert into storage.buckets (id, name, public) values ('media','media',true) on conflict do nothing;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
