import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useSessionStore from '../store/sessionStore'
import SessionCard from '../components/SessionCard'
import AddSessionModal from '../components/AddSessionModal'
import CustomNavBar from '../components/CustomNavBar'

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const { user } = useAuthStore()
  const { sessions, loading, creating, fetchSessions, createSession, deleteSession } =
    useSessionStore()

  useEffect(() => {
    if (!user) navigate('/')
  }, [user])

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleCreate = async (form) => {
    const newSession = await createSession(form)
    if (newSession?._id) {
      navigate(`/session/${newSession._id}`)
    }
  }

  return (
    <>
    <CustomNavBar title="Dashboard" variant="dashboard" /> 
    <div className="max-w-6xl mx-auto px-6 py-10">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-stone-400">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-semibold text-stone-600 mb-1">No sessions yet</p>
          <p className="text-sm">
            Click "+ Add New" to create your first interview prep session.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((session, i) => (
            <SessionCard
              key={session._id}
              session={session}
              index={i}
              onDelete={deleteSession}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 flex items-center gap-2 bg-black hover:bg-gray-600 text-white font-semibold px-5 py-3 rounded-sm shadow-lg transition-colors"
      >
        <Plus size={18} />
        Add New
      </button>

      {showModal && (
        <AddSessionModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          creating={creating}
        />
      )}
    </div>
    </>
  )
}

export default Dashboard