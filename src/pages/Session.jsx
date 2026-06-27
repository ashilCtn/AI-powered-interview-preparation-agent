import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useSessionStore from '../store/sessionStore'
import QuestionAccordion from '../components/QuestionAccordion'
import LearnMorePanel from '../components/LearnMorePanel'
import CustomNavBar from '../components/CustomNavBar'
import { Plus } from "lucide-react";

const Session = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useAuthStore()
  const {
    currentSession,
    loading,
    loadingMore,
    fetchSession,
    loadMore,
    togglePin,
    learnMorePanel,
    openLearnMore,
    closeLearnMore,
  } = useSessionStore()

  useEffect(() => {
    if (!user) navigate('/')
  }, [user])

  useEffect(() => {
    fetchSession(id)
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-stone-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!currentSession) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-stone-500">
        <p className="text-4xl mb-4">🔍</p>
        <p className="font-semibold">Session not found.</p>
      </div>
    )
  }

  const questions = [...currentSession.qna].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return (
    <>
    <CustomNavBar title="Q & A Session" variant="session" />
      <div className={`transition-all duration-300 ${learnMorePanel.open ? 'mr-[380px]' : ''}`}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-stone-900">{currentSession.role}</h1>
          <p className="text-stone-500 text-sm mt-1 font-medium">
            {Array.isArray(currentSession.topics)
              ? currentSession.topics.join(', ')
              : currentSession.topics}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Tag>Experience: {currentSession.experience}</Tag>
            <Tag>{questions.length} Q&A</Tag>
            <Tag>Last Updated: {formatDate(currentSession.updatedAt)}</Tag>
          </div>
        </div>

        <h2 className="text-lg font-bold text-stone-800 mb-4">Interview Q & A</h2>
        <div className="space-y-3">
          {questions.map((q) => (
            <QuestionAccordion
              key={q._id}
              question={q.question}
              answer={q.answer}
              pinned={q.pinned}
              learnMoreActive={learnMorePanel.open && learnMorePanel.questionId === q._id}
              onPin={() => togglePin(q._id)}
              onLearnMore={() => {
                if (learnMorePanel.open && learnMorePanel.questionId === q._id) {
                  closeLearnMore()
                } else {
                  openLearnMore(q.question, currentSession.role, q._id)
                }
              }}
            />
          ))}
        </div>

        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md mx-auto mt-4 gap-2"
        >
          {loadingMore ? (
            <>
              <span className="w-4 h-4 border-2 border-stone-300 border-t-orange-500 rounded-full animate-spin" />
              Generating more...
            </>
          ) : (
            <>
            <Plus size={22}/>
            {'Load More Questions'}
            </>
          )}
        </button>
      </div>

      {learnMorePanel.open && (
        <LearnMorePanel
          title={learnMorePanel.title}
          content={learnMorePanel.content}
          loading={learnMorePanel.loading}
          onClose={closeLearnMore}
        />
      )}
    </div>
    </>
  )
}

const Tag = ({ children }) => (
  <span className="text-xs bg-stone-900 text-white rounded-sm px-3 py-1 font-medium">
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

export default Session