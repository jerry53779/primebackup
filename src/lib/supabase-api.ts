/**
 * Supabase API Service Layer
 */

import { supabase, Project, AccessRequest, TeamMember } from './supabase'

// Project API
export const projectApi = {
  listAllProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data }
  },

  getProject: async (id: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data }
  },

  createProject: async (projectData: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          ...projectData,
          owner_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error
    return { data: data?.[0] }
  },

  updateProject: async (id: string, projectData: any) => {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...projectData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return { data: data?.[0] }
  },

  deleteProject: async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) throw error
  },

  getMyProjects: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data }
  },

  getPublicProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'public')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data }
  },

  requestAccess: async (projectId: string, message?: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // Get project details for request
    const projectRes = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single()

    const { data, error } = await supabase
      .from('access_requests')
      .insert([
        {
          project_id: projectId,
          faculty_id: user.id,
          status: 'pending',
          message,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error
    return { data: data?.[0] }
  },

  approveAccess: async (projectId: string, requestId: string) => {
    const { data, error } = await supabase
      .from('access_requests')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()

    if (error) throw error

    // Add faculty to approved list
    if (data?.[0]) {
      const projectRes = await supabase
        .from('projects')
        .select('approved_faculty_ids')
        .eq('id', projectId)
        .single()

      if (projectRes.data) {
        const approvedIds = projectRes.data.approved_faculty_ids || []
        if (!approvedIds.includes(data[0].faculty_id)) {
          approvedIds.push(data[0].faculty_id)
          await supabase
            .from('projects')
            .update({ approved_faculty_ids: approvedIds })
            .eq('id', projectId)
        }
      }
    }

    return { data: data?.[0] }
  },

  rejectAccess: async (projectId: string, requestId: string) => {
    const { data, error } = await supabase
      .from('access_requests')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()

    if (error) throw error
    return { data: data?.[0] }
  },
}

// User API
export const userApi = {
  getCurrentUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return { data }
  },

  getUser: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data }
  },

  listUsers: async () => {
    const { data, error } = await supabase.from('users').select('*')

    if (error) throw error
    return { data }
  },
}

// Access Request API
export const accessRequestApi = {
  listAccessRequests: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // Get requests made by user and requests for their projects
    const [myRequests, receivedRequests] = await Promise.all([
      supabase
        .from('access_requests')
        .select('*')
        .eq('faculty_id', user.id),
      supabase
        .from('access_requests')
        .select('*, projects!inner(owner_id)')
        .eq('projects.owner_id', user.id),
    ])

    const allRequests = [
      ...(myRequests.data || []),
      ...(receivedRequests.data || []),
    ]

    return { data: allRequests }
  },

  getMyRequests: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('access_requests')
      .select('*')
      .eq('faculty_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data }
  },

  getReceivedRequests: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('access_requests')
      .select('*, projects!inner(owner_id)')
      .eq('projects.owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data }
  },
}

// Team Member API
export const teamMemberApi = {
  listTeamMembers: async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data }
  },

  createTeamMember: async (memberData: any) => {
    const { data, error } = await supabase
      .from('team_members')
      .insert([
        {
          ...memberData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error
    return { data: data?.[0] }
  },
}
