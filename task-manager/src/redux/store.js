import api from "./services/api.js";
import orgReducer from "@/redux/slices/orgSlice";
import socketMiddleware from './socketMiddleware';
import authReducer from "@/redux/slices/authSlice";
import boardReducer from "@/redux/slices/boardSlice";
import memberReducer from "@/redux/slices/memberSlice";
import socketReducer from "@/redux/slices/socketSlice";
import { configureStore } from "@reduxjs/toolkit";

const makeStore = () =>
  configureStore({
    reducer: {
      board: boardReducer,
      auth: authReducer,
      org: orgReducer,
      member: memberReducer,
      socket: socketReducer,
      
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(api.middleware, socketMiddleware());
    },
  });

export default makeStore;
