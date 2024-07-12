import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon} from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { logoutfailure, logoutsuccess } from '../features/User'
import { toogleTheme } from '../features/Theme'
function Header() {
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
    const toogle = ()=>{
        dispatch(toogleTheme());
    }
  return (
    <Navbar className='border-b-2 '>
       <Button gradientDuoTone="greenToBlue" className='rounded-xl'>
            <Link  to={"/"} className='text-sm sm:text-xl font-semibold dark:text-white'>
                TechScribe
            </Link>
        </Button>{user &&
        <form>
            <TextInput
            type='text'
            className='hidden lg:inline'
            placeholder='Search....'
            rightIcon={AiOutlineSearch }
            />
        </form>}
        <Button className='w-14 lg:hidden rounded-full' color="gray" gradientDuoTone="greenToBlue">
            <AiOutlineSearch/>
        </Button>
        <div className='flex gap-3 md:order-2'>
            <Button className='w-12 h-10 sm:inline rounded-full' color='gray' 
            onClick={toogle}>
                <FaMoon/>
            </Button>
            <Link to="/login">
            {user === null &&<Button gradientDuoTone="purpleToBlue" outline>
                Sign In
            </Button>
            }</Link>
            {
                user && 
                <Dropdown arrowIcon={false} inline 
                label={<Avatar alt='user' img={user.profilePicture}
                rounded/>}>
                       <Dropdown.Header>
                       <span className='block text-sm font-extrabold truncate'>{user.username}</span>
                        <span className='block text-sm font-semibold'>@{user.email}</span>
                        
                        </Dropdown.Header> 
                        
                        <Link to="/dashboard?tab=profile">
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider/>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        

                </Dropdown>
            }
        </div>
        
    </Navbar>    
)
}

export default Header