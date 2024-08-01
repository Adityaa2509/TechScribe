import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { signupfailure, signupstart, signupsuccess } from '../features/User';
import { Spinner } from "flowbite-react";
function OTP() {
    const location = useLocation();
  const { state } = location;
  const {user,error,loading} = useSelector((state)=>state.User)
  const { email,password,username } = state || {};
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(150); 
  const [isResending, setIsResending] = useState(false);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);
  const [otp, setOtp] = useState('');
  const formData = {email:'',password:'',username:'',otp:''};
  formData.email = email;
  formData.username = username;
  formData.password = password;
  formData.otp = otp;
const dispatch = useDispatch();
  console.log(formData) 

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
    
      dispatch(signupstart());
      const resp = await fetch('/api/v1/auth/register',{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })
      const data = await resp.json();
      console.log(data);
      if(data.sucess === true)
      {dispatch(signupsuccess());
        toast.success('User Registered Successfully');
        setTimeout(() => {
          navigate('/login')
        }, 1000);
        return ;
      }
      if(data.message === "User Already exists")
        {
          dispatch(signupfailure(data.message))
          setTimeout(() => {
            navigate('/login')
          }, 1000);
    
        }
        dispatch(signupfailure(data.message));
        toast.error()
    }catch(err){
      console.log(err);
      dispatch(signupfailure(err.message))
    }
    }

    const handleResendOtp = async () => {
        setIsResending(true);
        try {
            formData.otp='';
          const resp = await fetch('/api/v1/auth/sendOtp', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const data = await resp.json();
          if (data.success) {
            toast.success('OTP Resent Successfully');
            setTimeLeft(150); 
          } else {
            toast.error(data.message);
          }
        } catch (err) {
          console.log(err);
          toast.error('Failed to resend OTP');
        } finally {
          setIsResending(false);
        }
      };


    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
  return (
    <div className='min-h-screen flex flex-col justify-center items-center -mt-16 gap-6'>
        <Toaster
    position="top-center"
    reverseOrder={false}
  />
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        separator={<span>-</span>}
        inputStyle={{
            width: '4.5rem',
            height: '4.2rem',
            margin: '0 0.5rem',
            fontSize: '1.5rem',
            borderRadius: '0.5rem',
            border: '2px solid rgba(0,0,0,0.4)',
            textAlign: 'center',
            lineHeight: '3rem'  
          }}
          focusStyle={{
            border: '1px solid rgba(0,0,0,0.5)',
          }}
        renderInput={(props) => <input {...props} />}
/>
          <Button className='w-24' outline gradientDuoTone='purpleToBlue'
          onClick={handleSubmit}>{loading?
            <Spinner color="success" aria-label="Success spinner example" />
          :"Verify"}</Button>
          <div className='text-lg mt-2 text-gray-400'>
        {timeLeft > 0 ? (
          `Time remaining: ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
        ) : (
          'OTP expired. Please request a new one.'
        )}
      </div>

      {timeLeft === 0 && (
        <button
          onClick={handleResendOtp}
          className='text-blue-500 hover:underline mt-2'
          disabled={isResending}
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      )}


    </div>
  );
}

export default OTP;
