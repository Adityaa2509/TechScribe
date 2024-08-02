import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../index.css'
import DOMPurify from 'dompurify';
import CommentSection from '../components/CommentSection';
import { useSelector } from 'react-redux';
import { FaThumbsUp } from 'react-icons/fa';
import Fotter from '../components/Fotter';
function PostPage() {
    let {slug} = useParams();
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [post,setPost] = useState(null);
    const {user} = useSelector((state) => state.User)
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchPost = async()=>{
            try{
                console.log(slug)
                setLoading(true);
                const resp = await fetch(`/api/v1/post/all?slug=${slug}`);
                const data = await resp.json();
                console.log(data.posts[0])
                if(!resp.ok){
                    setError(true);
                    setLoading(false);
                    return ;
                }
                console.log(user.subscriptionPlan.plan)
               if(!user.isAdmin && (data.posts[0].isPaid && user.subscriptionPlan.plan === 'none')){
                navigate('/paymentPlans');
                return ;
               }
                setPost(data.posts[0]);
               
                setLoading(false);
                setError(false);


            }catch(err){
                console.log(err);
                setError(true);
                setLoading(false);
            }
        }   
        fetchPost();
    },[slug])
   
    const handleLike = async()=>{
        try{
            const resp = await fetch(`/api/v1/post/like/${post._id}`,{method:'PUT'});
            const data = await resp.json();
            if(data.success === true){
                console.log(data);
                setPost((prev) => ({
                    ...prev,
                    likes: data.post.likes,
                    numberOfLikes: data.post.likes.length
                }))

            }
        }catch(err){
            console.log(err);
        }
    }

    return (
    <div>
        {loading?<div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl'/></div>
        :<></>
        }
        {
            !loading?<main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
                <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>

                <Link to={`/search?category=${post && post.category}`}
                className='self-center mt-5 '>
                <Button color='gray' pill size='sm'>{post && post.category}</Button>
                </Link>

                <img
                    src={post && post.image}
                    alt="Post Banner"
                    className='max-w-80 max-h-30 mt-10 mb-10 self-center border-gray-500 border-2 rounded-md'
                />
             {
               post &&<div className='flex justify-end items-center mb-10'>
                <div className='mr-64 flex gap-3'>
                <button
                        type='button'
                        onClick={handleLike}
                        className={`text-gray-400 hover:text-blue-500 ${
                          user &&
                          post.likes.includes(user._id) &&
                          '!text-blue-500'
                        }`}
                      >
                        <FaThumbsUp className='text-3xl' />
                      </button>
                      <p className='text-gray-400 mt-'>
                        {post.numberOfLikes > 0 &&
                          post.numberOfLikes +
                            ' ' +
                            (post.numberOfLikes === 1 ? 'like' : 'likes')}
                      </p></div></div>
            }
                <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                    <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className='italic'>{post && (post.content.length/1000).toFixed(0)-'0'+1} mins read</span>
                </div>
                <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html:post && post.content}}>

                </div>
           
               {post &&
                <CommentSection postId = {post._id}/>}
            </main>:<></>
        }
<Fotter/>
    </div>
  )
}

export default PostPage