import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import ThemeProvider from './components/ThemeProvider.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </Provider>
)
