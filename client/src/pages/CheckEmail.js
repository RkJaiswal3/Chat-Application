import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";

export const CheckEmail = () => {
  const [data, setData] = useState({
    email: "",
  })
  const nagigate = useNavigate();
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(URL, data, {
        withCredentials: true
      });
      toast.success(response?.data?.message)
      if (response?.data?.success) {
        setData({
          email: "",
        })
        nagigate('/password', {
          state: response?.data?.data
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2'>
          <FaRegUserCircle
            size={70}
          />
        </div>
        <h3 className='text-primary text-center'>Welcome to Login Page !</h3>
        <form className='grid gap-4 mt-2' onSubmit={handleSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor="email">Email: </label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Enter email'
              className='bg-slate-100 py-1 px-2 focus:outline-primary'
              value={data.email}
              onChange={handleOnchange}
              required
            />
          </div>


          <button
            className='bg-primary px-4 py-1 hover:bg-secondary rounded mt-3 font-bold leading-relaxed tracking-wide'
          >
            Submit
          </button>

        </form>
        <p className='text-center my-2'>
          New User ? <Link to={"/register"} className='font-semibold hover:text-cyan-500 hover:underline'>Register</Link>
        </p>
      </div >
    </div >
  )
}
