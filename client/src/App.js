import React from 'react'
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

const App = () => {
  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App;