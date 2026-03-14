# Supabase Quick Start Cheat Sheet

## 📋 Quick Commands

### Installation
```bash
npm install @supabase/supabase-js
npm run dev
```

### Create `.env.local`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Test Users (Create in Supabase Auth)
```
user: student1@university.edu
pass: student123

user: faculty1@university.edu  
pass: faculty123

user: admin@university.edu
pass: admin123
```

---

## 🗄️ Database Schema (Copy to Supabase SQL Editor)

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Full schema section

---

## 🚀 API Reference

### Import
```typescript
import { projectApi, accessRequestApi, userApi, teamMemberApi } from './lib/supabase-api'
import { useAuth } from './lib/supabase-auth'
```

### Authentication
```typescript
const { user, isAuthenticated, login, logout, register } = useAuth()

// Login
await login('email@example.com', 'password')

// Logout
await logout()

// Register
await register('email@example.com', 'password', 'Full Name')
```

### Projects
```typescript
// Get all projects
const { data } = await projectApi.listAllProjects()

// Get my projects
const { data } = await projectApi.getMyProjects()

// Get public projects
const { data } = await projectApi.getPublicProjects()

// Create project
const { data } = await projectApi.createProject({
  title: 'My Project',
  abstract: 'Description',
  domains: ['AI', 'ML'],
  year: '2024',
  license: 'MIT',
  tech_stack: ['React', 'TypeScript'],
  status: 'public'
})

// Get project
const { data } = await projectApi.getProject(projectId)

// Update project
const { data } = await projectApi.updateProject(projectId, updateData)

// Delete project
await projectApi.deleteProject(projectId)
```

### Access Requests
```typescript
// List all requests
const { data } = await accessRequestApi.listAccessRequests()

// Request access to project
await projectApi.requestAccess(projectId, 'Optional message')

// Approve request
await projectApi.approveAccess(projectId, requestId)

// Reject request  
await projectApi.rejectAccess(projectId, requestId)
```

### Users
```typescript
// Get current user
const { data } = await userApi.getCurrentUser()

// Get user by ID
const { data } = await userApi.getUser(userId)

// List all users
const { data } = await userApi.listUsers()
```

---

## 🔐 Component Integration

### In Login Component
```typescript
import { useAuth } from '../lib/supabase-auth'

export function Login() {
  const { login, register } = useAuth()
  
  const handleLogin = async (email, password) => {
    await login(email, password)
  }
}
```

### In Dashboard Component
```typescript
import { useAuth } from '../lib/supabase-auth'
import { projectApi } from '../lib/supabase-api'

export function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    projectApi.listAllProjects()
      .then(res => setProjects(res.data))
  }, [])
}
```

---

## 🧹 Cleanup Commands

### Remove old Django files (optional)
```bash
rmdir /s backend   # Windows
rm -rf backend     # Mac/Linux
```

### Clear npm cache
```bash
npm cache clean --force
```

---

## 📊 Supabase Console Links

After creating project, visit:
- **Dashboard**: https://app.supabase.com
- **Data Editor**: Project → Table Editor
- **SQL Editor**: Project → SQL Editor  
- **Auth**: Project → Authentication
- **API Settings**: Project → Settings → API

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Missing env vars" | Add `.env.local` to **root** not backend |
| "401 Unauthorized" | Verify user in Supabase Auth |
| "No projects shown" | Check status = 'public' in database |
| "Login fails" | Check user profile created in users table |
| "Supabase client error" | Verify URL and key in `.env.local` |

---

## 📱 Key Files

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client & types |
| `src/lib/supabase-auth.tsx` | Auth context & hooks |
| `src/lib/supabase-api.ts` | API functions |
| `src/components/Login.tsx` | Login UI with Supabase |
| `src/App.tsx` | Main app component |
| `.env.local` | Environment variables |
| `SUPABASE_SETUP.md` | Setup instructions |

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Docs**: https://supabase.com/docs
- **Examples**: https://github.com/supabase/supabase/tree/master/examples
- **Discord**: https://discord.supabase.com
- **Status**: https://status.supabase.com

---

## ✅ Setup Checklist

- [ ] Create Supabase project
- [ ] Copy URL and API key to `.env.local`
- [ ] Run SQL schema in Supabase
- [ ] Create 3 test users
- [ ] Insert user profiles via SQL
- [ ] Run `npm install @supabase/supabase-js`
- [ ] Run `npm run dev`
- [ ] Login at http://localhost:5173
- [ ] Create test project
- [ ] Test access request workflow

---

**Happy coding!** 🚀
