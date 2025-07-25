import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { Avatar } from './Avatar'
import { FaImages } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import uploadFile from '../helpers/uploadFile';
import { IoCloseSharp } from "react-icons/io5";
import { Circular } from './Circular';
import backroundImage from '../assets/wallapaper.jpeg'
import { IoSend } from "react-icons/io5";
import moment from 'moment';


export const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const currentUser = useSelector(state => state?.user);



  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })
  const [openImageVideo, setOpenImageVideo] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })

  const [loading, setLoading] = useState(false);

  const [allMessage, setAllMessage] = useState([]);

  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {

      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })

    }
  }, [allMessage])


  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params?.userId);

      socketConnection.emit('seen', params?.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      })
      socketConnection.on('message', (data) => {
        setAllMessage(data);
      })
    }

  }, [socketConnection, params?.userId, currentUser]);

  const handleImageVideoUpload = () => {
    setOpenImageVideo(preve => !preve);
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideo(false)
    setMessage(preve => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setOpenImageVideo(false)

    setMessage(preve => {
      return {
        ...preve,
        videoUrl: uploadVideo.url
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage(preve => {
      return {
        ...preve,
        imageUrl: ""
      }
    })
  }

  const handleClearUploadVideo = () => {
    setMessage(preve => {
      return {
        ...preve,
        videoUrl: ""
      }
    })
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new-meassage', {
          sender: currentUser?._id,
          receiver: params?.userId,
          image: message.imageUrl,
          video: message.videoUrl,
          text: message.text,
          msByUserId: currentUser?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        })
      }
    }
  }

  // console.log("All message", allMessage);
  return (
    <div style={{ backgroundImage: `url(${backroundImage})` }} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 bg-white h-16 p-2 flex justify-between px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden '>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={40}
              height={40}
              name={dataUser?.name}
              imageUrl={dataUser?.profile_pic}
              _id={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {
                dataUser?.online ? <span className='text-green-500'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>
        <div className='p-2'>
          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical size={25} />
          </button>
        </div>
      </header>

      {/* all message showing here */}

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-40'>


        {/* {Showing all message here !} */}

        <div className="flex flex-col gap-2 py-2 px-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            const isCurrentUser = currentUser?._id === msg.msByUserId;

            return (
              <div
                key={index}
                className={`p-1 rounded max-w-[250px] md:max-w-sm lg:max-w-md w-fit ${isCurrentUser ? "ml-auto bg-teal-300" : "bg-white"
                  }`}
              >
                <div className="w-full">
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="message-image"
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {msg.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                {msg.text && <p className="px-3">{msg.text}</p>}
                <p className="px-3 text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh:mm A")}
                </p>
              </div>
            );
          })}
        </div>


        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-500 flex justify-center items-center bg-opacity-30'>
              <div className='w-fit absolute top-0 right-0 p-3 hover:text-red-500 cursor-pointer' onClick={handleClearUploadImage}>
                <IoCloseSharp size={35} />
              </div>
              <div className='bg-white p-3 rounded'>
                <img
                  src={message.imageUrl}
                  alt="uploadImage"
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>
            </div>
          )
        }

        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-500 flex justify-center items-center bg-opacity-30'>
              <div className='w-fit absolute top-0 right-0 p-3 hover:text-red-500 cursor-pointer' onClick={handleClearUploadVideo}>
                <IoCloseSharp size={35} />
              </div>
              <div className='bg-white p-3 rounded'>

                <video
                  src={message.videoUrl}
                  alt="Video Uploaded"
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }

        {
          loading && (
            <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>

              <Circular size={35} />
            </div>
          )
        }
      </section >
      {/**send message */}

      <header section className='h-16 bg-white flex items-center px-4' >
        <div className='relative'>
          <button onClick={handleImageVideoUpload} className='flex justify-center items-center w-12 h-12 hover:bg-primary hover:text-white rounded-full '>
            <FaPlus size={20} />
          </button>
        </div>

        {
          openImageVideo && (
            <div className='bg-white shadow rounded absolute bottom-16 w-36 p-2'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 px-3 hover:bg-slate-200 cursor-pointer'>
                  <div className='text-primary'>
                    <FaImages size={20} />
                  </div>
                  <p>
                    Image
                  </p>
                </label>
                <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3 px-3 hover:bg-slate-200 cursor-pointer'>
                  <div className='text-purple-400'>
                    <IoVideocam size={20} />
                  </div>
                  <p>
                    Video
                  </p>
                </label>

                <input
                  type="file"
                  id='uploadImage'
                  onChange={handleUploadImage}
                  className='hidden'
                />

                <input
                  type="file"
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                />
              </form>
            </div>
          )
        }

        <form className='w-full h-full flex justify-between' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder='Type here message...'
            className='py-1 px-4 w-full h-full  outline-none'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='hover:text-secondary text-primary'>
            <IoSend size={28} />
          </button>
        </form>
      </header >
    </div >
  );
}
