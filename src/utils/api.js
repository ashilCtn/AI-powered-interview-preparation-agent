// This file handles ALL communication with your backend.
// Every function here talks to one API endpoint.

const BASE_URL = 'http://localhost:5000/api' // change this to your backend URL

// Helper: makes the fetch call and returns the data (or throws an error)
const request = async (method, path, body = null) => {
  // Get the token saved in localStorage (set after login/signup)
  const token = localStorage.getItem('token')

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // If we have a token, send it so the backend knows who we are
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    // Only include body for POST/PATCH/PUT
    ...(body && { body: JSON.stringify(body) }),
  }

  const res = await fetch(`${BASE_URL}${path}`, options)
  const data = await res.json()

  // If the server returned an error, throw it so we can catch it in the store
  if (!res.ok) throw new Error(data.message || 'Something went wrong')

  return data
}

// AUTH 
export const apiSignup = (name, email, password) =>
  request('POST', '/auth/signup', { name, email, password })

export const apiLogin = (email, password) =>
  request('POST', '/auth/login', { email, password })


// SESSIONS 
export const apiGetSessions = () =>
  request('GET', '/sessions')

export const apiGetSession = (id) =>
  request('GET', `/sessions/${id}`)

export const apiCreateSession = (form) =>
  request('POST', '/sessions', form)

export const apiDeleteSession = (id) =>
  request('DELETE', `/sessions/${id}`)

export const apiLoadMore = (id) =>
  request('POST', `/sessions/${id}/load-more`)

// ── Q&A ───────────────────────────────────────────────
export const apiUpdateQna = (sessionId, qnaId, updates) =>
  request('PATCH', `/sessions/${sessionId}/qna/${qnaId}`, updates)

export const apiLearnMore = (topic, role) =>
  request('POST', '/sessions/learn-more', { topic, role })
