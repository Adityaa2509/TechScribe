// UserAnalytics.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function UserAnalytics() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const months = [,'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/analytics/user'); 
      const result = await response.json();
      
      const datas = result.data;
      const countsByMonth = Array(12).fill(0);

      datas.forEach(item => {
        const monthIndex = item._id.month - 1;
        countsByMonth[monthIndex] = item.count;
      });

      const labels = months.map((month, index) => `${month}`);

      setChartData({
        labels,
        datasets: [
          {
            label: '',
            data: countsByMonth,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.2,
          },
        ],
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly User Counts',
        font:{
            size:45,
        },
        color:"Green",
        
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#343a40', 
        },
        grid: {
          color: '#dee2e6', 
        },
      },
      y: {
        ticks: {
          color: '#343a40', 
        },
        grid: {
          color: '#dee2e6', 
        },
      },
    },
  };

  return (
    <div className='min-h-screen flex justify-center '>
      {chartData.labels.length === 0 ? (
        <div>Loading.....</div>
      ) : (<div style={{ width: '80%', height: '700px' }} className='text-4xl'>
        <Line data={chartData} options={options} />
        </div>)}
    </div>
  );
}

export default UserAnalytics;
