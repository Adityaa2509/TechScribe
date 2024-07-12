import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Button, TextInput,Modal, Spinner} from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { logoutfailure, logoutsuccess, updateFailure, updateStart, updateSuccess } from '../features/User';
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from 'firebase/storage'
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Alert } from "flowbite-react";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

import 'react-circular-progressbar/dist/styles.css';
function DashProfile() {
  
    const {user,loading} = useSelector((state)=>state.User)
    console.log(user.isAdmin)
    const [formdata,setformdata] = useState({})
    console.log(user.isAdmin)
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const handleLogout = async()=>{
        const resp = await fetch('/api/v1/auth/logout',{
            method:"POST",
            headers:{'Content-Type':'application/json'},
          })
          const data = await resp.json();
          if(data.status === 200){
            dispatch(logoutsuccess());
        
            navigate('/');
            return ;
          }
          else dispatch(logoutfailure(data.msg));
          navigate('/');
    }
    const [img,setimg] = useState(null);
    const[imgurl,setimgurl] = useState(null);
    const handleImageChange=async(e)=>{
      const file = e.target.files[0];
      if(file){
      setimg(file);
      setimgurl(URL.createObjectURL(file)); 

    }
    console.log(img,imgurl)
    }
    const [imgerr,setimgerr] = useState(null)
    const [imgprogreess,setimgprogress] = useState(null)
    const uploadimg = async()=>{
      const storage = getStorage(app)
      
      const fileName = new Date().getTime() + img.name;
      const actfilename = fileName.toString()
      console.log(actfilename)
      const storagerEF = ref(storage,actfilename)
      const uploadtask = uploadBytesResumable(storagerEF,img)
      uploadtask.on(
        'state_changed',
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setimgprogress(progress.toFixed(0))
          console.log(progress)
        },
      
        (error)=>{
          setimg('Could not upload image')
        },
        async()=>{
         
          const downloadurl = await getDownloadURL(uploadtask.snapshot.ref)
          setimgurl(downloadurl)  
          setformdata({...formdata,profilePicture:downloadurl})
        }
      )
    }
    const handleChange=(e)=>{
      setformdata({...formdata,[e.target.id]:e.target.value})
    }
    const imageref = useRef();
    useEffect(()=>{
      if(img){
        uploadimg()
      }
      console.log(imgerr)
    },[img])
    useEffect(()=>{
      if(imgprogreess === 100)setimgprogress(null)
    },[imgprogreess])
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
       if(Object.keys(formdata)=== 0)
        return ;
      try{
        dispatch(updateStart());
        const resp = await fetch(`/api/v1/user/update/${user._id}`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(formdata)
        })
        const data = await resp.json();
        console.log(data)
        if(data.success === true){
          dispatch(updateSuccess(data.userdata));

          return ;

        }
        console.log(data.msg)
        dispatch(updateFailure(data.msg));
        return ;
      }catch(err){

      }
    }catch(err){

    }
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-4xl'>Profile</h1>
        <form className='flex flex-col gap-4 justify-center items-center' onSubmit={handleSubmit}> 
          <input type="file" accept='image/*' onChange={handleImageChange } ref={imageref}
          hidden/>
            <div className='relative w-32 h-32 cursor-pointer overflow-hidden rounded-full shadow-md'
            onClick={()=> imageref.current.click()}>
              {imgprogreess !== null && imgprogreess !== undefined ? (
            <CircularProgressbar
              value={imgprogreess || 0}
              text={`${imgprogreess}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${imgprogreess / 100})`,
                },
              }}
            />
          ) : null}
            <img src={imgurl || user.profilePicture} alt='user'
            className='rounded-full w-full h-full object-cover  border-8 border-[lightgray]'/>
            </div>
            <TextInput
            type='text'
            id='username'
            placeholder='username'
            defaultValue={user.username}
            className='w-96'
            onChange={handleChange}
            />
            <TextInput
            type='email'
            id='email'
            placeholder='email'
            defaultValue={user.email}
            className='w-96'
            disabled
            />
            <TextInput
            type='password'
            id='password'
            placeholder='password'
            defaultValue={"************"}
            className='w-96'
            onChange={handleChange}
            />
            <Button type='submit' gradientDuoTone="pinkToOrange" className='w-96'
            disabled={loading}>
                {
                  loading?<Spinner color="success" aria-label="Success spinner example" />:
                "Update"
                }
            </Button>
            {
              user.isAdmin &&
              <Link to='/create-post'> 
              <Button type='submit' gradientDuoTone="purpleToPink" className='w-96'>
                Create a Post
            </Button>
            </Link>
            }
        </form>
        <div className='text-red-500 flex justify-evenly gap-40 mt-5'>
            <span className='cursor-pointer' onClick={() => setOpenModal(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleLogout}>Logout</span>
        </div>
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={async() => {
                 const resp = await fetch('/api/v1/user/delete',{
                    method:"DELETE",
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({email:user.email})
                })
                  const data = await resp.json();
                  if(data.success === true){
                    dispatch(logoutsuccess());
                    navigate('/register');
                    return ;
                  }
                  else dispatch(logoutfailure(data.msg));
                  navigate('/');
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

export default DashProfile