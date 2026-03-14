# Supabase Setup Instructions

This project uses **Supabase** as the backend instead of Django. Follow these steps to set up and run the application.

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account (free at https://supabase.com)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - Project name: `PRIME`
   - Database password: Create a strong password
   - Region: Choose closest to you
4. Wait for project to be created

## Step 2: Get Your Supabase Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Step 3: Create Database Schema

In Supabase SQL Editor, run these commands to create tables:

```sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
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
  team_members JSONB DEFAULT '[]',
  approved_faculty_ids JSONB DEFAULT '[]',
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contribution TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, email)
);

-- Create access_requests table
CREATE TABLE IF NOT EXISTS public.access_requests (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, faculty_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_faculty ON public.access_requests(faculty_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_project ON public.access_requests(project_id);

-- Create trigger function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, '', 'student')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to run when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
CREATE POLICY "Users can create their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

   
-- Create RLS policies for projects table
DROP POLICY IF EXISTS "Anyone can view public projects" ON public.projects;
CREATE POLICY "Anyone can view public projects"
  ON public.projects
  FOR SELECT
  USING (status = 'public' OR owner_id = auth.uid() OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
CREATE POLICY "Users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Project owners can update their projects" ON public.projects;
CREATE POLICY "Project owners can update their projects"
  ON public.projects
  FOR UPDATE
  USING (owner_id = auth.uid() OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Create RLS policies for access_requests table
DROP POLICY IF EXISTS "Users can view access requests they made or received" ON public.access_requests;
CREATE POLICY "Users can view access requests they made or received"
  ON public.access_requests
  FOR SELECT
  USING (
    faculty_id = auth.uid() OR
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create access requests" ON public.access_requests;
CREATE POLICY "Users can create access requests"
  ON public.access_requests
  FOR INSERT
  WITH CHECK (auth.uid() = faculty_id);

DROP POLICY IF EXISTS "Project owners can update access requests" ON public.access_requests;
CREATE POLICY "Project owners can update access requests"
  ON public.access_requests
  FOR UPDATE
  USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  );

-- Create RLS policies for team_members table
DROP POLICY IF EXISTS "Anyone can view team members" ON public.team_members;
CREATE POLICY "Anyone can view team members"
  ON public.team_members
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create team members" ON public.team_members;
CREATE POLICY "Users can create team members"
  ON public.team_members
  FOR INSERT
  WITH CHECK (true);

```

## Step 4: Create Test Users

In Supabase **Auth** section:
1. Click "Add User"
2. Create users:

### User 1: Student
- Email: `jerrybernard2005@gmail.com`
- Password: `student123`

Then in **SQL Editor**, run:
```sql
INSERT INTO public.users (id, email, full_name, role) 
SELECT id, email, 'Jerry Bernard', 'student' 
FROM auth.users 
WHERE email = 'jerrybernard2005@gmail.com';
```

### User 2: Faculty
- Email: `faculty1@university.edu`
- Password: `faculty123`

Then in **SQL Editor**, run:
```sql
INSERT INTO public.users (id, email, full_name, role) 
SELECT id, email, 'Jane Faculty', 'faculty' 
FROM auth.users 
WHERE email = 'faculty1@university.edu';
```

### User 3: Admin
- Email: `admin@university.edu`
- Password: `admin123`

Then in **SQL Editor**, run:
```sql
INSERT INTO public.users (id, email, full_name, role) 
SELECT id, email, 'Admin User', 'admin' 
FROM auth.users 
WHERE email = 'admin@university.edu';
```

## Step 5: Configure Frontend

Create `.env.local` file in **project root** (not backend folder):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual keys from Step 2.

## Step 6: Update Frontend Code

The frontend is already set up to use Supabase. Files to use:

- **Authentication**: `src/lib/supabase-auth.tsx` (use instead of `src/lib/auth.tsx`)
- **API Calls**: `src/lib/supabase-api.ts` (use instead of `src/lib/api.ts`)
- **Supabase Client**: `src/lib/supabase.ts`

Update `src/main.tsx`:
```typescript
import { AuthProvider } from './lib/supabase-auth'  // Changed

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

Update `src/App.tsx`:
```typescript
import { useAuth } from './lib/supabase-auth'  // Changed
import { projectApi, accessRequestApi } from './lib/supabase-api'  // Changed
```

## Step 7: Install Dependencies

```bash
npm install
npm install @supabase/supabase-js
```

## Step 8: Run the Application

```bash
npm run dev
```

Open `http://localhost:5173` and login with test credentials:
- Student: `student1@university.edu` / `student123`
- Faculty: `faculty1@university.edu` / `faculty123`
- Admin: `admin@university.edu` / `admin123`

## 🎉 You're Done!

Your PRIME application is now running with Supabase as the entire backend! 

## Key Features with Supabase

- ✅ Authentication (Supabase Auth)
- ✅ Database (PostgreSQL)
- ✅ Real-time updates (Supabase Realtime)
- ✅ Row-level security
- ✅ File storage (optional)
- ✅ And more!

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart dev server after adding `.env.local`

### Login fails
- Verify user exists in Supabase Auth
- Check user profile was created in `users` table
- Check RLS policies are correct

### Can't see data
- Verify RLS policies allow your user
- Check user has correct role
- Test query directly in Supabase SQL Editor

## Next Steps

1. Add profile images (Supabase Storage)
2. Enable real-time updates (Supabase Realtime)
3. Add email notifications
4. Deploy to Vercel + Supabase
