import { createSlice } from '@reduxjs/toolkit';
//
const initialState =  JSON.parse(localStorage.getItem('Theme')) ||{
  theme:'light'
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
      toogleTheme(state) {
       state.theme = state.theme === 'light'?'dark':'light'
       localStorage.setItem('Theme', JSON.stringify(state));
      }
    }
})  
export const {
toogleTheme
} = themeSlice.actions;
  
  export default themeSlice.reducer;
  
