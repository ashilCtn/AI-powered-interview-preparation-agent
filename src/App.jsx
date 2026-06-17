import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Root from './layouts/Root'
import Landing from './pages/Landing'
import Session from './pages/Session'
import Dashboard from './pages/Dashboard'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Landing />} />
        <Route path="session/:id" element={<Session />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}

export default App