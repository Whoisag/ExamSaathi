-- ==============================================================================
-- ExamSaathi Complete Postgres Schema & Security Policies
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- 1. PROFILES (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  target_exam text default 'jee-main',
  target_year int default 2026,
  preferred_exams text[] default '{"jee-main"}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. EXAMS
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,  -- 'JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'CBSE_12', 'CBSE_10', 'CUET'
  slug text not null unique,  -- 'jee-main', 'jee-advanced', 'neet', 'cbse-12', 'cbse-10', 'cuet'
  name text not null,
  conductor text,
  description text,
  total_marks int default 300,
  duration_minutes int default 180,
  format jsonb default '{"sections": ["Physics", "Chemistry", "Mathematics"]}',
  created_at timestamptz default now()
);

-- 3. CHAPTERS (per exam)
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references public.exams(id) on delete cascade,
  exam_slug text not null references public.exams(slug) on delete cascade,
  code text not null,  -- e.g. 'modern-physics', 'phy-kinematics'
  name text not null,
  subject text not null check (subject in ('physics', 'chemistry', 'mathematics', 'biology')),
  ncert_chapter_number int,
  syllabus_weight numeric default 1.0,
  created_at timestamptz default now(),
  unique(exam_slug, code)
);

-- 4. TOPICS (per chapter)
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  name text not null,
  subtopic_order int default 1,
  syllabus_weight numeric default 1.0,
  created_at timestamptz default now()
);

-- 5. SAVED ANALYSES (user dashboard results & historical runs)
create table if not exists public.saved_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id uuid references public.exams(id),
  exam_slug text references public.exams(slug),
  chapter_id uuid references public.chapters(id),
  chapter_ids uuid[] default '{}',
  analysis_data jsonb not null,  -- {pieData, trends, expectedCounts, gaps}
  analysis_json jsonb,          -- alias for backwards compatibility
  created_at timestamptz default now()
);

-- 6. ASSISTANT MESSAGES (chat history persistence)
create table if not exists public.assistant_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid default gen_random_uuid(),
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  analysis_id uuid references public.saved_analyses(id) on delete set null,
  created_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.chapters enable row level security;
alter table public.topics enable row level security;
alter table public.saved_analyses enable row level security;
alter table public.assistant_messages enable row level security;

-- Profiles policies
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Exams / Chapters / Topics: Public read for all users
drop policy if exists "public read exams" on public.exams;
create policy "public read exams" on public.exams
  for select using (true);

drop policy if exists "public read chapters" on public.chapters;
create policy "public read chapters" on public.chapters
  for select using (true);

drop policy if exists "public read topics" on public.topics;
create policy "public read topics" on public.topics
  for select using (true);

-- Saved Analyses: Owner CRUD only
drop policy if exists "owner crud analyses" on public.saved_analyses;
create policy "owner crud analyses" on public.saved_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Assistant Messages: Owner CRUD only
drop policy if exists "owner crud messages" on public.assistant_messages;
create policy "owner crud messages" on public.assistant_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==============================================================================
-- AUTH USER PROFILE CREATION TRIGGER
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, target_exam)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'target_exam',
      new.raw_user_meta_data->>'exam_preference',
      'jee-main'
    )
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
