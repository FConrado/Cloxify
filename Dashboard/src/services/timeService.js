import { supabase } from "../lib/supabase"

export async function getGroupedUsage() {

  const { data, error } = await supabase.rpc("get_usage_grouped")

  if (error) {
    console.error(error)
    throw error
  }

  return data
}