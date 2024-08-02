import { Button, Spinner, Textarea, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import Comment from './Comment';
import Fotter from './Fotter';
function CommentSection({postId}) {
    const [comment,setComment] = useState('')
    const [loading,setLoading] = useState(false);
    const {user} = useSelector((state)=>state.User);
    const [allComments,setAllComments] = useState([]);
    
     const handleLike = (commentId,data)=>{

        try{
            console.log("Inside Handle like in Comment Section")
            console.log(data)
            setAllComments(allComments.map((cmt)=>
                cmt._id === commentId?{
                    ...cmt,
                    likes:data.likes,
                    numberOfLikes:data.likes.length
                }:cmt
            ))
            console.log(allComments)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        const getComments = async()=>{
            try{
                const resp  = await fetch(`/api/v1/comment/getComments/${postId}`)
                const data = await resp.json();
                console.log(data)
                if(data.success){
                    setAllComments(data.comments);
                }
            }catch(err){
                console.log(err);
            }
        }
        getComments()
    },[postId])


    const handleSubmit = async(e)=>{
        try{    
            setLoading(true)
            e.preventDefault();
            if(comment.length>200){
                setLoading(false);
                return ;
            }
            const resp = await fetch('/api/v1/comment/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({content:comment,postId,userId:user._id})
            })
            const data = await resp.json();
            if(data.success){
                setComment('');
                const resp  = await fetch(`/api/v1/comment/getComments/${postId}`)
                const data = await resp.json();
                console.log(data)
                if(data.success){
                    setAllComments(data.comments);
                }
            }
            setLoading(false);
        }catch(err){
            console.log(err);
            setLoading(false);
        }

    }
    const navigate = useNavigate();
   
    const handleEdit = async (comment, editedContent) => {
        setAllComments(
          allComments.map((c) =>
            c._id === comment._id ? { ...c, content: editedContent } : c
          )
        );
      };
      const handleDelete = async(comment)=>{
        setAllComments(
            allComments.filter((c)=>
            c._id !== comment._id)
        )
      }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {user?(
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                <p>Signed in as:</p>
                <img className='h-5 w-5 object-cover rounded-full'
                src={user.profilePicture} alt="User Profile Picture" />
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                @{user.username}
                </Link>
            </div>
        ):(
            <div className='text-sm text-teal-500 my-5 flex gap-1'>
                You must be signed in to comment.
                <Link to={'/login'} className='text-blue-500 hover:underline'>
                Sign In
                </Link>
            </div>
        )

        }
        {
            user &&(
                <form className='border border-teal-500 rounded-md p-3'
                onSubmit={handleSubmit}>
                    <Textarea placeholder='Add a comment...'
                    rows='5' maxLength={200}  
                    onChange={(e)=>setComment(e.target.value)}
                    value={comment}/>
                    <div className='flex justify-between items-center mt-5 '>
                        <p className='text-gray-500 text-xs'>{200-comment.length} characters remaining...</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                            {loading?(
                                <Spinner color="purple" size="md"/>
                            ):"Submit"
                        }
                        </Button>
                    </div>
                </form>
            )
        }
        {allComments.length === 0 ? (
    <p className='text-sm my-5'>No Comments</p>
) : (
    <>
        <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                <p>{allComments.length}</p>
                
            </div>
            
        </div>
        {allComments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike = {handleLike} onEdit = {handleEdit} onDelete={handleDelete}/>
        ))}
    </>
)}

    </div>
  )
}

export default CommentSection