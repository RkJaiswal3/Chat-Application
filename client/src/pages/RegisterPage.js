// eslint-disable-next-line
import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import toast from 'react-hot-toast';
import axios from 'axios';

export const RegisterPage = () => {

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  })

  const [uploadPhoto, setUploadPhoto] = useState("");
  const nagigate = useNavigate();

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);
    // console.log("Upload photo", uploadPhoto)
    setUploadPhoto(file);
    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }

    })

  }

  const handleOnchange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleClearUploadPht = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadPhoto(null);
  }
  // console.log(data)

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message)
      if (response?.data?.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        })
        nagigate('/email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
    // console.log("Data", data)
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <h3 className='text-primary text-center'>Welcome to the Chat App !</h3>
        <form className='grid gap-4 mt-2' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name">Name: </label>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='Enter name'
              className='bg-slate-100 py-1 px-2 focus:outline-primary'
              value={data.name}
              onChange={handleOnchange}
              required
            />
          </div>
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
          <div className='flex flex-col gap-1'>
            <label htmlFor="profile_pic">Photo:

              <div className='h-14 flex justify-center items-center bg-slate-200 rounded border hover:border-primary cursor-pointer '>
                <h1 className='text-sm'>
                  {
                    uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"
                  }
                </h1>

                {
                  uploadPhoto?.name && (
                    <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPht}>
                      <RxCross2 />
                    </button>
                  )
                }

              </div>
            </label>
            <input
              type='file'
              name='profile_pic'
              id='profile_pic'
              className='bg-slate-100 py-1 px-2 focus:outline-primary hidden'
              onChange={handleUploadPhoto}
            />
          </div>
          <button
            className='bg-primary px-4 py-1 hover:bg-secondary rounded mt-3 font-bold leading-relaxed tracking-wide'
          >
            Register
          </button>

        </form>
        <p className='text-center my-2'>
          Alread have a Account ? <Link to={"/email"} className='font-semibold hover:text-cyan-500 hover:underline'>Login</Link>
        </p>
      </div >
    </div >
  )
}
