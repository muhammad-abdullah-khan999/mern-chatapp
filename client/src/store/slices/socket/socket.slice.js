import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  socket: null,
  onlineUsers: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      if (state.socket) return;
      console.log("action:", action);
      const socket = io(import.meta.env.VITE_DB_ORIGIN, {
        query: {
          userId: action.payload,
        },
      });
      state.socket = socket;
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { initializeSocket, disconnectSocket, setOnlineUsers } = socketSlice.actions;

export default socketSlice.reducer;
