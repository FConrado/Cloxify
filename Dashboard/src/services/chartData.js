export function buildChartData(users) {

  const daily = {}

  users.forEach(user => {

    user.domains.forEach(domain => {

      const date = new Date(domain.created_at)
        .toISOString()
        .split("T")[0]

      if (!daily[date]) {
        daily[date] = { date }
      }

      if (!daily[date][user.user_id]) {
        daily[date][user.user_id] = 0
      }

      daily[date][user.user_id] += domain.seconds
    })

  })

  return Object.values(daily)
}