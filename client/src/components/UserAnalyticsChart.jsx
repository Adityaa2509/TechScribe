import React, { useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ArcElement,
    Legend
} from 'chart.js'
import {Line,Doughnut} from 'react-chartjs-2'
import { useSelector } from 'react-redux'
function UserAnalyticsChart() {
  const {user} =   useSelector((state)=>state.User);
  useEffect(()=>{
    const fetchData = async () => {
        try {
          console.log("fetching start")
          const resp = await fetch('/api/analytics/user');
          const data = await resp.json();
          console.log(data);
        
          if(data.success == true){
            
        }
        }catch(err){
            console.log(err.message)
          }}
  
          
      if(user.isAdmin){fetchPost();fetchData()}
        
  },[user._id])
    return (
    <div>

    </div>
  )
}

export default UserAnalyticsChart