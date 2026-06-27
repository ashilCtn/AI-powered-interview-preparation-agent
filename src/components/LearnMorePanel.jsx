import React from 'react'
import { X } from 'lucide-react'

const LearnMorePanel = ({ title, content, loading, onClose }) => {
  return (
    <div className="fixed top-0 right-0 h-full w-[557px] bg-white shadow-md z-40 flex flex-col border-l border-stone-200">
      {/* Header */}
      <div className="flex items-start justify-between px-7 py-5 border-b border-stone-200 bg-stone-50">
        <div className="flex-1 pr-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-green-400 mb-1">Deep Dive</p>
          <h3 className="font-bold text-stone-900 text-[15px] leading-snug">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors rounded-lg p-1.5 shrink-0 mt-0.5"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-7 py-6 text-[13.5px] text-stone-600 leading-[1.9]">
        {loading ? (
          <div className="space-y-3 animate-pulse pt-1">
            <div className="h-3 bg-stone-100 rounded-full w-[45%]" />
            <div className="h-3 bg-stone-100 rounded-full w-full" />
            <div className="h-3 bg-stone-100 rounded-full w-[92%]" />
            <div className="h-3 bg-stone-100 rounded-full w-[97%]" />
            <div className="h-3 bg-stone-100 rounded-full w-[80%]" />
            <div className="h-3 bg-stone-100 rounded-full w-[40%] mt-6" />
            <div className="h-3 bg-stone-100 rounded-full w-full" />
            <div className="h-3 bg-stone-100 rounded-full w-[88%]" />
            <div className="h-3 bg-stone-100 rounded-full w-[95%]" />
            <div className="h-3 bg-stone-100 rounded-full w-[70%]" />
          </div>
        ) : (
          <div className="space-y-1">{parseContent(content)}</div>
        )}
      </div>
    </div>
  )
}

function parseContent(content) {
  if (!content) return null
  if (typeof content !== 'string') return content

  const lines = content.split('\n')
  const elements = []
  let bulletBuffer = []
  let codeBuffer = []
  let inCodeBlock = false
  let codeLanguage = ''
  let key = 0
  let sectionCount = 0

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    elements.push(
      <ul key={key++} className="space-y-2.5 list-none pl-0 my-3">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="flex gap-3 items-start pl-1">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            <span className="text-stone-600 leading-relaxed">{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  const flushCode = () => {
    if (codeBuffer.length === 0) return
    elements.push(
      <div key={key++} className="rounded-xl overflow-hidden my-4 border border-stone-800/20">
        {codeLanguage && (
          <div className="bg-stone-800 text-stone-400 text-[10.5px] font-mono px-4 py-2 tracking-wide uppercase">
            {codeLanguage}
          </div>
        )}
        <pre className="bg-[#1C1C1E] text-[#E5E5EA] text-[12px] font-mono px-5 py-4 overflow-x-auto leading-relaxed whitespace-pre">
          {codeBuffer.join('\n')}
        </pre>
      </div>
    )
    codeBuffer = []
    codeLanguage = ''
  }

  for (const raw of lines) {
    const line = raw

    if (/^```/.test(line.trim())) {
      if (!inCodeBlock) {
        flushBullets()
        inCodeBlock = true
        codeLanguage = line.trim().replace(/^```/, '').trim()
      } else {
        inCodeBlock = false
        flushCode()
      }
      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    const trimmed = line.trim()
    if (!trimmed) {
      flushBullets()
      continue
    }
    if (/^[-_*]{3,}$/.test(trimmed)) {
      flushBullets()
      elements.push(<hr key={key++} className="border-stone-100 my-4" />)
      continue
    }

    // H1 / H2 — section heading with accent bar
    if (/^#{1,2}\s+/.test(trimmed)) {
      flushBullets()
      sectionCount++
      const text = trimmed.replace(/^#{1,2}\s+/, '')
      elements.push(
        <div key={key++} className={`flex items-center gap-3 ${sectionCount > 1 ? 'mt-7' : 'mt-2'} mb-3`}>
          <span className="w-[3px] h-5 rounded-full bg-green-400 shrink-0" />
          <p className="font-bold text-stone-900 text-[14px] tracking-tight">
            {renderInline(text)}
          </p>
        </div>
      )
      continue
    }

    // H3 / H4 — sub-heading
    if (/^#{3,6}\s+/.test(trimmed)) {
      flushBullets()
      const text = trimmed.replace(/^#{3,6}\s+/, '')
      elements.push(
        <p key={key++} className="font-semibold text-stone-700 text-[13px] mt-4 mb-1.5">
          {renderInline(text)}
        </p>
      )
      continue
    }

    if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const text = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '')
      bulletBuffer.push(text)
      continue
    }

    flushBullets()
    elements.push(
      <p key={key++} className="text-stone-600 leading-[1.85] mb-1">
        {renderInline(trimmed)}
      </p>
    )
  }

  flushBullets()
  flushCode()
  return elements
}

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-stone-800">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-orange-50 text-orange-700 border border-orange-100 font-mono text-[11.5px] px-1.5 py-0.5 rounded-md">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part.replace(/(?<!\*)\*(?!\*)/g, '').replace(/_/g, '')
  })
}

export default LearnMorePanel
