import React from 'react'
import logo from '../assets/logo.png'

export const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
        <img src={logo} alt="logo" className='h-20 w-250' />
      </header>

      {children}
    </>
  )
}
