import React from 'react'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CARD_STYLES = [
  { card: 'bg-orange-50', avatar: 'bg-orange-200 text-orange-800' },
  { card: 'bg-yellow-50', avatar: 'bg-yellow-200 text-yellow-800' },
  { card: 'bg-blue-50', avatar: 'bg-blue-200 text-blue-800' },
  { card: 'bg-green-50', avatar: 'bg-green-200 text-green-800' },
  { card: 'bg-pink-50', avatar: 'bg-pink-200 text-pink-800' },
  { card: 'bg-purple-50', avatar: 'bg-purple-200 text-purple-800' },
  { card: 'bg-teal-50', avatar: 'bg-teal-200 text-teal-800' },
  { card: 'bg-indigo-50', avatar: 'bg-indigo-200 text-indigo-800' },
]

const SessionCard = ({ session, index, onDelete }) => {
  const navigate = useNavigate()
  const style = CARD_STYLES[index % CARD_STYLES.length]

  const initials = session.role
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      className="relative border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow group bg-white shadow-sm"
      onClick={() => navigate(`/session/${session._id}`)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.(session._id)
        }}
        className="absolute top-3 right-3 text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <Trash2 size={15} />
      </button>

      {/* Colored top section */}
      <div className={`flex items-center gap-3 px-4 py-4 ${style.card} m-2`}>
        <div className={`w-11 h-11 rounded-sm flex items-center justify-center text-sm font-bold shrink-0 ${style.avatar}`}>
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-stone-900 text-[15px] leading-tight">{session.role}</h3>
          <p className="text-xs text-stone-500 mt-0.5 truncate font-medium">
            {session.topics}
          </p>
        </div>
      </div>

      {/* White bottom section */}
      <div className="px-5 py-3">
        <div className="flex flex-wrap gap-1.5">
          <Tag>Experience: {session.experience}</Tag>
          <Tag>{session.questionCount ?? 10} Q&A</Tag>
          <Tag>Last Updated: {formatDate(session.updatedAt)}</Tag>
        </div>

        {session.description && (
          <p className="text-sm text-stone-500 mt-3 line-clamp-2 leading-relaxed">
            {session.description}
          </p>
        )}
      </div>
    </div>
  )
}

const Tag = ({ children }) => (
  <span className="text-[11px] bg-black border border-stone-200 text-white rounded-md  px-2.5 py-1 font-medium">
    {children}
  </span>
)

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default SessionCard