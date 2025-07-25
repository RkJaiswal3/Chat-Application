import React, { useEffect, useState } from 'react'
import { HiChatAlt } from "react-icons/hi";
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from './Avatar';
import { EditUserDetails } from './EditUserDetails';
import { Divider } from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import { SearchUser } from './SearchUser';
import { logout } from '../redux/userSlice';

export const Sidebar = () => {


  const user = useSelector((state) => state.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('sidebar', user._id);
      // socketConnection.on('conversation', (data) => {
      //   console.log("Conversation Data : ", data);

      //   const conversationUser = data.map((conversationUser, index) => {
      //     if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
      //       return {
      //         ...conversationUser,
      //         userDetails: conversationUser?.sender
      //       }
      //     }
      //     else if (conversationUser?.receiver !== user?._id) {
      //       return {
      //         ...conversationUser,
      //         userDetails: conversationUser.receiver
      //       }
      //     }
      //     else {
      //       return {
      //         ...conversationUser,
      //         userDetails: conversationUser.sender
      //       }
      //     }
      //   })
      //   setAllUser(conversationUser);
      // })
      socketConnection.on('conversation', (data) => {
        // console.log("Conversation Data: ", data);

        const conversationUser = data.map((conversation, index) => {
          const otherUser = conversation.sender._id === user._id
            ? conversation.receiver
            : conversation.sender;

          return {
            ...conversation,
            userDetails: otherUser
          }
        });

        setAllUser(conversationUser);
      });

    }
  }, [socketConnection, user])

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  }

  return (
    <div className='w-full h-full grid grid-cols-[54px_1fr] bg-white'>
      <div className='bg-slate-100 w-14 h-full rounded-tr-lg rounded-br-md py-5 flex flex-col justify-between'>
        <div>
          <NavLink className={({ isActive }) => `w-14 h-14 flex justify-center items-center hover:bg-slate-300 cursor-pointer ${isActive && "bg-slate-200"}`} title='Chat'>
            <HiChatAlt size={30} />
          </NavLink>
          <div onClick={() => setOpenSearchUser(true)} className='w-14 h-14 flex justify-center items-center hover:bg-slate-300 cursor-pointer' title='Add A/c'>
            <FaUserPlus size={30} />
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <button className='mb-2' title={user?.name} onClick={() => setEditUserOpen(true)}>
            <div className='mb-4'>
              <Avatar
                width={40}
                height={38}
                name={user?.name}
                imageUrl={user?.profile_pic}
                userId={user?._id}
              />
            </div>
          </button>
          <button className='w-14 h-14 flex justify-center items-center hover:bg-slate-300 cursor-pointer' title='Logout' onClick={handleLogout}>
            <span className='-ml-2'>
              <BiLogOut size={30} />
            </span>
          </button>
        </div>
      </div>
      <div className='w-full'>
        <div className='h-16 flex items-center'>
          <h2 className='text-lg font-bold p-4 text-slate-800' >Messages </h2>
        </div>
        <div className='bg-slate-300 p-[0.5px]'></div>
        <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
          {
            allUser.length === 0 && (
              <div className='mt-10'>
                <div className='flex justify-center items-center my-4 text-slate-400'>
                  <FiArrowUpLeft size={50} />
                </div>
                <p className='text-lg text-center text-slate-400'>Explore users to a conversation !</p>
              </div>
            )
          }

          {
            allUser.map((conv, index) => {
              return (
                <NavLink to={"/" + conv?.userDetails?._id} className='flex items-center gap-2 py-3 px-2 border hover:border-primary border-transparent rounded hover:bg-slate-100 cursor-pointer' key={conv?._id}>
                  <div>
                    <Avatar
                      imageUrl={conv?.userDetails?.profile_pic}
                      name={conv?.userDetails?.name}
                      width={40}
                      height={40}

                    />
                  </div>
                  <div>
                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                    <div className='text-slate-500 text-xs flex items-center gap-1'>
                      <div className='flex items-center gap-1'>
                        {
                          conv?.lastMsg?.imageUrl && (
                            <div className='flex items-center gap-1'>
                              <span>
                                <FaImage />
                              </span>
                              {!conv?.lastMsg?.text && <span>Image</span>}
                            </div>

                          )
                        }
                        {
                          conv?.lastMsg?.videoUrl && (

                            <div className='flex items-center gap-1'>
                              <span>
                                <FaVideo />
                              </span>
                              {!conv?.lastMsg?.text && <span>Video</span>}
                            </div>
                          )
                        }
                      </div>
                      <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                    </div>

                  </div>
                  {
                    Boolean(conv?.unseenMsg) && (

                      <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto bg-primary font-semibold p-1 text-white rounded-full '>{conv?.unseenMsg}</p>
                    )
                  }
                </NavLink>

              )
            })
          }
        </div>
      </div>

      {/**edit user details**/}

      {
        editUserOpen && (
          <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
        )
      }

      {/* {Serach user } */}
      {
        openSearchUser && (
          <SearchUser onClose={() => setOpenSearchUser(false)} />
        )
      }
    </div >
  )
}

