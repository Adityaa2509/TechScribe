import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import Search from './components/Search'
import PaymentPlans from './pages/PaymentPlans'
import PaymentSuccess from './components/PaymentSuccess'
import ConfettiComp from './components/ConfettiaComp'
import OTP from './components/OTP'
import UserAnalytics from './components/UserAnalytics'
import SubscriptionAnalytics from './components/SubscriptionAnalytics'
import Error from './pages/Error'
function App() {
  return (
    <BrowserRouter>
    <Header/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
           <Route path='/otp' element={<OTP/>}/>
           {/* <Route path='/ua' element={<UserAnalytics/>}/>
           <Route path='/pie' element={<SubscriptionAnalytics/>}/> */}
            <Route element={<PrivateRoute/>}>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/post/:slug' element={<PostPage/>}/>
                <Route path='/search' element={<Search/>}/>
                <Route path='/paymentPlans' element={<PaymentPlans/>}/>
                <Route path='/paymentSuccess' element={<PaymentSuccess/>}/>
            </Route>
            <Route element={<OnlyAdminPrivateRoute/>}>
                <Route element={<CreatePost/>} path='/create-post'/>
                <Route element={<UpdatePost/>} path='/update-post/:postId'/>
            </Route>
            <Route path="*" element={<Error />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App