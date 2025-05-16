import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pfapodmhfpdddkdappfw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmYXBvZG1oZnBkZGRrZGFwcGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczODM4NDEsImV4cCI6MjA2Mjk1OTg0MX0.SYrnCjzp0WrKRlJYL181NP5prDyD2wag1_KC1X_iUcc'
export const supabase = createClient(supabaseUrl, supabaseKey)