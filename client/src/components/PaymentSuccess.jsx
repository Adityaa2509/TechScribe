import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import ConfettiComp from './ConfettiaComp';

function PaymentSuccess() {
    const location = useLocation();
  const { subscription,razorpay_payment_id } = location.state || {};
    return (
    <div className='flex justify-center items-center' style={{background: "#0c1821"}}>
     
        <ConfettiComp subscription={subscription} razorpay_payment_id={razorpay_payment_id}/>
    </div>
  )
}

export default PaymentSuccess