import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Membership = { org_id: string; role: string }

type AuthState = {
  session: Session | null
  user: User | null
  loading: boolean

  membership: Membership | null
  membershipLoading: boolean

  init: () => Promise<void>
  refreshMembership: () => Promise<void>

  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuth = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  loading: true,

  membership: null,
  membershipLoading: false,

  init: async () => {
    set({ loading: true })

    const { data } = await supabase.auth.getSession()
    set({
      session: data.session ?? null,
      user: data.session?.user ?? null,
      loading: false,
    })

    if (data.session) await get().refreshMembership()

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({
        session: session ?? null,
        user: session?.user ?? null,
        loading: false,
      })
      if (session) await get().refreshMembership()
      else set({ membership: null })
    })
  },

  refreshMembership: async () => {
    const userId = get().user?.id
    if (!userId) {
      set({ membership: null })
      return
    }

    set({ membershipLoading: true })

    const { data, error } = await supabase
      .from('organization_members')
      .select('org_id, role')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)

    if (error) {
      set({ membership: null, membershipLoading: false })
      return
    }

    set({
      membership: (data?.[0] as Membership) ?? null,
      membershipLoading: false,
    })
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}))
