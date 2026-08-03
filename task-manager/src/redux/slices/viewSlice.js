import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectView: "Grid",
  projectDetailView: "List",
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setProjectView: (state, action) => {
      state.projectView = action.payload;
    },
    setProjectDetailView: (state, action) => {
      state.projectDetailView = action.payload;
    },
  },
});

export const { setProjectView, setProjectDetailView } = viewSlice.actions;
export default viewSlice.reducer;
