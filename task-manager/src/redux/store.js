import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "@/redux/slices/boardSlice";

const makeStore = () => configureStore({
    reducer: {
        board: boardReducer
    }
})

export default makeStore;