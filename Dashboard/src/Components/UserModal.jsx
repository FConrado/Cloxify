import "./UserModal.css"

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return `${h}h ${m}m ${s}s`
}

function UserModal({ user, onClose }) {

  if (!user) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >

        <h2>{user.user_id}</h2>

        <ul className="domain-list">
          {user.domains.map((domain, i) => (
            <li key={i} className="domain-row">
              <span>{domain.domain}</span>
              <span>{formatTime(domain.seconds)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UserModal