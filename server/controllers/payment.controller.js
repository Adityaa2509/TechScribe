const { subscribe } = require('diagnostics_channel');
const Subscription = require('../models/Subscription.model');
const User = require('../models/User.model');
const {rpob} = require('../Razorpay')
const crypto  = require("crypto")
const checkOut = async(req,resp)=>{
try{
    const options = {
  amount: Number(req.body.amount*100),  // amount in the smallest currency unit i.e paisa for india
  currency: "INR",
      };
      console.log(rpob)
      const order = await rpob.orders.create(options)
      console.log(order)
      
      return resp.json({
        order,
        success:true,
        status:200
      })
}catch(err){
    console.log(err);
    return resp.json({
        msg:"Internal Server Error",
        status:500,
        success:false,
        rpob,
        err:err.message
    })
}
}
const paymentVerification = async(req,resp)=>{
  try{
    console.log("Inside payment verification controller");
  console.log(req.user)
  
  const{ razorpay_order_id,
         razorpay_payment_id,
         razorpay_signature} = req.body.response;
         const {user,plan,amount} = req.body;
        
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = await crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");
    
    const isAuthentic = expectedSignature === razorpay_signature;
    if(isAuthentic){
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(startDate.getDate() + 30);
    let subscriber = await User.findByIdAndUpdate(user._id, {
      $set:{
      subscriptionPlan:{plan: plan,
      startDate: startDate,
      expiryDate: expiryDate}
    }},{$new:true});
    console.log("subscriber ban gaya bhaiya mein ",subscriber)
subscriber = await User.findById(user._id);
console.log("subscriber ban gaya bhaiya mein ",subscriber)
  const subscription =   await Subscription.create({
      user: user._id,
      plan,
      startDate,
      expiryDate,
      amount,
      status: 'Active'
    });
    console.log(subscription);
    return resp.json({
      success:true,
      msg:"Payment Successful",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isAuthentic,
      expectedSignature:expectedSignature,
      user,
      subscriber,
      subscription,
      status:200
    })
    }

    return resp.json(
      {
        msg:"Unauthorized Payment",
        success:false,
        status:402
      }
    )
  }catch(err){
    console.log(err);
    return resp.json({
      msg:"Internal Server Error",
      status:500,
      success:false
    })
  }
}
module.exports = {checkOut,paymentVerification};