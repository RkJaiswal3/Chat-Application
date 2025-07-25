import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../redux/userSlice';

export const CheckPassword = () => {
  const [data, setData] = useState({
    password: ""
  })

  const navigate = useNavigate();
  const location = useLocation();
  const disptatch = useDispatch();

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
    // console.log('Location', location);

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`
    const requestData = {
      password: data.password,
      userId: location?.state?._id // or however you get it
    };
    try {
      const response = await axios.post(URL, requestData, {
        withCredentials: true
      });
      toast.success(response?.data?.message)

      if (response?.data?.success) {
        disptatch(setToken(response?.data?.token));
        localStorage.setItem('token', response?.data?.token)
        setData({
          password: ""
        })
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }

  }
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        {location?.state?.profile_pic &&
          (
            <div style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
              <img

                src={location.state.profile_pic}
                alt="user_photo"
                width={100}
                height={100}
              />
            </div>
          )
        }
        {!location?.state?.profile_pic &&
          (
            <div style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
              <FaRegUserCircle size={100} />
            </div>
          )

        }


        <h3 className='text-primary text-center'>Welcome to Login Page !</h3>
        <form className='grid gap-4 mt-2' onSubmit={handleSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor="password">Password: </label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Enter password'
              className='bg-slate-100 py-1 px-2 focus:outline-primary'
              value={data.password}
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
