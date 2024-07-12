import { Button } from 'flowbite-react'
import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../../firebase';
import { useDispatch } from 'react-redux';
import { signinsuccess } from '../features/User';
import { useNavigate } from 'react-router-dom';
function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleClick = async()=>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt:"select_account "})
        try{
            const rt = await signInWithPopup(auth,provider);
            console.log(rt)
             const resp = await fetch('/api/v1/auth/google',{
                 method:"POST",
                 headers:{'Content-Type':'application/json'},
                 body:JSON.stringify({
                        name:rt.user.displayName,
                        email:rt.user.email,
                        googlePhotourl:rt.user.photoURL
                 })
               })
               const data = await resp.json();
               console.log(data)
               if(data.success === true){
                dispatch(signinsuccess(data.userdata))
                navigate('/');
                return ;
               }
        }catch(err){
            console.log(err)
            
        }
    }
  return (
    <Button gradientDuoTone="purpleToPink" type='button' outline className='w-96'
    onClick={handleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        <span>Continue with Google</span>
    </Button>
  )
}

export default OAuth