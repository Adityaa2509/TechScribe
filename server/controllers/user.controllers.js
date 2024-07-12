const User = require("../models/User.model");
const bcryptjs = require('bcryptjs')
const deleteUser = async(req,resp)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user)
            return resp.status(400).json({
                msg:"User Does Not exists",
                success:false
            })
          
        if(user._id.toString() !== req.user.id)
            return resp.status(402).json({
                msg:"You are not admin",
                success:false
            })  
        const deleeteduser = await User.findByIdAndDelete(user._id);
           
        return resp.status(200).json({
            msg:"User Deleted Successfully",
            success:true,
            deleeteduser
        })
    }catch(err){
        console.log(err);
        return resp.status(500).json({
            msg:"Internal Server Error",
            err:err.message,
            success:false
        })
    }
}

const updateUserController = async(req,resp)=>{
    try{
        if(req.user.id !== req.params.userId)
            return resp.json({
                status:402,
                 msg:"You are not allowed to update this user",
                 success:false})
         if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);}
            
            const updateduser = await User.findByIdAndUpdate(req.params.userId,{
                $set:{
                    username:req.body.username,
                    profilePicture:req.body.profilePicture,
                    password:req.body.password
                }
            },{new:true})
             
             return resp.json({
                status:200,
                msg:"User updated sucessfully",
                userdata:updateduser,
                success:true
             })       
    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            err:err.message,
            success:false,
            status:500
        })
    }
}
const getUsers = async(req,resp)=>{
    try{
        const user = req.user;
        if(!req.user.isAdmin)
            return resp.json({
                msg:"Unauthorized Access",
                status:402,
                success:false
            })
            const startIndex = req.query.startIndex||0;
            const limit = req.query.limit||9;
            const sortDirection = req.query.sort == 'asc'?1:-1;
            const data = await User.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);
            const users = data.map((user)=>{
                const {password,...rest} = user._doc;
                return rest;
            })
            return resp.json({
                msg:"User Fetched Successfully",
                users,
                status:200,
                success:true
            })           
    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            success:false,
            status:500
        })
    }
}


const deleteAdmin = async(req,resp)=>{
    try{
            const user = req.user;
            if(!user.isAdmin)
                return resp.json({
                    msg:"Unauthorized Access",
                    success:false,
                    status:402,
            })

            const {userId} = req.params;
            const userdel = await User.findByIdAndDelete(userId);

            if(!userdel)
                return resp.json({
                    msg:"User do not exists",
                    success:false,
                    status:400,
            })
            console.log(userdel)
            return resp.json({
                msg:"User Deleted Successfully",
                    success:true,
                    status:200,
            })
    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            success:false,
            status:500,
           err:err.message 
        })
    }
}


module.exports = {deleteUser,updateUserController,getUsers,deleteAdmin}

