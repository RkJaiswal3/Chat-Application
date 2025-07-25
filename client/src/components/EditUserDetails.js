import React, { useEffect, useRef, useState } from 'react'
import { Avatar } from './Avatar';
import uploadFile from '../helpers/uploadFile';
import { Divider } from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

export const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: '',
    profile_pic: ''
  });
  const fileInputRef = useRef();
  const dispatch = useDispatch();


  useEffect(() => {
    if (user) {
      setData({
        name: user?.name || '',
        profile_pic: user?.profile_pic || ''
      });
    }
  }, [user]);


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }

    });
  }

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current.click();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure at least one field is being updated
    if (!data.name && !data.profile_pic) {
      toast.error("Please provide a name or profile picture to update.");
      return;
    }

    // console.log("Submitting data:", data);

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update`;

      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // important to send cookies (token)
      });

      toast.success(response?.data?.message || "User updated successfully!");
      if (response?.data?.message) {
        dispatch(setUser(response?.data?.data));
      }
      onClose();
    } catch (error) {
      console.error("Update failed:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Update failed. Try again.");
    }
  };


  return (
    <div className='fixed bottom-0 top-0 left-0 right-0 bg-slate-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white p-4 m-1 w-full max-w-sm rounded'>

        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm'>Edit User Details</p>
        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name='name'
              id='name'
              value={data?.name}
              onChange={handleOnChange}
              className='w-full py-1 px-2 focus:outline-lime-200 border'
            />

            <div>Photo:</div>
            <div className='my-1 flex items-center gap-4'>
              <Avatar
                width={40}
                height={40}
                imageUrl={user?.profile_pic}
                name={user?.name}
              />
              <label htmlFor="profile">
                <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                <input
                  type="file"
                  id='profile'
                  className='hidden'
                  onChange={handleUploadPhoto}
                  ref={fileInputRef}
                />
              </label>
            </div>

          </div>
          <Divider />
          <div className='flex gap-2 w-fit ml-auto'>
            <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
            <button className='border-primary bg-primary text-white px-4 py-1 rounded hover:bg-secondary'>Save</button>
          </div>

        </form>
      </div >
    </div >
  )
}

