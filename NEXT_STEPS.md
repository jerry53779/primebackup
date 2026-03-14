# 🚀 Next Steps - Supabase Setup

Your PRIME application is now ready to use **Supabase** as the entire backend! Follow these steps to get it running.

## ✅ What Was Updated

Your React application has been fully converted to use Supabase:

1. **Created 3 new files:**
   - `src/lib/supabase.ts` - Supabase client & types
   - `src/lib/supabase-auth.tsx` - Authentication context
   - `src/lib/supabase-api.ts` - API service layer

2. **Updated React components:**
   - `src/main.tsx` - Now uses AuthProvider
   - `src/App.tsx` - Uses Supabase API & Auth
   - `src/components/Login.tsx` - Supabase authentication

3. **Configuration files:**
   - `package.json` - Added @supabase/supabase-js
   - `.env.local` - Template for Supabase keys
   - `.gitignore` - Updated with environment files
   - `vite.config.ts` - Removed Django proxy

4. **Documentation:**
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete setup guide
   - [README.md](./README.md) - Updated for Supabase
   - [MIGRATION_DJANGO_TO_SUPABASE.md](./MIGRATION_DJANGO_TO_SUPABASE.md) - Migration details

---

## 🔧 Setting Up Supabase (5 minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up (free tier available!)
3. Click "New Project"
4. Fill in project details and wait for creation

### Step 2: Get Your Keys
1. Go to **Settings** → **API**
2. Copy these:
   - `Project URL` → Save as `VITE_SUPABASE_URL`
   - `anon public` key → Save as `VITE_SUPABASE_ANON_KEY`

### Step 3: Create Database Schema
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire SQL from: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) (Schema section)
4. Paste and click **Run**

### Step 4: Create Test Users
1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User** and create 3 test users:
   - `student1@university.edu` / `student123`
   - `faculty1@university.edu` / `faculty123`
   - `admin@university.edu` / `admin123`

3. After each user creation, run in **SQL Editor**:
```sql
INSERT INTO public.users (id, email, full_name, role) 
SELECT id, email, 'Full Name Here', 'student' 
FROM auth.users 
WHERE email = 'student1@university.edu'
LIMIT 1;
```

### Step 5: Update `.env.local`
Create/update `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here_paste_from_supabase
```

**⚠️ Important:** Replace with your actual values!

### Step 6: Install & Run
```bash
# Install Supabase package
npm install @supabase/supabase-js

# Start development server
npm run dev
```

Open `http://localhost:5173` and login with test credentials.

---

## 📝 File Structure

New structure without Django:

```
PRIME/
├── src/
│   ├── lib/
│   │   ├── supabase.ts          ← Supabase client
│   │   ├── supabase-auth.tsx    ← Auth context (NEW)
│   │   ├── supabase-api.ts      ← API layer (NEW)
│   │   └── ...other files
│   ├── components/              ← React components
│   ├── App.tsx                  ← Updated to use Supabase
│   └── main.tsx                 ← Updated to use AuthProvider
├── .env.local                   ← ADD THIS (Supabase keys)
├── package.json                 ← Updated with @supabase/supabase-js
├── vite.config.ts               ← Removed Django proxy
├── SUPABASE_SETUP.md            ← Setup guide
├── README.md                    ← Updated
└── backend/                     ← No longer needed (kept for reference)
```

---

## 🧪 Testing Your Setup

### Test 1: Login
1. Go to http://localhost:5173
2. Click "Sign In"
3. Use: `student1@university.edu` / `student123`
4. Should see dashboard

### Test 2: Create Project
1. Click "Create Project"
2. Fill in form
3. Click "Create"
4. Should see new project in dashboard

### Test 3: Request Access
1. Create a project as student
2. Login as faculty with `faculty1@university.edu` / `faculty123`
3. Find student's project
4. Click "Request Access"
5. Should see pending request

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists in project root (not backend folder)
- Verify exact spelling: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server: Stop with Ctrl+C and run `npm run dev` again

### Login fails with "Invalid login credentials"
- Verify user exists in Supabase **Authentication** section
- Try resetting user password in Supabase
- Check email/password are correct

### Dashboard shows no projects
- In Supabase SQL Editor, check:
  ```sql
  SELECT * FROM public.projects;
  ```
- Make sure project `status = 'public'`
- Check RLS policies allow user to view

### "TypeError: Cannot read property 'id' of undefined"
- User profile not created in `users` table
- Run SQL INSERT command from Step 4 for that user

---

## 📚 Documentation

Complete guides available:
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Full setup with SQL schema
- **[README.md](./README.md)** - Project overview
- **[MIGRATION_DJANGO_TO_SUPABASE.md](./MIGRATION_DJANGO_TO_SUPABASE.md)** - What changed
- **Supabase Docs**: https://supabase.com/docs

---

## ✨ What's Next?

After basic setup, you can add:

1. **Profile Images** (Supabase Storage)
   ```typescript
   // Upload to Supabase Storage
   await supabase.storage
     .from('avatars')
     .upload(`${user.id}/avatar.jpg`, file)
   ```

2. **Real-time Updates** (Supabase Realtime)
   ```typescript
   // Listen to project changes in real-time
   supabase
     .from('projects')
     .on('*', payload => {
       console.log('Change received!', payload)
     })
     .subscribe()
   ```

3. **Email Notifications** (Supabase Functions)
   - Trigger emails when access requests are approved

4. **Scheduled Jobs** (Supabase Cron)
   - Clean up old requests
   - Send reminders

---

## 🎉 You're Ready!

```bash
npm install @supabase/supabase-js
npm run dev
```

Visit: http://localhost:5173

**Enjoy your Supabase-powered PRIME application!** 🚀

---

## 💡 Quick Reference

| What | Where |
|------|-------|
| Supabase Keys | `.env.local` |
| Database Schema | [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) SQL section |
| Auth Logic | `src/lib/supabase-auth.tsx` |
| API Functions | `src/lib/supabase-api.ts` |
| Help | https://supabase.com/docs |
| Discord | https://discord.supabase.com |
