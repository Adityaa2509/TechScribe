import { Link, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

import useWindowSize from "react-use/lib/useWindowSize";
import gem from '../gem.gif'
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";

function ConfettiComp() {
    const navigate = useNavigate();
    const [seconds,setSeconds] = useState(5)
   setTimeout(() => {
    navigate('/search')
   }, 5000);
   
  const { width, height } = useWindowSize();
  return (
    <div className="min-h-screen">
      
      <Confetti width={width} height={height} recycle={false} />
      <div className="font-mono font-extrabold text-5xl dark:text-gray-300 text-gray-800
      text-center mt-5">Payment Successful</div>
      <div className="text-center dark:text-gray-300 text-gray-800 mt-2 text-md">Payment id : <span className="text-xs text-green-500">cbkwdjbckdbcvjdbvkj</span></div>
      <div className="font-mono font-extrabold text-4xl dark:text-gray-300 text-gray-800
      text-center mt-44">Welcome to the TechScribe Community</div>
      <div className="font-mono font-bold text-3xl dark:text-gray-400 text-gray-800
      text-center mt-3">You are Emeral Of Our Family</div>
<div className="font-mono font-bold text-xl dark:text-gray-400 text-gray-800
      text-center mt-2">Expore All the EXCLUSIVE Content ans Stay ahead in Learning</div>
      <Button gradientDuoTone='greenToBlue' outline className="h-12 w-32 text-center mx-auto mt-10"
      onClick={()=>{
        navigate('/search')
      }}>Explore</Button>
      <div className="text-center underline text-green-700 text-xs mt-5"><span className="pl-60">You will be redirected in few {seconds}...</span></div>
      </div>
      
  );
}
export default ConfettiComp;
