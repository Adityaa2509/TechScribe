import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Button, Modal, Table } from "flowbite-react";
import {Link, useNavigate} from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheckCircle, FaCheckDouble, FaGem, FaRegCheckCircle, FaRegGem, FaRegHandshake, FaRegStar, FaRegTimesCircle, FaStar, FaTimesCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
function DashSubsciption() {
const navigate = useNavigate();
  const {user} = useSelector((state)=>state.User);
  console.log(user)
  const [users,setusers] =  useState([])
  const [showMore,setShowMore] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const [chartData,setChartData] = useState({})
  const[pid,setPid] = useState(0);
  console.log(users);
  useEffect(()=>{
      const fetchPost = async()=>{
        const resp = await fetch(`/api/v1/user/subscriberAll`);
        const data = await resp.json();
        console.log(data)
        if(data.success === true)
          {setusers(data.data)
            if(data.data.length<9)
              setShowMore(false)
          }
      }
      const fetchData = async () => {
        try {
          console.log("fetching start")
          const resp = await fetch('/api/analytics/user');
          const data = await resp.json();
          console.log(data);
          // Format data for Chart.js
          if(data.success == true){
          // const formattedData = {
          //   labels: data.data.map(entry => `${entry._id.year}-${entry._id.month}`),
          //   datasets: [{
          //     label: 'User Registrations',
          //     data: data.data.map(entry => entry.count),
          //     fill: false,
          //     borderColor: 'rgb(75, 192, 192)',
          //     tension: 0.1
          //   }]
          // }
        setChartData({})
        }}catch(err){
            console.log(err.message)
          }}
  
          
      if(user.isAdmin){fetchPost()}
        console.log(users)
  },[user._id])
const handleShowMore = async()=>{
  const startindex = users.length;
  try{
    const resp = await fetch(`/api/v1/user/subscriberAll?startIndex=${startindex}`);
    const data = await resp.json();
    if(data.success === true)
      {setusers((prev)=>[...prev,...data.data])
        if(data.users.length<9)
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
      setusers((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, isPublic: !isPublic } : post
        )
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};

  return (
    <div className='flex justify-center ml-36 p-3'>
      {
        user.isAdmin && users.length>0?(
          <div>
             
          <Table hoverable className='shadow-md  mt-4'>
              <Table.Head>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>User Profile</Table.HeadCell>
                <Table.HeadCell>User Email</Table.HeadCell>
                <Table.HeadCell>Subscription Plan</Table.HeadCell>
                <Table.HeadCell>Expires On</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                

              </Table.Head>
              {
                users.map((subscriber)=>(
                  <Table.Body className='divide-y'>
                      <Table.Row className='bg-white  dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>
                          
                          <img src={subscriber.user.profilePicture}
                          className='w-30 h-20 object-cover bg-gray-500 rounded-full'/>
                          
                        </Table.Cell>
                       <Table.Cell>{subscriber.user.username}</Table.Cell>
                        <Table.Cell>
                          
                          <Table.Cell>{subscriber.user.email}</Table.Cell>
                        </Table.Cell>
                        <Table.Cell>
                      
                          {subscriber.plan}
                       
                        </Table.Cell>
                        <Table.Cell>
                      
                        <Table.Cell>{new Date(subscriber.expiryDate).toLocaleDateString()}</Table.Cell>
                   
                    </Table.Cell>

                        <Table.Cell >
                            {subscriber.status}
                        </Table.Cell>
                        
                        <Table.Cell onClick={() => {setOpenModal(true);setPid(subscriber._id)}}>
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
              Are you sure you want to delete the Subscription?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={async() => {
                 const resp = await fetch(`/api/v1/user/deleteSubscriber/${pid}`,{
                    method:"DELETE",
                    headers:{'Content-Type':'application/json'},
                })
                  const data = await resp.json();
                  console.log(data)
                  if(data.success === true){
                    setusers((prev) =>
                      prev.filter((post) =>
                        post._id !== pid )
                    );
                    navigate('/dashboard?tab=subscriber');
                    
                  }
                  else 
                  navigate('/dashboard?tab=subscriber');
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

export default DashSubsciption