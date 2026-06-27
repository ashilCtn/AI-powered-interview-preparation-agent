import React, { useState } from 'react'
import { ChevronDown, Sparkles, Pin } from 'lucide-react'

const QuestionAccordion = ({
  question,
  answer,
  pinned,
  onPin,
  onLearnMore,
  learnMoreActive,
}) => {
  const [open, setOpen] = useState(false)

const pinClass = pinned
  ? 'border-orange-400 text-orange-500 bg-orange-50'
  : 'border-[#D8D7F8] text-[#6B6FCF] bg-[#EFEFF9] hover:bg-[#E8E8F8]'

const learnMoreClass = learnMoreActive
  ? 'border-orange-400 text-orange-500 bg-orange-50'
  : 'border-[#CDEAEA] text-[#4F9C9C] bg-[#E3F4F4] hover:bg-[#D9F0F0]'

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-stone-50 transition-colors select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-stone-400 font-medium text-sm shrink-0">Q</span>
        <span className="flex-1 text-sm font-medium leading-snug">{question}</span>

        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onPin}
            className={`flex items-center justify-center border rounded-md p-1.5 transition-colors ${pinClass}`}
          >
            <Pin size={13} />
          </button>

          <button
            onClick={onLearnMore}
            className={`flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${learnMoreClass}`}
          >
            <Sparkles size={12} />
            Learn More
          </button>
        </div>

        <ChevronDown
          size={16}
          className={`text-stone-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-stone-100">
          <div className="bg-stone-100 border border-stone-100 rounded-xl px-4 py-3 text-md text-black leading-relaxed">
            {renderAnswer(answer)}
          </div>
        </div>
      )}
    </div>
  )
}

function renderAnswer(answer) {
  if (!answer) return null
  if (typeof answer !== 'string') return answer

  const lines = answer.split('\n')
  const elements = []
  let bulletBuffer = []
  let key = 0

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    elements.push(
      <ul key={key++} className="space-y-1.5 list-none pl-0 my-1">
        {bulletBuffer.map((item, i) => {
          const colonIdx = item.indexOf(':')
          const hasBoldLabel = colonIdx > 0 && colonIdx < 40
          return (
            <li key={i} className="flex gap-2 items-start">
              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-stone-500 shrink-0" />
              <span>
                {hasBoldLabel ? (
                  <>
                    <strong className="font-semibold text-stone-800">
                      {item.slice(0, colonIdx + 1)}
                    </strong>
                    {item.slice(colonIdx + 1)}
                  </>
                ) : (
                  renderInline(item)
                )}
              </span>
            </li>
          )
        })}
      </ul>
    )
    bulletBuffer = []
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (/^[-*•]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      bulletBuffer.push(line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, ''))
      continue
    }

    flushBullets()
    elements.push(<p key={key++} className="mb-1">{renderInline(line)}</p>)
  }

  flushBullets()
  return <div className="space-y-1">{elements}</div>
}

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-stone-800">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-stone-100 text-stone-700 font-mono text-[12px] px-1 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part.replace(/\*/g, '')
  })
}

export default QuestionAccordion