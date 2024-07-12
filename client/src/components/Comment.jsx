import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Button, ButtonGroup, Spinner, Textarea,Modal } from 'flowbite-react';
import { FaThumbsUp } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
function Comment({comment,onLike,onEdit,onDelete}) {
    const [user,setUser] = useState(null);
    const currUser = useSelector((state)=>state.User.user)
    console.log("me mysel--> ",currUser)
    const [openModal, setOpenModal] = useState(false);
    useEffect(()=>{
        setUser(comment.userId)
    },[comment])
    console.log(user)
    const [editing,setEditing] = useState(false)
    const [editcontent,setEditContent] = useState(comment.content);
    const [loading,setLoading] = useState(false);
    const handleEdit = async()=>{
        try{
            setEditing(true);
            

        }catch(err){
            console.log(err)
        }
    }
    const handleSave = async()=>{
        try{
            setLoading(true);
            console.log("bale bale -->  ",comment.userId._id)
            console.log("thale thale -->  ",currUser._id)
            const resp = await fetch(`/api/v1/comment/editComment/${comment._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    content:editcontent
                })
            })
            const data = await resp.json();
            if(data.success === true){
                setEditing(false);
                onEdit(comment,editcontent);
            }
            else{
                setEditing(false);
            }
            setLoading(false);

        }catch(err){    
            console.log(err)
        }
    }
    const handleDelete = async()=>{
        try{
            setOpenModal(true)
        }catch(err){
            console.log(err)
        }
    }
    const handleLike = async()=>{
        try{
           
            if(!user){
                navigate('/login');
                return ;
            }
            const resp = await fetch(`/api/v1/comment/likeOnComment/${comment._id}`,{
                method:'PUT',
            })
            const data = await resp.json();
            console.log("inside onlike")
           console.log(data.comment)
            if(data.success === true){
                onLike(comment._id,data.comment)
                
            }

           console.log('Handle Like Bhaiya')
           console.log(currUser._id)
           console.log(comment.likes)
        }catch(err){
            console.log(err)
        }
    }

  return (
    <>
    {
        user && 
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3 '>
            <img src={user.profilePicture} alt={user.username} className='w-10 h-10 rounded-full bg-gray-300 '/>
        </div>
        <div className='flex-1 '>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-sx truncate'>
                    {user?`@${user.username}`:'anonymous User'}
                </span>
                <span className='text-gray-500 text-xs '>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            {
                editing ?(<>
                    <Textarea className='w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none focus:bg-gray-100'
                    rows='3' value={editcontent} onChange={(e)=>setEditContent(e.target.value)}/>
                    <div className='flex justify-end gap-4 mt-4'>
                        <Button size='sm' gradientDuoTone='purpleToBlue' type='button' outline
                        onClick={handleSave}>
                           {
                            loading ?
                            <Spinner color="info" aria-label="Info spinner example"/>:"Save"
                           }
                        </Button>
                        <Button size='sm' gradientDuoTone='purpleToBlue' type='button' outline
                        onClick={()=>{setEditing(false);setEditContent(comment.content)}}>
                            Cancel
                        </Button>
                    </div>
                    </>
                ):(<>
                    <p className='text-gray-400 pb-2'>{comment.content}</p>
                    <div className='flex flex-row gap-2'>
                    <button
                        type='button'
                        onClick={handleLike}
                        className={`text-gray-400 hover:text-blue-500 ${
                          user &&
                          comment.likes.includes(currUser._id) &&
                          '!text-blue-500'
                        }`}
                      >
                        <FaThumbsUp className='text-sm' />
                      </button>
                      <p className='text-gray-400'>
                        {comment.numberOfLikes > 0 &&
                          comment.numberOfLikes +
                            ' ' +
                            (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                      </p>
                      {
                            currUser && (currUser._id  === comment.userId._id || currUser.isAdmin)&&(
                                <button type='buttom' className='text-gray-400 hover:text-blue-500'
                                onClick={handleEdit}>
                                    Edit
                                </button>
                            )
                        }
                         {
                            currUser && (currUser._id  === comment.userId._id || currUser.isAdmin)&&(
                                <button type='buttom' className='text-gray-400 hover:text-blue-500'
                                onClick={handleDelete}>
                                    Delete
                                </button>
                            )
                        }
                    </div>
                    </>
                )
            }
           
           
        </div>
    </div>
    }
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={async() => {
                 const resp = await fetch(`/api/v1/comment/deleteComment/${comment._id}`,{
                    method:"DELETE",
                    headers:{'Content-Type':'application/json'},
                })
                  const data = await resp.json();

                  console.log(data)
                
                    if(data.success === true){
                        onDelete(data.comment)
                    }
                setOpenModal(false)}}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Comment