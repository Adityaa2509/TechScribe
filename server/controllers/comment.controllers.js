const Comment = require('../models/Comment.model')
const createCommentController = async(req,resp)=>{
    try{
        const{content,postId,userId} = req.body;
        if(userId !== req.user.id)
            return resp.json({
                msg:"Unauthorized Access",
                status:402,
                success:false
        })
        
        const newComment = await Comment.create({
            content,
            postId,
            userId
        })
        console.log(newComment)
        return resp.json({
            msg:"Comment Added Successfully",
            status:200,
            success:true,
            comment:newComment
        })

    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            status:500,
            success:false
        })
    }
}

const getCommentController = async(req,resp)=>{
    try{
        const {postId} = req.params;
        const comment = await Comment.find({postId}).sort({createdAt:-1}).populate('userId');
        console.log(comment)
        return resp.json({
            msg:"Comment for this Post Fetched Successfully",
            comments:comment,
            status:200,
            success:true
        })
    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            status:500,
            success:false
        })
    }
} 

const likeOnCommentController = async(req,resp)=>{
    try{
        const {commentId} = req.params;
        const comment = await Comment.findById(commentId);
        if(!comment)
            return resp.json({
        msg:"No such comment exist",
    status:400,success:false})
    const userIdx = comment.likes.indexOf(req.user.id);
    if(userIdx == -1){
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id)
    }else{
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIdx,1);
    }
        await comment.save();
        return resp.json({
            msg:"Like Updated successfully",
            comment,
            status:200,
            success:true
        })
    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            status:500,
            success:false
        })
    }
}
const editCommentController = async(req,resp)=>{
    try{
        const {commentId} = req.params;
        const newcomment = await Comment.findByIdAndUpdate(commentId,{
            content:req.body.content
        },{new:true});
        return resp.json({
            msg:"Comment Edited Successfully",
            status:200,
            success:true,
            comment:newcomment
        })
    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            status:500,
            success:false
        })
    }
}

const deleteCommentController = async(req,resp)=>{
    try{    
        const {commentId}  = req.params;
        const deletedComment = await Comment.findByIdAndDelete(commentId)
        return resp.json({
            msg:"Comment Deleted Successfully",
            status:200,
            success:true,
            comment:deletedComment
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

const getAllCommentController = async(req,resp)=>{
    try{
        const user = req.user;
        if(!user.isAdmin){
            return resp.json({
                msg:"UnAuthorized Access",
                status:402,
                success:false
            })}
            const startIndex = parseInt(req.query.startIndex)||0;
            const limit = parseInt(req.query.limit)||9;
            const sortDirection = req.query.order == 'asc'?1:-1;

        const comments = await Comment.find().sort({updatedAt:sortDirection}).skip(startIndex).limit(limit).populate('postId').populate('userId');
        return resp.json({
            msg:"All Comments Fetched Successfully",
            status:200,
            success:true,
            comments
        })    

    }catch(err){
        console.log(err);
        return resp.json({
            msg:"Internal Server Error",
            status:500,
            success:false
        })
    }
}

module.exports = {createCommentController,getCommentController,likeOnCommentController,editCommentController,deleteCommentController,getAllCommentController}