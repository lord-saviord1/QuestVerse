import { Link, useParams } from 'react-router-dom'
import { findQuest } from '@/features/quests/sampleQuests'
import { DIFFICULTY_LABEL } from '@/features/quests/types'

export function QuestDetailPage() {
  const { id } = useParams()
  const quest = findQuest(id)

  if (!quest) {
    return (
      <>
        <h1>Quest not found</h1>
        <p>That quest does not exist or has been removed.</p>
        <Link to="/quests" className="btn">
          Back to quests
        </Link>
      </>
    )
  }

  return (
    <>
      <Link to="/quests" className="back">
        Back to quests
      </Link>
      <h1>{quest.title}</h1>
      <div className="brick__meta">
        <span className={`chip chip--${quest.difficulty}`}>
          {DIFFICULTY_LABEL[quest.difficulty]}
        </span>
        {quest.sample && <span className="chip chip--sample">Sample</span>}
      </div>
      <dl className="facts">
        <div>
          <dt>Where</dt>
          <dd>{quest.place}</dd>
        </div>
        <div>
          <dt>What to do</dt>
          <dd>{quest.instructions}</dd>
        </div>
        <div>
          <dt>Photo rule</dt>
          <dd>{quest.photoRule}</dd>
        </div>
      </dl>
      <Link to={`/camera?quest=${quest.id}`} className="btn">
        Take the photo
      </Link>
    </>
  )
}
