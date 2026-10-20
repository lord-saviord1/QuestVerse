import { Link } from 'react-router-dom'

export function CameraPage() {
  return (
    <>
      <h1>Camera</h1>
      <p className="empty">Pick a quest first. Its photo gets taken here.</p>
      <Link to="/quests" className="btn">
        Choose a quest
      </Link>
    </>
  )
}
