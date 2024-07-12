import { createSlice } from '@reduxjs/toolkit';
//
const initialState =  JSON.parse(localStorage.getItem('User')) ||{
  user: null,
  error: null,
  loading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signinstart(state) {
      state.error = null;
      state.loading = true;
     localStorage.setItem('User', JSON.stringify(state));
    },
    signinsuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.user = action.payload;
     localStorage.setItem('User', JSON.stringify(state));
    },
    signinfailure(state, action) {
      state.error = action.payload;
      state.loading = false;
      localStorage.setItem('User', JSON.stringify(state));
    },
    signupstart(state) {
      state.error = null;
      state.loading = true;
      localStorage.setItem('User', JSON.stringify(state));
    },
    signupsuccess(state) {
      state.error = null;
      state.loading = false;
      localStorage.setItem('User', JSON.stringify(state));
    },
    signupfailure(state, action) {
      state.error = action.payload;
      state.loading = false;
      localStorage.setItem('User', JSON.stringify(state));
    },
    logoutfailure(state, action) {
      state.error = action.payload;
      state.loading = false;
      localStorage.setItem('User', JSON.stringify(state));
    },
    logoutsuccess(state) {
      state.error = null;
      state.loading = false;
      state.user = null;
      localStorage.setItem('User', JSON.stringify(state));

    },
    updateStart(state){
      state.loading = true;
      state.error = null
    },
    updateSuccess(state,action){
      state.loading = false;
      state.error = null;
      state.user = action.payload;
      localStorage.setItem('User', JSON.stringify(state));
    },
    updateFailure(state,action){
      state.loading = false;
      state.error = action.payload;
    }

  }
});

export const {
  signinfailure,
  signinstart,
  signinsuccess,
  signupfailure,
  signupstart,
  signupsuccess,
  logoutfailure,
  logoutsuccess,
  updateFailure,
  updateStart,
  updateSuccess
} = userSlice.actions;

export default userSlice.reducer;
