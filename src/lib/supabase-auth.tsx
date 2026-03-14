/**
 * Supabase Authentication Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, User as SupabaseUser } from './supabase'
import { User } from '../App'

export interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    checkUser()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.full_name,
        role: data.role,
      }
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to check user:', error)
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await fetchUserProfile(data.user.id)
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, fullName: string) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Update user profile with full name (profile auto-created by trigger)
        const { error: updateError } = await supabase
          .from('users')
          .update({ full_name: fullName })
          .eq('id', authData.user.id)

        if (updateError) {
          console.error('Error updating user profile:', updateError)
          // Don't throw - signup was successful even if profile update fails
        }

        // Wait a moment for trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 500))
        await fetchUserProfile(authData.user.id)
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
