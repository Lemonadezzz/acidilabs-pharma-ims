import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDrawerOpen: false,
  isNotificationDrawerOpen: false,
};

const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    toggleNotificationDrawer: (state) => {
      state.isNotificationDrawerOpen = !state.isNotificationDrawerOpen;
    },
  },
});

export const { toggleDrawer, toggleNotificationDrawer } = rootSlice.actions;

export default rootSlice.reducer;
