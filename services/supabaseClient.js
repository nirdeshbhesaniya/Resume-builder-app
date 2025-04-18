// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://rqsfftwxugczabgndbfs.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc2ZmdHd4dWdjemFiZ25kYmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjM4NDAsImV4cCI6MjA1OTgzOTg0MH0.NNDtwuaca_zZhDEsAHeHnV7XQoYDQboMY9_vuDSVqqI'

// export const supabase = createClient(supabaseUrl, supabaseKey)
// supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/clerk-react'

const supabaseUrl = 'https://rqsfftwxugczabgndbfs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc2ZmdHd4dWdjemFiZ25kYmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjM4NDAsImV4cCI6MjA1OTgzOTg0MH0.NNDtwuaca_zZhDEsAHeHnV7XQoYDQboMY9_vuDSVqqI'

export const useSupabaseWithClerk = () => {
  const { getToken } = useAuth()

  const getSupabaseClient = async () => {
    const token = await getToken()

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    return supabase
  }

  return { getSupabaseClient }
}
