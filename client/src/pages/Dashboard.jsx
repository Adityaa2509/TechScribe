import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from '../components/DashSideBar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashAnalytics from '../components/DashAnalytics';

function Dashboard() {
  const location = useLocation();
  const[tab,settab] = useState("");
  useEffect(()=>{
    console.log(location.search)
    const urlparams = new URLSearchParams(location.search)
    const tabfromurl = urlparams.get('tab');
    if(tabfromurl)
    settab(tabfromurl);
  },[location.search])

  return (
    <div className='min-h-screen flex fle-col md:flex-row '>
      <div className='md:w-56'>
        <DashSideBar/>
      </div>
      {tab === 'profile' && <DashProfile/>}
      {tab === 'post' && <DashPosts/>}
      {tab === 'user' && <DashUsers/>}
      {tab === 'comment' && <DashComments/>}
      {tab === 'analytics' && <DashAnalytics/>}
    </div>
  )
}

export default Dashboard