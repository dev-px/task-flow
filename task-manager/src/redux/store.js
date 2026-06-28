import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "@/redux/slices/boardSlice";
import authReducer from "@/redux/slices/authSlice";
import orgReducer from "@/redux/slices/orgSlice";
import api from "./services/api.js";

const makeStore = () =>
  configureStore({
    reducer: {
      board: boardReducer,
      auth: authReducer,
      org: orgReducer,

      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(api.middleware);
    },
  });

export default makeStore;
