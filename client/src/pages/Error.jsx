import React from 'react'
import pagenotfound from '/Users/aditya/Desktop/Blog App/client/src/components/222466-P1PI8H-417.jpg'
import {Link} from 'react-router-dom'
import Fotter from '../components/Fotter'
function Error() {
  return (
    <div className='min-h-screen flex flex-col items-center'>
        <div className='w-80 h-80 mt-20'>
            <img src={pagenotfound} alt="" srcset="" className='rounded-3xl'/>
        </div>
        <div className='dark:text-gray-300 text-gray-800 mt-10 font-extrabold text-3xl text-center'>Page Not Found</div>
        <div className='w-[460px] text-center font-semibold mt-4 dark:text-gray-400 text-gray-800'>
        There may be a typing mistake in the address Or the page may have been moved.
        </div>
        <div className='dark:text-gray-300 text-gray-800 mt-5 font-bold text-center'>
           <Link to='/'>Go To Home
           <div> <hr className='font-bold' /></div></Link>
          
        </div>
        <Fotter/>
    </div>
  )
}

export default Error