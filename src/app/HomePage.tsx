import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <h1>Quest Verse</h1>
      <p className="lede">
        Walk around LASU, finish quests, and collect photos of the places you visit.
      </p>
      <Link to="/quests" className="btn">
        See quests
      </Link>
    </>
  )
}
