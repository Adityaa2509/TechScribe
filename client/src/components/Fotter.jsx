import React from 'react'

function Fotter() {
  return (
    <footer className='dark:bg-gray-800 bg-gray-300 dark:text-white text-gray-800 py-6 mt-40 w-full'>
    <div className='container mx-auto text-center'>
    <p className='text-lg font-semibold mb-2'>Discover the Future of Tech with TechScribe</p>
      <p className='text-sm italic mb-4'>
        At TechScribe, we bring you the latest insights and trends in the tech industry. Our carefully curated articles and exclusive content are designed to keep you ahead of the curve. Dive into our diverse range of topics and stay informed with the most relevant and up-to-date tech news. Whether you're a tech enthusiast or a professional, TechScribe has something for everyone. Explore now and stay connected!
      </p>
      <div className='text-xs'>
        <span>© {new Date().getFullYear()} TechScribe. All rights reserved.</span>
      </div>
    </div>
  </footer>
  )
}

export default Fotter