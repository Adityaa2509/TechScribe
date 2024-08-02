const moment = require('moment');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const Subscription = require('../models/Subscription.model');

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

const subscriptionAnalytics = async(req,resp)=>{
  try{
    const user = req.user;
    if(!user.isAdmin)
      return resp.json({
    msg:"Not Allowed",
    success:false,
    status:402,
    })
    const pipeline = [
      {
        $group: {
          _id: '$plan', // Group by the 'plan' field
          totalUsers: { $sum: 1 } // Count the number of users per plan
        }
      },
    ]
    const data = await Subscription.aggregate(pipeline);
     let totalUser = await User.countDocuments();
      let len = data.length;
      let temp = 0;  
      if(len>=2){
        temp = (data[0].totalUsers + data[1].totalUsers);
      }else if(len>=1){
        temp = (data[0].totalUsers);
      }
      let leftOut = totalUser - temp; 
      let t= {_id:"Free Reader",totalUsers:leftOut};
      data.push(t);
    return resp.json({
      msg:"Analytics fetched Successfully",
      status:true,
      success:200,
      data
    });
  }catch(err){
    console.log(err.message);
    return resp.json({
      msg:"Internal Server Error",
      success:false,
      status:500,
      err:err
    })
  }
}


module.exports = {totalDetailController,userAnalytics,subscriptionAnalytics}