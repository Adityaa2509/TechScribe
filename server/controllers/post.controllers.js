const Post = require("../models/Post.model");

const createPostController = async(req,resp)=>{
    try{
        const req_user = req.user;
        if(!req_user.isAdmin){
            return resp.json({
                msg:"You are not allowed to create Post",
                success:false,
                status:402
            })
        }
        const {title,content,} = req.body;
        if(!title || title === "")
            return resp.json({
                msg:"Please add valid title to Blog",
                success:false,
                status:400
            })

        if(!content || content === "")
            return resp.json({
                msg:"Please add valid content to Blog",
                success:false,
                status:400
            })
        
            const slug = req.body.title
            .split(" ")
            .join('-')
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, '-');
            
            const newPost = await Post.create({
            ...req.body,
            slug,
            author:req_user.id
        })    

        return resp.json({
            msg:"Post Created Succesfully",
            success:true,
            status:200,
            post:newPost
        })

    }catch(err){
        console.log(err.message);
        return resp.json({
            msg:"Please add valid content to Blog",
                success:false,
                status:400,
                err:err.message
        })
    }
}

const updatePostController = async(req,resp)=>{
    try{

            if(!req.user.isAdmin)
                return resp.json({
            msg:"Unauthorized Access",
            success:false,
            status:402
            })
            console.log(req.body)
            const post = await Post.findByIdAndUpdate(req.params.postId,{
                $set:{
                    title:req.body.title,
                    category:req.body.category,
                    content:req.body.content,
                    image:req.body.image
                }
                
            },{$new:true})
            return resp.json({
                msg:"Post Updated Suvvessfully",
                post,
                success:true,
                status:200
            })
    }catch(err){
        console.log(err.message)
        return resp.json({
            msg:"Internal server error",
            success:false,
            status:500,
            err:err.message
        })
    }
}

const getAllPosts = async(req,resp)=>{
   try{
        const startIndex = parseInt(req.query.startIndex)||0;
        const limit = parseInt(req.query.limit)||9;
        const sortDirection = req.query.order == 'asc'?1:-1;
        console.log(req.query.slug)
        const allpost = await Post.find({
            ...(req.query.userId && {author:req.query.userId}),
            ...(req.query.category && req.query.category !=='uncategorized' && {category:req.query.category}),
            ...(req.query.slug && {slug:req.query.slug}),
            ...(req.query.postId) && {_id:req.query.postId},
            ...(req.query.searchTerm &&{
                $or:[
                    {title:{$regex:req.query.searchTerm,$options:'i'}},
                    {content:{$regex:req.query.searchTerm,$options:'i'}}
                ]
            })
        }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit).populate('author');
        console.log(allpost)
        return resp.json({
            msg:"All Posts Fetched Successfully",
            success:true,
            status:200,
            posts:allpost
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

const deletePostController = async(req,resp)=>{
    try{
        const user = req.user;
        console.log(user)
        if(!user.isAdmin)
            return resp.json({
                msg:"Unauthorized Access",
                status:402,
                success:false
            })

        const {postId} = req.params;
        const post = await Post.findByIdAndDelete(postId);    
        console.log(post);
            if(!post)
                return resp.json({
                    msg:"No Such Post Exists",
                    success:false,
                    status:400
                })
        
                
        return resp.json({
            msg:"Post Deleted Successfully",
            success:true,
            status:200
        })
            
    }catch(err){
        console.log(err)
        return resp.json({
            msg:"Internal Server Error",
            success:true,
            status:200,
            err:err.message
        })

    }
}

const toogleVisibiblity = async(req,resp)=>{
    try{
        const user=req.user;
        if(!user || !user.isAdmin)
            return resp.json({
        msg:"Unauthorized access",
    success:false,
status:402})
        const {postId} = req.params;
        console.log(postId)
        const post = await Post.findOne({_id:postId});
        if(!post){
            return resp.json({
                msg:"No such post available",
                success:false,
                status:400
            })
        }
        post.isPublic = req.body.isPublic;
        await post.save();
        console.log(post)
        return resp.json({
            msg:"Visibility Toggled successsfully",
            post,
            success:true,
            status:200
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


const likePostController = async(req,resp)=>{
    try{
        const {postId} = req.params;
        const post = await Post.findById(postId);
        if(!post)
            return resp.json({
        msg:"No such comment exist",
        status:400,
        success:false
    })
    const userIdx = post.likes.indexOf(req.user.id);
    if(userIdx == -1){
        post.numberOfLikes += 1;
        post.likes.push(req.user.id)
    }else{
        post.numberOfLikes -= 1;
        post.likes.splice(userIdx,1);
    }
        await post.save();
        return resp.json({
            msg:"Like Updated successfully",
            post,
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


const toogleSubscription = async(req,resp)=>{
    try{
        const user=req.user;
        if(!user || !user.isAdmin)
            return resp.json({
        msg:"Unauthorized access",
        success:false,
        status:402
    })
        const {postId} = req.params;
        console.log(postId)
        const post = await Post.findOne({_id:postId});
        if(!post){
            return resp.json({
                msg:"No such post available",
                success:false,
                status:400
            })
        }
        post.isPaid = req.body.isPaid;
        await post.save();
        console.log(post)
        return resp.json({
            msg:"Subscription Status Toggled successsfully",
            post,
            success:true,
            status:200
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


module.exports = {createPostController,updatePostController,getAllPosts,deletePostController,toogleVisibiblity,likePostController,toogleSubscription};