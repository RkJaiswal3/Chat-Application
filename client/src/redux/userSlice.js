import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: ""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, actions) => {
      state._id = actions.payload._id
      state.name = actions.payload.name
      state.email = actions.payload.email
      state.profile_pic = actions.payload.profile_pic
    },
    setToken: (state, actions) => {
      state.token = actions.payload
    },
    logout: (state, actions) => {
      state._id = ""
      state.name = ""
      state.email = ""
      state.profile_pic = ""
      state.token = ""
      state.socketConnection = ""
    },
    setOnlineUser: (state, actions) => {
      state.onlineUser = actions.payload
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions

export default userSlice.reducer

