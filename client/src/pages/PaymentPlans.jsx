import { Button } from 'flowbite-react'
import React from 'react'
import { FaCheck, FaGem, FaRegGem, FaTimes } from 'react-icons/fa'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { signinsuccess } from '../features/User'
function PaymentPlans({slug}) {
  const {user} = useSelector((state)=>state.User)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlePayment = async(amount)=>{
    try{
      const resp = await fetch('/api/v1/payment/checkout',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({amount})
      })
      const data = await resp.json();
      console.log(data);
      let plan = "";
      if(amount == 125){
        plan = 'Basic'
      }else plan = 'Premium'
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY, 
        amount: data.order.amount, 
        currency: "INR",
        name: "TechScribe",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: data.order.id,
        handler: function (response) {
          const handlingpayment = async(response)=>{
            console.log(response);
          const resp = await fetch('http://localhost:8080/api/v1/payment/paymentVerification',{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({response,user,plan,amount})
          }) 
          const data = await resp.json();
          console.log(data);
          if(data.success === true){
            dispatch(signinsuccess(data.user))
            navigate('/paymentSuccess')}
          else navigate('/paymentFailure')
          }
          handlingpayment(response)
          },
        //callback_url: "http://localhost:8080/api/v1/payment/paymentVerification",
        prefill: {
            name: user.username,
            email: user.email,
            
        },
        notes: {
            address: "Razorpay Corporate Office"
        },
       
        theme: {
            color: "#5AA062"
        }
    };
    
    const raqor = new Razorpay(options);
    raqor.open();
    
    
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className='min-h-screen flex flex-col items-center mt-10 '>
      <div className={`text-4xl font-mono font-bold dark:text-gray-200 text-orange-700`}>Elevate Your Experience: Discover Our Payment Plans</div>
     <div className='flex justify-center gap-11 mt-14'>
      <div className='flex flex-col items-center h-[500px] w-80 rounded-md border-2 border-gray-400 
                    shadow-gray-600
                    shadow-md hover:shadow-gray-500 hover:shadow-xl cursor-pointer
                    transition duration-200 ease-in-out hover:scale-[1.2]'>
                      <div className='mt-3 '><FaRegGem size={60} className='text-blue-500'/></div>
                      <div className='text-3xl font-bold text-blue-600'>Emerald Plan</div>
                      <hr className="w-full border-gray-300 my-2" />
                      <div className='mt-2 font-extrabold dark:text-gray-300 text-black text-xl font-mono'>₹125</div>
                      <div className='text-xs dark:text-gray-400 text-gray-700'>Per Month</div>
                      <div className='flex flex-col mt-3 justify-center items-center'>
                        <div className='flex justify-center items-center gap-3'>
                          <FaCheck className='text-green-500 '/> <span>Access to Paid Articles</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-3'>
                          <FaCheck className='text-green-500'/> <span>Monthly Newsletter</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-3'>
                          <FaCheck className='text-green-500'/> <span>Basic Support</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-3'>
                          <FaTimes className='text-red-600'/> <span>Access to Private Articles</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-3'>
                          <FaTimes className='text-red-600'/> <span>Exclusive Webinars and Events</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-3'>
                          <FaTimes className='text-red-600'/> <span>Premium Insights </span></div>
                      </div>
                      <Button className='mt-5' type='button' gradientDuoTone='cyanToBlue' outline onClick={()=>handlePayment(125)}>Subscribe Emerald</Button>
      </div>
      <div className='flex flex-col items-center h-[500px] w-80 rounded-md border-2 border-gray-400 
                    shadow-gray-600
                    shadow-md hover:shadow-gray-500 hover:shadow-xl cursor-pointer
                    transition duration-200 ease-in-out hover:scale-[1.2]'>
                      <div className='mt-3'><FaGem size={60} className='text-green-400'/></div>
                      <div className='text-3xl font-bold text-green-600'> Sapphire Plan </div>
                      <hr className="w-full border-gray-300 my-2" />
                      <div className='mt-2 font-extrabold dark:text-gray-300 text-black text-xl font-mono'>₹210</div>
                      <div className='text-xs dark:text-gray-400 text-gray-700'>Per Month</div>
                      <div className='flex flex-col mt-3 justify-center items-center'>
                        <div className='flex justify-center items-center gap-3'><FaCheck className='text-green-500'/> <span>Access to Paid Articles</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-3'>
                          <FaCheck className='text-green-500'/> <span>Access to Private Articles</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-2'>
                          <FaCheck className='text-green-500'/> <span>Priority Support</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-2'>
                        <FaCheck className='text-green-500'/> <span></span>Monthly Newsletter</div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-2'>
                        <FaCheck className='text-green-500'/> <span>Exclusive Webinars and Events</span></div>
                        <hr className="w-[18rem] border-gray-300 my-2" />
                        <div className='flex justify-center items-center gap-2'>
                        <FaCheck className='text-green-500'/> <span>Premium Insights </span></div>
                      </div>
                      <Button type='button' gradientDuoTone='greenToBlue' className='mt-5' outline onClick={()=>handlePayment(210)}>Subscribe Sapphire</Button>
      </div>
      </div>
      <div className='mt-20 text-2xl font-medium mx-24 dark:text-gray-300 text-indigo-900
      font-mono italic '>Be a part of the TechScribe family and enjoy unparalleled access to the best tech content available. Whether you choose Sapphire or Emerald, our plans are tailored to provide you with the information you need to succeed in the tech industry. Subscribe today!</div>
    </div>
  )
}

export default PaymentPlans