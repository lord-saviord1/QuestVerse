import { Link } from 'react-router-dom'
import { sampleQuests } from '@/features/quests/sampleQuests'
import { DIFFICULTY_LABEL } from '@/features/quests/types'

export function QuestsPage() {
  return (
    <>
      <h1>Quests</h1>
      <p className="lede">Pick one, go there, take the photo.</p>
      {sampleQuests.map((quest) => (
        <Link
          key={quest.id}
          to={`/quests/${quest.id}`}
          className={`brick brick--${quest.difficulty}`}
        >
          <h2>{quest.title}</h2>
          <p>{quest.place}</p>
          <div className="brick__meta">
            <span className={`chip chip--${quest.difficulty}`}>
              {DIFFICULTY_LABEL[quest.difficulty]}
            </span>
            {quest.sample && <span className="chip chip--sample">Sample</span>}
          </div>
        </Link>
      ))}
    </>
  )
}
