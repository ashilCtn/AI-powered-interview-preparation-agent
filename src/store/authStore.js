// This store manages: who is logged in, login, signup, logout
// Think of it as a "global variable" for user state that any component can read

import { create } from 'zustand'
import { apiLogin, apiSignup } from '../utils/api.js'

const useAuthStore = create((set) => ({
  // State 
  // Try to load user from localStorage so they stay logged in on refresh
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // Actions 

  // Called when user fills the signup form
  signup: async (name, email, password) => {
    set({ loading: true, error: null })
    try {
      const data = await apiSignup(name, email, password)
      // Save token + user to localStorage so they persist on refresh
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return true // success
    } catch (err) {
      set({ error: err.message, loading: false })
      return false // failed
    }
  },

  // Called when user fills the login form
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const data = await apiLogin(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return true
    } catch (err) {
      set({ error: err.message, loading: false })
      return false
    }
  },

  // Called when user clicks Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  // Clear any error message
  clearError: () => set({ error: null }),
}))

export default useAuthStore
