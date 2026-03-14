# Supabase Setup Instructions (Start From Scratch)

This project uses Supabase for the production backend and authentication.
Follow these steps exactly to configure from a fresh environment.

## Prerequisites

- Node.js 16+
- npm or yarn
- Python 3.10+ (Django backend)
- Supabase account (https://supabase.com)

## Step 0: Clone repo and prepare local environment

```powershell
cd d:\PRIME\real
# create Python venv and activate
python -m venv .venv
& .venv\Scripts\Activate.ps1
pip install -U pip
pip install -r backend\requirements.txt

# install frontend dependencies
npm install
```

## Step 1: Configure Django backend

```powershell
cd backend
python manage.py migrate
python manage.py runserver
```

- Confirm Django is running at http://127.0.0.1:8000 (or as configured).

## Step 2: Create Supabase Project

1. Log in to Supabase and click **New Project**.
2. Set project name (e.g. `prime`), password, region.
3. Wait for initialization.

## Step 3: Save Supabase keys

1. In project dashboard: **Settings  API**.
2. Copy `Project URL` and `anon public` key.
3. Create `.env.local` in repo root with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Database schema in Supabase (SQL Editor)

Supabase uses `auth.users` plus app tables. Run this exact SQL script in Supabase SQL Editor:

```sql
-- 1. Ensure uuid extension (only once)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. users table (app profile extension)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT,
  domains JSONB DEFAULT '[]',
  year TEXT,
  license TEXT,
  tech_stack JSONB DEFAULT '[]',
  status TEXT DEFAULT 'public' CHECK (status IN ('public', 'locked', 'approved')),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  approved_faculty_ids JSONB DEFAULT '[]',
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contribution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, email)
);

-- 5. access_requests table
CREATE TABLE IF NOT EXISTS public.access_requests (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, faculty_id)
);

-- 6. rls policies create if needed (same as existing script included in app flow)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Recommended: Add your own row-level policies through dashboard, or use the existing policy script from code.

```

## Step 5: Add Supabase test accounts via Auth panel

1. In Supabase dashboard, go to **Authentication  Users**.
2. Add users with these credentials:
   - student: `jerrybernard2005@gmail.com` / `student123`
   - faculty: `faculty1@university.edu` / `faculty123`
   - admin: `admin@university.edu` / `admin123`

3. After creation, run in SQL editor to mirror into app users table:

```sql
INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, 'Jerry Bernard', 'student' FROM auth.users WHERE email='jerrybernard2005@gmail.com';

INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, 'Jane Faculty', 'faculty' FROM auth.users WHERE email='faculty1@university.edu';

INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, 'Admin User', 'admin' FROM auth.users WHERE email='admin@university.edu';
```

## Step 6: Run front-end

```powershell
npm run dev
```

Open the shown URL (e.g. http://localhost:5173).

## Step 7: Test flow

- signup/login works via Supabase auth
- projects can be created from dashboard
- access requests are managed as expected

## Notes

- Do not use `public.profiles` (this app uses `public.users`).
- On Windows, ensure `.venv` is in `.gitignore` and not tracked.
- For solver around `22P02` uuid errors: always use valid UUID format (e.g. `gen_random_uuid()`) for `id` fields.
