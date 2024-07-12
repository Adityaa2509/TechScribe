import { Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Spinner } from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { signinfailure, signinstart, signinsuccess, signupfailure } from '../features/User';
import OAuth from '../components/OAuth';
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {user,error,loading} = useSelector((state)=>state.User)
  console.log(user)
  const [formData,setformData] = useState({});
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
const handleSubmit = async(e)=>{
e.preventDefault();
try{
  dispatch(signinstart());
  const resp = await fetch('/api/v1/auth/login',{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(formData)
  })
  const data = await resp.json();
  console.log(data);
  if(data.success === true)
  {dispatch(signinsuccess(data.userdata));
    toast.success('User registered successfully');
    navigate('/')
    return ;
  }
  if(data.message === "User not found")
    {
      dispatch(signinfailure(data.message))
      setTimeout(() => {
        navigate('/register')
      }, 2000);

    }
    dispatch(signinfailure(data.message));
}catch(err){
  console.log(err);
  dispatch(signinfailure(err.message))
}

}
const handlechange = (e)=>{
    setformData({...formData,[e.target.id]:e.target.value})
    console.log(formData);
}



  return (
    <div className='min-h-screen mt-20'> <Toaster
    position="top-center"
    reverseOrder={false}
  />

    <div className='flex flex-col justify-center items-center'>
        <div className='text-4xl font-bold mb-12'>
        Welcome Back
        </div>
<form className='flex flex-col gap-4 justify-center items-center' onSubmit={handleSubmit}>


<label className=" flex flex-col gap-0 w-96">
   <div>Your email</div>
  <input type="text" className="rounded-lg bg-slate-100 border-black" placeholder="email" id='email' onChange={handlechange}/>
</label>

<label className="flex flex-col  gap-0 w-96">
    <div>Your password</div>
 <input type="password" className="rounded-lg bg-slate-100 border-black" id='password' placeholder='**********' onChange={handlechange}/>
</label>

<Button type='submit' gradientDuoTone="purpleToBlue" outline className='w-96 my-5' disabled={loading}>
{loading?
    <Spinner color="success" aria-label="Success spinner example" />
  :"Sign In"}
</Button>
<OAuth/>
</form>
<div className='flex gap-1 text-sm mt-[15px]'>
            <span>Don't have an account? </span>
            <Link to='/register' className='text-blue-600'> Join us Today</Link>
        </div>
   

</div>
</div>
  )
}

export default Login