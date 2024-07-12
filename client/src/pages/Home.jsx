import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';

function Home() {
    const [posts, setPosts] = useState([]);
    const {user} = useSelector((state) => state.User);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch('/api/v1/post/all?limit=3');
            const data = await res.json();
            let filteredPosts = data.posts;
          console.log(data.posts)
          console.log(user+"tahi aaja")
            let isAdmin = false
            if(user)
           isAdmin = user && user.isAdmin;
        console.log(filteredPosts)
            console.log(isAdmin)
            if (!isAdmin) {
                filteredPosts = filteredPosts.filter(post => post.isPublic);
            }
            console.log(filteredPosts)
            setPosts(filteredPosts);
        };
        fetchPosts();
    }, [user]);

    return (
        <div>
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='text-7xl font-bold '>Welcome to TechScribe</h1>

                <p className='text-gray-400 text-lg '>
                    Explore a world of innovation and creativity in technology. From web development to machine learning, Tech Bytes is your go-to destination for insightful articles, tutorials, and updates in the world of tech and coding.
                </p>
                 {user ? (
                    <Link
                        to='/search'
                        className='text-md  text-green-500 font-bold hover:underline'
                    >
                        View all posts...
                    </Link>
                ) : (
                    <Link
                        to='/login'
                        className='text-md  text-green-500 font-bold hover:underline'
                    >
                        Sign in to view all posts...
                    </Link>
                )}
            </div>

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
                {posts && posts.length > 0 && (
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-2xl font-semibold text-center text-gray-500'>Recent Posts</h2>
                        <div className='flex flex-wrap gap-6 '>
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                   {user ? (
                    <Link
                        to='/search'
                        className='text-md  text-green-500 font-bold hover:underline'
                    >
                        View all posts...
                    </Link>
                ) : (
                    <Link
                        to='/login'
                        className='text-md  text-green-500 font-bold hover:underline'
                    >
                        Sign in to view all posts...
                    </Link>
                )}  </div>
                )}
            </div>
        </div>
    );
}

export default Home;
