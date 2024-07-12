import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Button, FileInput, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../../firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';


function UpdatePost() {
    const {postId} = useParams();
    
    useEffect(()=>{
        try{
            const postDetails = async()=>{
               console.log(postId)
                const resp = await fetch(`/api/v1/post/all?postId=${postId}`);
                const data = await resp.json();
               if(data.success){
                setFormData(data.posts[0])
               }else{
                navigate('/dashboard?tab=post')
                return ;
               }
            }
            postDetails()
        }catch(err){
            console.log(err)
        }
    },[postId])
  const [loading,setLoading] = useState(false);
  const [file,setfile] = useState(null);
  const [imageUploadProgress,setImageUploadProgress] = useState(null);
  const [formData,setFormData] = useState({})
  const navigate = useNavigate();
  console.log(formData)
  const handleUploadChange = async()=>{
    try{
      setLoading(true)
      if(!file)
        {
          toast.error("No Image detected");
          setLoading(false);
          return ;
        }
      const storage = getStorage(app)
      const fileName = new Date().getTime()+'-'+file.name;
      const storgaeRef = ref(storage,fileName)
      const uploadTask = uploadBytesResumable(storgaeRef,file);
      uploadTask.on(
        'state_changed',
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setImageUploadProgress(progress);

        },
        (error)=>{
          setLoading(false)
          toast.error("Problem while Updating image ,retry after some time")
          setImageUploadProgress(null)
          
        },
        async()=>{
          const url = await getDownloadURL(uploadTask.snapshot.ref);
         
          setImageUploadProgress(null)
          setFormData({...formData,image:url})
          setLoading(false)
          toast.success("Image Updated successsfully")
          console.log(url)
        }
      )
    }catch(err){
      setLoading(false);
      toast.error("Internal Server Error")
      console.log(err);
      return ;
    }
  }
  const handleSubmit = async(e)=>{
      e.preventDefault();
      try{
        setLoading(true);
      const resp = await fetch(`/api/v1/post/update/${postId}`,{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })
      const data = await resp.json();
      console.log(data);
      if(data.success === true){
        setLoading(false)
        toast.success("Post Updated Successfully");
        setTimeout(() => {
          navigate(`/post/${data.post.slug}`);
        }, 2000);
        return ;
      }
      setLoading(false)
      toast.error(data.msg);
      setTimeout(() => {
        navigate('/dashboard?tab=profile')  
      }, 2000);
      
    }catch(err){
      setLoading(false)
      toast.error(err.message);
         console.log(err)
      }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <Toaster
    position="top-center"
    reverseOrder={false}
  />
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
              <TextInput
              type='text' placeholder="title" required id='title'
             className='flex-1'
             onChange={(e)=>setFormData({...formData,title:e.target.value})}
             value={formData.title}
             />
             <Select onChange={(e)=>setFormData({...formData,category:e.target.value})}
                value={formData.category}>
              <option value="uncategorized">Select a Category</option>
              <option value="javascript">Javascript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>              
             </Select>

          </div>
          <div className='flex gap-4 justify-center items-center border-4 border-teal-500 
          border-dotted p-3'>
              <FileInput type='file' accept='image/*' onChange={(e)=>setfile(e.target.files[0]) }/>
              <Button type='button' gradientDuoTone="pinkToOrange" size='sm'
               outline onClick={handleUploadChange}>
                Upload Image</Button>
          </div>
          <ReactQuill theme="snow" placeholder=''
          value={formData.content}
            className='mb-12 h-80' 
           required
           onChange={
            (value)=>{
              setFormData({...formData,content:value})
            }
           }
           />
           <Button type='submit' gradientDuoTone="pinkToOrange"
           disabled={loading}>
            {
              loading?<Spinner color="success" aria-label="Success spinner example" />:
              "Update"
            }
            
            </Button>
      </form>
    </div>
  )
}

export default UpdatePost