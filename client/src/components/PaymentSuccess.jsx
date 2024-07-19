import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import ConfettiComp from './ConfettiaComp';

function PaymentSuccess() {
    const navigate = useNavigate();
    setTimeout(() => {  
        navigate('/search');
}, 2000);
    return (
    <div className='flex justify-center items-center' style={{background: "#0c1821"}}>
     
        <ConfettiComp/>
    </div>
  )
}

export default PaymentSuccess