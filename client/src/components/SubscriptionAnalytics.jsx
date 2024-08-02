import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

function SubscriptionAnalytics() {
  const { user } = useSelector((state) => state.User);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resp = await fetch('/api/analytics/subscription');
        const data = await resp.json();
        const labels = data.data.map(item => item._id); 
        const values = data.data.map(item => item.totalUsers); 
        setApiData({ labels, datasets: [{ label: 'Subscriptions', data: values, backgroundColor: ['#1ca9c9','#00AB66','#F0E68C' ], //Blue, Green, Yellow
            hoverBackgroundColor: ['#0d6efd','#228B22','#FFC72C' ], }] });
      } catch (err) {
        console.log(err);
      }
    };
    if (user.isAdmin) fetchDetails();
  }, [user.isAdmin]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
     
    },
  };

  return (
    <div className='min-h-screen flex justify-center '>
      {!apiData ? <div>Loading....</div> : 
      <div className='flex flex-col items-center gap-6 -mt-64'  style={{width:'80%',height:'500px'}}>
        <div className='text-5xl text-orange-500 font-bold -ml-16'>Subscription Analytics</div>
        <Pie data={apiData} options={options} /></div>}
    </div>
  );
}

export default SubscriptionAnalytics;
