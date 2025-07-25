import React, { useEffect, useState } from 'react'
import { ImSearch } from "react-icons/im";
import { Circular } from './Circular';
import { UserCard } from './UserCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoCloseSharp } from "react-icons/io5";

export const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true)
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
      const response = await axios.post(URL, {
        search: search,
      })

      setLoading(false);

      setSearchUser(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    handleSearch();
  }, [search]);

  console.log("Search User", searchUser)


  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
      <div className='w-full max-w-lg mx-auto mt-10'>
        {/* {input search user} */}
        <div className='bg-white rounded h-14 overflow-hidden flex'>
          <input
            type="text"
            name='user'
            placeholder='Search User by name, email...'
            className='w-full py-1 px-4 outline-none h-full'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className='h-14 w-14 flex justify-center items-center'>
            <ImSearch size={20} />
          </div>
        </div>

        {/* {display serach user} */
        }
        <div className='w-full bg-white mt-2 p-4 rounded'>
          {
            searchUser.length === 0 && !loading && (
              <p className='text-center text-slate-400'>No user found !</p>
            )
          }

          {
            loading && (
              <div className='flex justify-center'>
                <Circular />
              </div>
            )
          }

          {
            searchUser !== 0 && !loading && (
              searchUser.map((user, index) => {
                return (
                  <UserCard key={user._id} user={user} onClose={onClose} />
                )
              })
            )
          }
        </div>
      </div>
      <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white cursor-pointer' onClick={onClose}>
        <button>
          <IoCloseSharp />
        </button>
      </div>
    </div>
  )
}
