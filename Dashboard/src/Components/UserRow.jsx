import "./UserRow.css"

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return `${h}h ${m}m ${s}s`
}

function getTotalSeconds(domains) {
  return domains.reduce((acc, d) => acc + d.seconds, 0)
}

function UserRow({ user, cor, maxSeconds, onClick }) {

  const totalSeconds = getTotalSeconds(user.domains)

  const percentage = (totalSeconds / maxSeconds) * 100

  return (
    <div className="user-row" onClick={() => onClick(user)}>

      <div className="user-avatar">
        {user.name.slice(0,2).toUpperCase()}
      </div>

      <div className="user-name">
        {user.name}
      </div>

      <div className="user-time">
        {formatTime(totalSeconds)}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, backgroundColor: cor, boxShadow: `0 0 8px 0 ${cor}` }}
        />
      </div>

    </div>
  )
}

export default UserRow