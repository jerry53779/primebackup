# Migration from Django to Supabase

This document explains the transition from Django REST API backend to Supabase.

## What Changed?

### Before (Django Stack)
```
Frontend (React) ← HTTP Calls → Django REST API ← Django ORM → SQLite
```

**Files used:**
- `src/lib/auth.tsx` - JWT token management
- `src/lib/api.ts` - Axios HTTP client
- `vite.config.ts` - Proxy to Django backend
- `backend/` folder - Django application

### After (Supabase Stack)
```
Frontend (React) ← Direct API → Supabase Auth + PostgreSQL
```

**Files used:**
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/supabase-auth.tsx` - Supabase Auth context
- `src/lib/supabase-api.ts` - Supabase query functions
- `.env.local` - Supabase credentials

## Key Differences

| Feature | Django | Supabase |
|---------|--------|----------|
| **Authentication** | Custom JWT | Supabase Auth |
| **Database** | SQLite/PostgreSQL | PostgreSQL |
| **API Layer** | Django REST Framework | Supabase JS SDK |
| **Hosting** | Self-hosted server | Managed cloud |
| **Security** | Manual JWT handling | Built-in JWT tokens |
| **RLS** | Django Permissions | SQL-based RLS |
| **Real-time** | Polling/Websockets | Built-in Realtime |
| **Scaling** | Need DevOps | Auto-scaling |

## Migration Steps Done ✅

1. **Created Supabase Files:**
   - ✅ `src/lib/supabase.ts` - Client + types
   - ✅ `src/lib/supabase-auth.tsx` - Auth context
   - ✅ `src/lib/supabase-api.ts` - API layer

2. **Updated Frontend Code:**
   - ✅ `src/main.tsx` - Use AuthProvider from supabase-auth
   - ✅ `src/App.tsx` - Use Supabase API and Auth
   - ✅ `src/components/Login.tsx` - Use Supabase Auth
   - ✅ `package.json` - Add @supabase/supabase-js
   - ✅ `vite.config.ts` - Remove Django proxy

3. **Created Configuration:**
   - ✅ `.env.local` - Template for Supabase keys
   - ✅ `SUPABASE_SETUP.md` - Complete setup guide
   - ✅ `README.md` - Updated for Supabase

## What About Django?

The `backend/` folder is **no longer needed** but kept for reference. You can:

- ✅ Keep it for historical reference
- ✅ Delete it if not needed
- ✅ Use for other projects

Django backend will no longer run and is not required.

## Database Migration

If you were using the Django SQLite database:

1. **Export data** (optional, only if you had real data):
   ```bash
   python manage.py dumpdata > backup.json
   ```

2. **Set up Supabase** following [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

3. **No need to import** - Start fresh with test users in Supabase

## Testing the Migration

### Before Django Setup
```bash
npm install
npm run dev
```

### After Supabase Setup
```bash
# 1. Add .env.local with Supabase keys
# 2. Run schema SQL in Supabase
npm install
npm run dev
# Login at http://localhost:5173
```

## File Mapping

### Authentication
- **Before:** `src/lib/auth.tsx` + `src/lib/api.ts`
- **After:** `src/lib/supabase-auth.tsx` + `src/lib/supabase.ts`

### API Calls
- **Before:** `projectApi.listAllProjects()` from `src/lib/api.ts`
- **After:** `projectApi.listAllProjects()` from `src/lib/supabase-api.ts`

### User Context
- **Before:** `useAuth()` from `src/lib/auth.tsx`
- **After:** `useAuth()` from `src/lib/supabase-auth.tsx`

## Environment Setup

### Django (No Longer Used)
```
backend/
├── .venv/
├── manage.py
└── requirements.txt
```

### Supabase (New)
```
.env.local  ← Add these two
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

## Why Supabase?

✅ **Simpler**: No server to maintain
✅ **Faster**: Built on PostgreSQL, not SQLite
✅ **Scalable**: Auto-scales with usage
✅ **Secure**: Enterprise-grade security
✅ **Real-time**: Built-in Realtime API
✅ **Free tier**: Great for development
✅ **Less code**: No Django boilerplate needed

## Troubleshooting

### Django folder still there?
- It's fine - won't interfere
- Delete if you want to clean up

### Old Django API calls throwing errors?
- Check you're importing from `src/lib/supabase-api.ts`
- Not from old `src/lib/api.ts`

### Supabase auth not working?
- Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Verify `.env.local` has correct keys
- Create test users in Supabase Auth

## Future Improvements

With Supabase, you can now easily add:
- 📸 File uploads (Supabase Storage)
- ⚡ Real-time collaboration (Supabase Realtime)
- 📧 Email notifications (Supabase Functions)
- 🔔 Push notifications (Supabase Webhooks)
- 🗓️ Scheduled jobs (Supabase Cron)

All without writing backend code!

## Questions?

- 📚 Supabase Docs: https://supabase.com/docs
- 🚀 Supabase Examples: https://github.com/supabase/supabase/tree/master/examples
- 💬 Supabase Discord: https://discord.supabase.com
