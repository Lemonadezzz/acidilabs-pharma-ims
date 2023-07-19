import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  userData: null,
  permissions: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // storing user data in redux store
    storeLoginData: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token ? action.payload.token : state.token;
      state.userData = action.payload;
      state.permissions = action.payload.permissions;
    },
    // persist token from local storage
    persistToken: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    // persist user data from local storage
    persistUserData: (state, action) => {
      state.userData = action.payload;
      state.permissions = action.payload.permissions;
    },

    // lougout user
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userData = null;
      state.permissions = {};
    },
  },
});

export const { storeLoginData, persistToken, persistUserData, logout } =
  authSlice.actions;

export default authSlice.reducer;
