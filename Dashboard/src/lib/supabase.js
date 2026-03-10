import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://mayvkdzpwpujeprgghxr.supabase.co"
const SUPABASE_KEY = "sb_publishable_-flrhjd60ZQqyiWQv5FvaA_znP2uqj6"

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)