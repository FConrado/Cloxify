import { supabase } from "../lib/supabase"

export async function getGroupedUsage(start, end) {

   const { data, error } = await supabase.rpc(
    "get_usage_grouped",
    {
      p_start: start,
      p_end: end
    }
  )

  if (error) {
    console.error(error)
    throw error
  }

  const users = {}

  data.forEach(row => {

    if (!users[row.name]) {
      users[row.name] = {
        user_id: row.user_id,
        name: row.name,
        color: row.color,
        domains: []
      }
    }

    users[row.name].domains.push({
      day: row.day,
      domain: "total",
      seconds: row.total_seconds
    })

  })

  return Object.values(users)

}

export async function getUserDomainsInPeriod(userId, start, end) {

  const { data, error } = await supabase.rpc(
    "get_user_domains_in_period",
    {
      p_user: userId,
      p_start: start,
      p_end: end
    }
  )

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export async function getUser(){
  const { data, error } = await supabase.rpc("get_current_user")
  if (error) {
    console.error(error)
    throw error
  }

  return data
}