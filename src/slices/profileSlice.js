import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if available
const userFromStorage = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userFromStorage || null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
 
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
