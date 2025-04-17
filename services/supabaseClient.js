import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rqsfftwxugczabgndbfs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc2ZmdHd4dWdjemFiZ25kYmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjM4NDAsImV4cCI6MjA1OTgzOTg0MH0.NNDtwuaca_zZhDEsAHeHnV7XQoYDQboMY9_vuDSVqqI'

export const supabase = createClient(supabaseUrl, supabaseKey)
