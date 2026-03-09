export function buildChartData(users) {

  const days = {}

  users.forEach(user => {

    user.domains.forEach(entry => {

      const day = entry.day

      if (!day) return

      if (!days[day]) {
        days[day] = { day }
      }

      if (!days[day][user.user_id]) {
        days[day][user.user_id] = 0
      }

      days[day][user.user_id] += Number((entry.seconds / 3600).toFixed(2))

    })

  })

  return Object.values(days).sort((a, b) =>
    a.day.localeCompare(b.day)
  )
}