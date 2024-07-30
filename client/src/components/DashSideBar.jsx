import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {HiUser,HiArrowSmRight, HiDocument, HiAnnotation, HiChartPie, HiOutlineUserRemove, HiOutlineUserGroup, HiSpeakerphone, HiAcademicCap, HiMenuAlt4, HiCalendar, HiCreditCard} from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutfailure, logoutsuccess } from '../features/User';
function DashSideBar() {
    const location = useLocation();
  const[tab,settab] = useState("");
  useEffect(()=>{
    console.log(location.search)
    const urlparams = new URLSearchParams(location.search)
    const tabfromurl = urlparams.get('tab');
    if(tabfromurl)
    settab(tabfromurl);
  },[location.search])
  const {user} = useSelector((state)=>state.User)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = async()=>{
        const resp = await fetch('/api/v1/auth/logout',{
            method:"POST",
            headers:{'Content-Type':'application/json'},
          })
          const data = await resp.json();
          if(data.status === 200){
            dispatch(logoutsuccess());
            navigate('/');
            return ;
          }
          else dispatch(logoutfailure(data.msg));
          navigate('/');
    }
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items className=''>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab === 'profile'} icon={HiUser} 
                label={user.isAdmin?"Admin":"User"}
                 labelColor='dark'>
                    Profile
                </Sidebar.Item>
                </Link>
                {
                  user.isAdmin?<Link to='/dashboard?tab=analytics'>
                  <Sidebar.Item active={tab === 'analytics' || !tab} icon={HiChartPie} 
                    as='div'
                   labelColor='dark'>
                      Analytics
                  </Sidebar.Item>
                  </Link>:<></>
                }
                {
                  user.isAdmin?<Link to='/dashboard?tab=post' className='pb-5'>
                  <Sidebar.Item active={tab === 'post'} icon={HiDocument} 
                 as='div'
                   labelColor='dark'>
                      Posts
                  </Sidebar.Item>
                  </Link>:<></>
                }
                {
                  user.isAdmin?<Link to='/dashboard?tab=user'>
                  <Sidebar.Item active={tab === 'user'} icon={HiUser} 
                 as='div'
                   labelColor='dark'>
                      Users
                  </Sidebar.Item>
                  </Link>:<></>
                }{
                  user.isAdmin?<Link to='/dashboard?tab=comment'>
                  <Sidebar.Item active={tab === 'comment'} icon={HiAnnotation} 
                 as='div'
                   labelColor='dark'>
                      Comments
                  </Sidebar.Item>
                  </Link>:<></>
                }
                {
                  user.isAdmin?<Link to='/dashboard?tab=subscriber'>
                  <Sidebar.Item active={tab === 'subscriber'} icon={HiCreditCard} 
                 as='div'
                   labelColor='dark'>
                      Subsciptions
                  </Sidebar.Item>
                  </Link>:<></>
                }
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'
                onClick={handleLogout}>
                    Logout
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar