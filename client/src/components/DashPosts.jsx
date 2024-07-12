import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Button, Modal, Table } from "flowbite-react";
import {Link, useNavigate} from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function DashPosts() {
const navigate = useNavigate();
  const {user} = useSelector((state)=>state.User);
  console.log(user)
  const [posts,setposts] =  useState([])
  const [showMore,setShowMore] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const[pid,setPid] = useState(0);
  console.log(posts);
  useEffect(()=>{
      const fetchPost = async()=>{
        const resp = await fetch(`/api/v1/post/all?userId=${user._id}`);
        const data = await resp.json();
        console.log(data)
        if(data.success === true)
          {setposts(data.posts)
            if(data.posts.length<9)
              setShowMore(false)
          }
      }
      if(user.isAdmin)fetchPost()
        console.log(posts)
  },[user._id])
const handleShowMore = async()=>{
  const startindex = posts.length;
  try{
    const resp = await fetch(`/api/v1/post/all?userId=${user._id}&startIndex=${startindex}`);
    const data = await resp.json();
    if(data.success === true)
      {setposts((prev)=>[...prev,...data.posts])
        if(data.posts.length<9)
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
const handleTogglePublicPrivate = async (postId, isPublic) => {
  try {
    const res = await fetch(`/api/v1/post/toggle/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPublic: !isPublic }),
    });
    const data = await res.json();
    console.log(data)
    if (!data.success) {
      console.log(data.message);
    } else {
      setposts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, isPublic: !isPublic } : post
        )
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};
const handleToggleSubscription = async (postId, isPaid) => {
  try {
    const resp = await fetch(`/api/v1/post/toogleSubscription/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPaid: !isPaid }),
    });
    const data = await resp.json();
    console.log(data)
    if (!data.success) {
      console.log(data.message);
    } else {
      setposts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, isPaid: !isPaid } : post
        )
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};

  return (
    <div className='flex justify-center  p-3'>
      {
        user.isAdmin && posts.length>0?(
          <div>
          <Table hoverable className='shadow-md ml-10 mt-4'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Visibility</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell> 
                <Table.HeadCell>Subscription Type</Table.HeadCell> 
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell><span>Edit</span></Table.HeadCell>

              </Table.Head>
              {
                posts.map((post)=>(
                  <Table.Body className='divide-y'>
                      <Table.Row className='bg-white  dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell
                        className='flex justify-center'>
                          {new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                      
                        <Table.Cell >
                          <Link to={`/post/${post.slug}`}>
                          <img src={post.image}
                          className='w-20 h-10 object-cover bg-gray-500 rounded-lg'/>
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                        <Link to={`/post/${post.slug}`}
                        className='font-medium text-gray-900 dark:text-white hover:underline '>
                          {post.title.length > 10
                        ? post.title.slice(0, 10) + '...'
                        : post.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell className='flex justify-center'>{post.category}</Table.Cell>
                        <Table.Cell >
                      <Button
                        color={post.isPublic ? 'success' : 'warning'}
                        onClick={() =>
                          handleTogglePublicPrivate(post._id, post.isPublic)
                        }
                      >
                        {post.isPublic ? 'Public' : 'Private'}
                      </Button>
                    </Table.Cell>
                    <Table.Cell>{post.numberOfLikes}</Table.Cell>
                    <Table.Cell className='flex justify-center'>
                      <Button
                        color={post.isPaid ? 'warning' : 'success'}
                        onClick={() =>
                          handleToggleSubscription(post._id, post.isPaid)
                        }
                      >
                        {post.isPaid ? 'Paid' : 'Free'}
                      </Button>
                    </Table.Cell>
                        <Table.Cell onClick={() => {setOpenModal(true);setPid(post._id)}}>
                          <span className='font-medium text-red-500 hover:underline
                          cursor-pointer'>Delete</span>
                        </Table.Cell>
                        <Table.Cell >
                          <Link to={`/update-post/${post._id}`}
                          className='text-teal-500 hover:underline'>
                          <span>Edit</span>
                          </Link>
                         
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
              Are you sure you want to delete this Post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={async() => {
                 const resp = await fetch(`/api/v1/post/delete/${pid}`,{
                    method:"DELETE",
                    headers:{'Content-Type':'application/json'},
                })
                  const data = await resp.json();
                  console.log(data)
                  if(data.success === true){
                    setposts((prev) =>
                      prev.filter((post) =>
                        post._id !== pid )
                    );
                    navigate('/dashboard?tab=post');
                    
                  }
                  else dispatch(logoutfailure(data.msg));
                  navigate('/dashboard?tab=post');
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

export default DashPosts