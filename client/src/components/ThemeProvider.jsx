import React from 'react'
import {useSelector} from 'react-redux'
function ThemeProvider({children}) {
    const {theme} = useSelector((state)=>state.Theme)
  return (
    <div className={theme}>
        <div className='bg-white text-gray-700 dark:text-gray:200 dark:bg-[rgb(16,23,42)]'>
        {children}
        </div>
    </div>
  )
}

export default ThemeProvider