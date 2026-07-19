import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnectionState: (state, action) => {
      state.isConnected = action.payload;
    },
    // These are "trigger" actions for the middleware.
    // They don't change state directly here.
    connectSocket: () => {},
    disconnectSocket: () => {},
  },
});

export const { setConnectionState, connectSocket, disconnectSocket } =
  socketSlice.actions;

export default socketSlice.reducer;
