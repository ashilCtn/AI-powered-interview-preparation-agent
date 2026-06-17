import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Root = () => {


  return (
    <div className="min-h-screen bg-white font-sans">
      <Outlet />
    </div>
  )
}

export default Root
