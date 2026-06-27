import React, { useState } from 'react'
import { Sparkles, BookOpen, Pin, FolderOpen, Brain } from 'lucide-react'
import AuthModal from '../components/AuthModal'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { useEffect } from 'react'
import CustomNavBar from '../components/CustomNavbar'

const FEATURES = [
  {
    title: 'Tailored Just for You',
    desc: 'Receive interview questions and model answers based on your role, experience level, and focus areas. No generic content, just relevant practice.',
  },
  {
    title: 'Learn at Your Own Pace',
    desc: 'Expand answers only when you are ready. Instantly access AI-generated explanations to deepen your understanding of any concept.',
  },
  {
    title: 'Capture Your Insights',
    desc: 'Attach personal notes to any question and pin the ones that matter most. Keep your preparation structured and easy to revisit.',
  },
  {
    title: 'Understand the Why Behind Answers',
    desc: 'Go beyond surface-level answers. Access detailed AI-generated concept breakdowns that help you build a deeper understanding of each topic.',
  },
  {
    title: 'Save, Organize, and Revisit',
    desc: 'Save your interview sets, manage them from your dashboard, and pick up exactly where you left off at any time.',
  },
]

const Landing = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [authModal, setAuthModal] = useState(null) // null | 'login' | 'signup'

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user])
  return (
    <div>
      <CustomNavBar title="Interview Prep AI" variant="landing" onAuthClick={() => setAuthModal('login')} />
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={12} />
            AI Powered
          </div>
          <h1 className="text-5xl font-black text-stone-900 leading-tight mb-6">
            Ace Interviews with{' '}
            <span className="text-green-400">AI-Powered</span> Learning
          </h1>
          <button
            onClick={() => setAuthModal('signup')}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-sm transition-colors text-sm"
          >
            Get Started
          </button>
        </div>

        <div className="flex-1 text-stone-600 text-base leading-relaxed font-medium ">
          Practice with role-specific questions, explore answers at your own pace, deepen your understanding of key concepts, and keep your preparation organized your way. Your complete interview toolkit, from start to finish.
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-stone-900 text-center mb-12">
            Features That Make You Shine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {FEATURES.slice(0, 3).map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.slice(3).map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

                                        

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={() => setAuthModal(null)}
        />
      )}
    </div>
  )
}

const FeatureCard = ({ title, desc }) => (
  <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
    <h3 className="font-bold text-stone-900 mb-2">{title}</h3>
    <p className="text-sm font-medium text-stone-500 leading-relaxed">{desc}</p>
  </div>
)

export default Landing
