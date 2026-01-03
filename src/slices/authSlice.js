import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile_image:"",
  signupData: null,
  reset_pass_token: null,
  loading: false,
  reset_pass_form: null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload));
    },

    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setReset_pass_token(state, action) {
      state.reset_pass_token = action.payload;
    },

    setReset_pass_form(state, action) {
      state.reset_pass_form = action.payload;
    },

    setSign_up_data(state, action) {
      state.signupData = {
        ...state.signupData,
        ...action.payload,
      };
    },
    setProfile_image(state,value){
        state.profile_image=value.payload;
    }
  },
});

export const {
    setProfile_image,
  setToken,
  clearToken,
  setLoading,
  setReset_pass_token,
  setReset_pass_form,
  setSign_up_data,
} = authSlice.actions;

export default authSlice.reducer;
