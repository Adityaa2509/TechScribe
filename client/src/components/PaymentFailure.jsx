import React from 'react'
import { useNavigate } from 'react-router-dom';

function PaymentFailure() {
const navigate = useNavigate();
    setTimeout(() => {
        navigate('/paymentPlans')
    }, 2000);
  return (
    <div className='flex justify-center items-center'>
        <div className='text-4xl '>Payment Failed Try Again</div>
    </div>
  )
}

export default PaymentFailure