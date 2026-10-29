import { Link } from 'react-router-dom'

export function MapPage() {
  return (
    <>
      <h1>Map</h1>
      <p className="empty">The map is not built yet. Finished quests will show up on it as pins.</p>
      <p>
        <Link to="/pin-places">Helpers: pin campus places</Link>
      </p>
    </>
  )
}
