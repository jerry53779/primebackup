/**
 * Supabase Client Configuration
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for database tables
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'student' | 'faculty' | 'admin'
  created_at: string
}

export interface Project {
  id: string
  title: string
  abstract: string
  domains: string[]
  year: string
  license: string
  tech_stack: string[]
  status: 'public' | 'locked' | 'approved'
  owner_id: string
  owner_name: string
  team_members: TeamMember[]
  approved_faculty_ids: string[]
  approval_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  contribution: string
  created_at: string
}

export interface AccessRequest {
  id: string
  project_id: string
  project_title: string
  faculty_id: string
  faculty_name: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  created_at: string
  updated_at: string
}
