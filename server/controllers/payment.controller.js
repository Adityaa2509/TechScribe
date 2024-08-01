const { subscribe } = require('diagnostics_channel');
const Subscription = require('../models/Subscription.model');
const User = require('../models/User.model');
const {rpob} = require('../Razorpay')
const crypto  = require("crypto")
const mailSender = require("../utils/mailSender");
const paymentCompletionTemplate = require("../utils/Template/emailPaymentVerification");
async function sendPaymentCompletionEmail(email, username, plan) {
	try {
		const mailResponse = await mailSender(
			email,
			"Payment Completion and Welcome to TechScribe",
			paymentCompletionTemplate(username, plan)
		);
		console.log("Inside Payment Model");
		console.log(mailResponse);
		console.log("Payment completion email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Inside Payment Model");
		console.log(error.message);
		console.log("Error occurred while sending payment completion email: ", error);
		throw error;
	}
}

module.exports = sendPaymentCompletionEmail;
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
      expiryDate: expiryDate,
      createdAt:Date.now()
    }
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
      status: 'Active',
      createdAt:Date.now()
    });
    console.log(subscription);
  
    //sending payment verification email to user 
await sendPaymentCompletionEmail(user.email, user.username, plan);
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