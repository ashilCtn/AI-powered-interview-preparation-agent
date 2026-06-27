// src/components/AddSessionModal.jsx
import React, { useState } from 'react'
import { X } from 'lucide-react'
import useSessionStore from '../store/sessionStore'

const AddSessionModal = ({ onClose }) => {
  const [form, setForm] = useState({ role: '', experience: '', topics: '', description: '' })
  const [error, setError] = useState(null)

  const { createSession, creating } = useSessionStore()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
  setError(null)
  try {
    const payload = {
      ...form,
      topics: form.topics.split(',').map(t => t.trim()).filter(Boolean)
    }
    const result = await createSession(payload)
    if (result) {
      onClose()
    } else {
      setError('Failed to create session. Please try again.')
    }
  } catch (err) {
    setError(err.message || 'Something went wrong.')
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold text-stone-900 mb-1">Start a New Interview Journey</h2>
        <p className="text-sm text-stone-500 mb-4">
          Fill out a few quick details and unlock your personalized set of interview questions!
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Field label="Target Role" name="role" placeholder="e.g., Frontend Developer, UI/UX Designer, etc." value={form.role} onChange={handleChange} />
          <Field label="Years of Experience" name="experience" placeholder="e.g., 1 year, 3 years, 5+ years" value={form.experience} onChange={handleChange} />
          <Field label="Topics to Focus On" name="topics" placeholder="Comma-separated, e.g., React, Node.js, MongoDB" value={form.topics} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Any specific goals or notes for this session" rows={3}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-stone-50 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={creating || !form.role.trim()}
          className="mt-6 w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          {creating
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
            : 'Create Session'}
        </button>
      </div>
    </div>
  )
}

const Field = ({ label, name, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
    <input
      name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-stone-50"
    />
  </div>
)

export default AddSessionModal
