import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Button, Modal, Table } from "flowbite-react";
import {Link, useNavigate} from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function DashComments() {
const navigate = useNavigate();
  const {user} = useSelector((state)=>state.User);
  console.log(user)
  const [comments,setcomments] =  useState([])
  const [showMore,setShowMore] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const[pid,setPid] = useState(0);
  console.log(comments);
  useEffect(()=>{
      const fetchComments = async()=>{
        const resp = await fetch(`/api/v1/comment/getAll`);
        const data = await resp.json();
        console.log(data)
        if(data.success === true)
          {setcomments(data.comments)
            if(data.comments.length<9)
              setShowMore(false)
          }
      }
      if(user.isAdmin)fetchComments()
        console.log(comments)
  },[user._id])
const handleShowMore = async()=>{
  const startindex = comments.length;
  try{
    const resp = await fetch(`/api/v1/comment/getAll?startIndex=${startindex}`);
    const data = await resp.json();
    if(data.success === true)
      {setcomments((prev)=>[...prev,...data.comments])
        if(data.comments.length<9)
          setShowMore(false)
      }
  
} catch(err){
    console.log(err);
    return resp.json({
      msg:"Internal Server Error",
      success:false,
      status:500
    })
  }
  
}

  return (
    <div className='flex justify-center  p-3'>
      {
        user.isAdmin && comments.length>0?(
          <div className='flex flex-col pl-36'>
          <Table hoverable className='shadow-md mb-20 mt-4'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>User Profile</Table.HeadCell>
                <Table.HeadCell>Comment</Table.HeadCell>
                <Table.HeadCell>Number Of Likes</Table.HeadCell>
                <Table.HeadCell >Delete</Table.HeadCell>
               
              </Table.Head>
              {
                comments.map((comment)=>(
                  <Table.Body className='divide-y'>
                      <Table.Row className='bg-white  dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                      
                        <Table.Cell className='hover:underline '>
                          <Link to={`/post/${comment.postId.slug}`} blank>
                          {comment.postId.title.length > 10
                        ? comment.postId.title.slice(0, 10) + '...'
                        : comment.postId.title}
                          </Link>
                        </Table.Cell>

                        <Table.Cell>
                        
                          {comment.userId.username}
                        
                        </Table.Cell>
                        <Table.Cell>
                          <img src={comment.userId.profilePicture} 
                          className='w-20 h-15 rounded-full'
                          alt="user profile picture" />
                        </Table.Cell>

                        <Table.Cell>
                        
                          {comment.content}
                        
                        </Table.Cell>
                        <Table.Cell>
                          {comment.numberOfLikes}
                        </Table.Cell>
                        <Table.Cell onClick={() => {setOpenModal(true);setPid(comment._id)}}>
                          <span className='font-medium text-red-500 hover:underline
                          cursor-pointer'>Delete</span>
                        </Table.Cell>
                        
                      </Table.Row>
                  </Table.Body>
                ))
              }
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore}
               className='w-full text-teal-500 self-center text-sm py-7'>
                Show More...
              </button>
            )
          }
          </div>
        ):
          (<p>Nothing to show...</p>
        )
      }
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={async() => {
                 const resp = await fetch(`/api/v1/comment/deleteComment/${pid}`,{
                    method:"DELETE",
                    headers:{'Content-Type':'application/json'},
                })
                  const data = await resp.json();
                  console.log(data)
                  if(data.success === true){
                    setcomments((prev) =>
                      prev.filter((post) =>
                        post._id !== pid )
                    );
                    navigate('/dashboard?tab=comment');
                    
                  }
                  else dispatch(logoutfailure(data.msg));
                  navigate('/dashboard?tab=comment');
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
    </div>
  )
}

export default DashComments