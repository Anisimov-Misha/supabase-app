import { Session } from '@supabase/supabase-js'

export interface AuthContextType {
  token: Session | null
  loading: boolean
  setToken: (token: Session | null) => void
}

export type UploadedFile = {
  url: string;
  name: string;
};

export interface UploadFormProps {
  open: boolean
  onClose: () => void
}