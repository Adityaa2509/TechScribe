const moment = require('moment');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

const totalDetailController = async(req,resp)=>{
    try{
        const user = req.user;
        if(!user.isAdmin){
            return resp.json({
                status:402,
                success:false,
                msg:"Not Permitted to Access this Route"
            })
        }
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();

    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    // const calculatePercentageIncrease = (total, lastMonthTotal) => {
      
    //   return ((total - lastMonthTotal) / lastMonthTotal) * 100;
    // };

    // const userIncreasePercentage = calculatePercentageIncrease(totalUsers, lastMonthUsers);
    // const postIncreasePercentage = calculatePercentageIncrease(totalPosts, lastMonthPosts);
    // const commentIncreasePercentage = calculatePercentageIncrease(totalComments, lastMonthComments);

    return resp.json({
      status: 200,
      success: true,
        totalUsers,
        totalPosts,
        totalComments,
        lastMonthComments,
        lastMonthPosts,
        lastMonthUsers
    });
    }catch(err){
        console.log(err);
        return resp.json({
            status:500,
            success:false,
            msg:"Internal Server Error"
        })
    }
}

const userAnalytics = async(req,resp)=>{
    try{
        const pipeline = [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' } 
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 } 
            }
          ];
      
          const userRegistrations = await User.aggregate(pipeline);
          return resp.json({
            status:200,
            success:true,
            data:userRegistrations
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

module.exports = {totalDetailController,userAnalytics}