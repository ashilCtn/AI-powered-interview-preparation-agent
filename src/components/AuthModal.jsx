import React, { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const AuthModal = ({ mode = 'login', onClose }) => {
  const [view, setView] = useState(mode)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  // Pull what we need from the auth store
  const { login, signup, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    clearError() // clear error when user types
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    let success = false

    if (view === 'signup') {
      success = await signup(form.name, form.email, form.password)
    } else {
      success = await login(form.email, form.password)
    }

    if (success) {
      onClose()
      navigate('/dashboard') // go to dashboard after login/signup
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
          <X size={18} />
        </button>

        {/* Error message from backend */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        {view === 'signup' ? (
          <>
            <h2 className="text-2xl font-bold text-stone-900 mb-1">Create an Account</h2>
            <p className="text-sm text-stone-500 mb-6">Join us today by entering your details below.</p>

            <div className="space-y-4">
              <Field label="Full Name" name="name" placeholder="John" value={form.name} onChange={handleChange} />
              <Field label="Email Address" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
              <PasswordField
                label="Password" name="password" placeholder="Min 8 Characters"
                value={form.password} show={showPassword}
                onToggle={() => setShowPassword(!showPassword)} onChange={handleChange}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Spinner /> : 'SIGN UP'}
            </button>
            <p className="text-center text-sm text-stone-500 mt-4">
              Already an account?{' '}
              <button onClick={() => { clearError(); setView('login') }} className="text-orange-500 font-semibold hover:underline">Login</button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-stone-900 mb-1">Welcome Back</h2>
            <p className="text-sm text-stone-500 mb-6">Please enter your details to log in</p>

            <div className="space-y-4">
              <Field label="Email Address" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
              <PasswordField
                label="Password" name="password" placeholder="Min 8 Characters"
                value={form.password} show={showPassword}
                onToggle={() => setShowPassword(!showPassword)} onChange={handleChange}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Spinner /> : 'LOGIN'}
            </button>
            <p className="text-center text-sm text-stone-500 mt-4">
              Don't have an account?{' '}
              <button onClick={() => { clearError(); setView('signup') }} className="text-orange-500 font-semibold hover:underline">SignUp</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// Small reusable pieces
const Field = ({ label, name, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
    <input
      name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-stone-50"
    />
  </div>
)

const PasswordField = ({ label, name, placeholder, value, show, onToggle, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
    <div className="relative">
      <input
        name={name} type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-stone-50 pr-10"
      />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
)

const Spinner = () => (
  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
)

export default AuthModal
