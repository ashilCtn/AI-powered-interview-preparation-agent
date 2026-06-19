import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Navbar = ({ onAuthClick }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF7]/90 backdrop-blur border-b border-stone-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-lg font-bold tracking-tight text-stone-900">
        Interview Prep AI
      </Link>

      {user ? (
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.name}`}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-stone-800">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={onAuthClick}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
        >
          Login / Sign Up
        </button>
      )}
    </nav>
  )
}

export default Navbar
