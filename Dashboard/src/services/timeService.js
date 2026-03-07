import { supabase } from "../lib/supabase"

export async function getGroupedUsage() {

  const { data, error } = await supabase.rpc("get_usage_grouped")

  if (error) {
    console.error(error)
    throw error
  }

  const users = {}

  data.forEach(row => {

    if (!users[row.name]) {
      users[row.name] = {
        user_id: row.name,
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