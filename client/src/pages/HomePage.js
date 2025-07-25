// src/pages/HomePage.jsx

import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import { Sidebar } from '../components/sidebar';
import logo from '../assets/logo.png'
import io from 'socket.io-client'


export const HomePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  console.log("User", user)
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user_details`;

      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);


  /**client socket- io to connect to the backend url */
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token'),
      }
    })

    socketConnection.on('onlineUser', (data) => {
      // console.log("Online user Data", data);
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))


    return () => {
      socketConnection.disconnect();
    }
  }, [])



  const basepath = location.pathname === '/';

  return (
    <div className='grid lg:grid-cols-[300px_1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basepath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basepath && "hidden"}`}>
        <Outlet />
      </section>
      <div className={`justify-center items-center flex-col gap-2 hidden ${!basepath ? "hidden" : "lg:flex "}`}>
        <div>
          <img src={logo} alt="logo" width={200} className='rounded' />
        </div>
        <p className='text-lg mt-2 text-slate-600'>Select user to send message !</p>
      </div>
    </div>
  );
};
