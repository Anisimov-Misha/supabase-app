import { Session } from '@supabase/supabase-js'

export interface AuthContextType {
  token: Session | null
  loading: boolean
  setToken: (token: Session | null) => void
}
