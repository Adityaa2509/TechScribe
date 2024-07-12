import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function OnlyAdminPrivateRoute() {
    const {user} = useSelector((state)=>state.User)
 return user && user.isAdmin?<Outlet/>:<Navigate to='/login'/>
}

export default OnlyAdminPrivateRoute