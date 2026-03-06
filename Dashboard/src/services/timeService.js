import { supabase } from "../lib/supabase"

export async function getTimeByUser(userId) {
  const { data, error } = await supabase
    .from("tab_time")
    .select("*")
    .eq("user_id", userId)
    .order("seconds", { ascending: false })

  if (error) {
    console.error("Erro ao buscar dados:", error)
    throw error
  }

  return data
}