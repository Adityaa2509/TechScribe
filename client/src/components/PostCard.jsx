import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
function PostCard({post}) {
  const {user} = useSelector((state)=>state.User)
  return (
    <div className='group relative w-[360px] border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg  transition-all'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
      {!user.isAdmin && post.isPaid ? (
              <span className='bg-blue-500 text-white text-xs px-2 py-1 ml-[-12px] mt-[-12px] rounded-br-md w-10'>Paid</span>
            ) : (!user.isAdmin &&
              <span className='bg-green-500 text-white text-xs px-2 py-1 ml-[-12px] mt-[-12px] 
              w-10 rounded-br-md'>Free</span>
            )}
        <p className='text-lg font-semibold line-clamp-2 text-gray-500'>{post.title}</p>
        
        <span className='italic text-sm text-gray-500'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2   m-2 rounded-lg'
        >
          Read article
        </Link>
      </div>
    </div>
  )
}

export default PostCard