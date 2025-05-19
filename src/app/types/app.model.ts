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

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskColumnProps = {
  id: string;
  title: string;
  tasks: any[];
  onTaskClick?: (task: any) => void;
};