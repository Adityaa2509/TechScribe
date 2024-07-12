import {configureStore} from '@reduxjs/toolkit'
import UserReducer from '../features/User'
import ThemeReducer from '../features/Theme'
const store = configureStore({
    reducer:{
        User:UserReducer,
        Theme:ThemeReducer
    }
})

export default store;