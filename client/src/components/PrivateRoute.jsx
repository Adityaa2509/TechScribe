import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
    const {user} = useSelector((state)=>state.User)
 return user?<Outlet/>:<Navigate to='/login'/>
}

export default PrivateRoute