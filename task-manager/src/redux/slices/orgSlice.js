import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeOrgId: null,
  activeOrgName: null,
  permissions: [],
  role: null,
};

const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    setActiveOrgId: (state, action) => {
      state.activeOrgId = action.payload;
    },
    setActiveOrgName: (state, action) => {
      state.activeOrgName = action.payload;
    },
    setPermission: (state, action) => {
      state.permissions = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setActiveOrgId, setActiveOrgName, setPermission, setRole } =
  orgSlice.actions;
export default orgSlice.reducer;
