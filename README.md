
# PRIME - Centralized Academic Project Hub

A modern full-stack academic project management and collaboration platform built with **React + Supabase**.

## Overview

PRIME is now powered entirely by **Supabase** for backend services:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Authentication**: Supabase Auth with JWT tokens
- **Database**: PostgreSQL via Supabase
- **Real-time**: Supabase Realtime subscriptions (optional)

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (free at https://supabase.com)

### Step 1: Clone & Install

```bash
npm install
npm install @supabase/supabase-js
```

### Step 2: Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your API keys from **Settings** → **API**
3. Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Create Database Schema

See [**SUPABASE_SETUP.md**](./SUPABASE_SETUP.md) for complete SQL schema and test user setup.

### Step 4: Run

```bash
npm run dev
```

Open `http://localhost:5173`

**Test Credentials:**
- Email: `student1@university.edu` / Password: `student123`
- ✅ **User Authentication** - Supabase Auth with email/password
- ✅ **Project Management** - Create, share, and manage academic projects
- ✅ **Team Collaboration** - Add team members and track contributions
- ✅ **Access Control** - Request access to projects with approval workflow
- ✅ **Role-Based Access** - Student, Faculty, and Admin roles
- ✅ **Public/Private Projects** - Control project visibility
- ✅ **Admin Dashboard** - Manage users and access requests
- ✅ **Real-time Updates** - Powered by Supabase Realtime (optional)
- [**SUPABASE_SETUP.md**](./SUPABASE_SETUP.md) - Complete Supabase setup guide with SQL schema
- **Supabase Files:**
  - `src/lib/supabase.ts` - Supabase client & types
  - `src/lib/supabase-auth.tsx` - Auth context & hooks
  - `src/lib/supabase-api.ts` - API service layer

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Project Management**: Create, share, and manage academic projects
- **Team Collaboration**: Add team members and track contributions
- **Access Control**: Request access to projects with admin approval workflow
- **Role-Based Access**: Support for Student, Faculty, and Admin roles
- **Public/Private Projects**: Control project visibility
- **Admin Dashboard**: Manage users, projects, and access requests

## Project Structure

```
PRIME/
├── src/                           # React frontend
│   │   ├── Login.tsx              # Auth UI
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── ProjectCreation.tsx    # Create projects
│   │   └── ...other components
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── supabase-auth.tsx      # Auth context (NEW)
│   │   └── supabase-api.ts        # API layer (NEW)
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── .env.local                     # Supabase config (add this)
├── SUPABASE_SETUP.md              # Setup guide (NEW)
└── README.md
└── INTEGRATION_GUIDE.md           # Detailed setup & integration guide
```

## API Architecture

The frontend communicates with the Django REST API via:
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT directly with Supabase:
- **Auth**: Supabase Auth API
- **Database**: Supabase PostgreSQL API
- **Real-time**: Supabase Realtime API (optional)
- **Storage**: Supabase Storage (optional)

All database operations go through the `src/lib/supabase-api.ts` service layer which wraps Supabase queries.

### Key API Functions:
- `projectApi.listAllProjects()` - Get all public projects
- `projectApi.createProject(data)` - Create new project
- `projectApi.requestAccess(projectId)` - Request project access
- `accessRequestApi.listAccessRequests()` - Get access requests
- `userApi.getCurrentUser()` - Get current user profile

1. User enters credentials on Login page
2. Frontend sends POST request to `/api/token/` with email and password
3. Backend validates and returns JWT access token
4. Frontend stoemail and password on Login page
2. Frontend calls `auth.login()` or `auth.register()`
3. Supabase Auth validates credentials and returns JWT token
4. Frontend stores token in localStorage via Supabase client
5. All subsequent API requests automatically include the token
6. Supabase
**Frontend:**
```bash
npm run build
# Output in 'build' directory
```

**Backend:**dist' directory
```

**Deployment:**
1. Deploy to Vercel, Netlify, or your hosting provider
2. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Supabase handles backend automatically

Supabase is production-ready with:
- Auto-scaling PostgreSQL
- Built-in backups
- SSL encryption
- DDoS protection
### Frontend - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **@supabase/supabase-js** - Supabase client

### Backend (Supabase)
- **PostgreSQL** - Database
- **Supabase Auth** - Authentication
- **Row-Level Security** - Data privacy
- **Realtime** - Live updates (optionaldling
- **SQLite**: Database (development)

## Documentation

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Complete setup and integration guide
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete setup with SQL schema
- Visit [supabase.com/docs](https://supabase.com/docs) for Supabase documentation
## Troubleshooting

### CORS Errors
- Ensure both frontend (5173) and backend (8000) servers are running
- Ch"Missing Supabase environment variables"
- Ensure `.env.local` exists in project root (not backend folder)
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart dev server with `npm run dev`

### Login fails
- Check user exists in Supabase Auth (SQL Editor)
- Verify user profile was created in `users` table
- Check Row-Level Security policies are correct

### Can't see projects
- Verify project `status = 'public'` or you own it
- Check RLS policies in Supabase
- Test query directly in Supabase SQL Editor

### Network errors
- Frontend and SuFeature

1. **Database Change**: Update SQL in Supabase SQL Editor
2. **API Change**: Update `src/lib/supabase-api.ts`
3. **UI Change**: Update React component in `src/components/`
4. **Auth Change**: Update `src/lib/supabase-auth.tsx`

### Frontend Development

- Components in `src/components/`
- Use `useAuth()` hook for authentication
- Use API functions from `src/lib/supabase-api.ts`
- Styling with
- Components are in `src/components/`
- Use `useAuth()` hook for auth context
- Use API  & Support

This project is part of the PRIME initiative.

**Need Help?**
1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Visit [supabase.com/docs](https://supabase.com/docs)
3. Check browser console for errors
## Support

For detailed setup and troubleshooting, refer to [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).
  