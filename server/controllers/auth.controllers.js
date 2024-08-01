const User = require("../models/User.model");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {z} = require('zod');
const OTP = require("../models/Otp.model");
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")

const usernameMinLength = 7;
const passwordMinLength = 7;

//zod register schema to validate user credentials
const registerSchema = z.object({
    username: z.string().min(usernameMinLength, { message: `Username should be at least ${usernameMinLength} characters long` }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(passwordMinLength, { message: `Password should be at least ${passwordMinLength} characters long` })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one numeric digit' })
    .regex(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\|\-=/]/, { message: 'Password must contain at least one special character' })

  });


const registerController = async(req,resp)=>{
    try{
        
        const zodresp =  registerSchema.safeParse(req.body);
        if(!zodresp.success){
            return resp.json({
                message:zodresp.error.issues[0].message,
                success:false,
                status:500,
                err:zodresp.error.issues[0].message
            })
        }
        console.log(zodresp)
        const { username, email, password,otp } = req.body;
        if(!username || username=="")
            return resp.status(400).json({message:"Please Fill the username",sucess:false,err:
        "Please Fill the username"});
        if(!email || email == "")
            return resp.status(400).json({message:"Please Fill the email",sucess:false,err:
                "Please Fill the email"});;
        if(!password || password=="")
            return resp.status(400).json({message:"Please Fill the Password",sucess:false,err:
                "Please Fill the Password"});;
        if(!otp || otp == "")
            return resp.status(400).json({message:"Please Fill the OTP",sucess:false,err:
                        "Please Fill the OTP"});;        
        
        //checking whether with this email already registered
        const user = await User.findOne({email});
        if(user){
           return resp.status(402).json({message:"User Already exists",sucess:false,err:
                "User Already exists"});
        }

        //verifying the otp
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(response)
         if (response.length === 0) {
      // OTP not found for the email
      return resp.json({
        status:400,
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return resp.json({
        status:400,
        success: false,
        message: "The OTP is not valid",
      })
    }



        //hashing the password using bcrypt
       let hashedPassword = ""
        try{
          hashedPassword =  bcryptjs.hashSync(password,10);
        }catch(err){
            console.log("Error while hasing password");
            return resp.status(400).json({err:"Error while hashing password",message:err.message,sucess:false})
        }
        const newuser = await User.create({
            email,
            username,
            password:hashedPassword
        })
        return resp.status(200).json({
            message:"User Registerd Successfully",
            sucess:true,
            user:newuser
        })

    }catch(err){
        console.log(err);
        return resp.status(400).json({err:"Error while hashing password",message:err.msg,
            sucess:false
        })
    }
}

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(passwordMinLength, { message: `Password should be at least ${passwordMinLength} characters long` })
  
})




const loginController = async(req,resp)=>{
    try{
        // const zodresp = loginSchema.safeParse(req.body);
        // if(!zodresp.success){
        //     return resp.json({
        //         message:zodresp.error.issues[0].message,
        //         success:false,
        //         status:500,
        //         err:zodresp.error.issues[0].message
        //     })
        // }
        const {email,password} = req.body;
        if(!email || email === "")
            return resp.status(400).json({
                message:"Please fill password",
                success:false
            })
        if(!password || password === "")
            return resp.status(400).json({
                message:"Please fill password",
                success:false
            })
            
        const user = await User.findOne({email});
        if(!user){
            return resp.status(404).json({
                message:"User not found",
                success:false
            })
        }
        const isvalid = await bcryptjs.compareSync(password,user.password);
        if(!isvalid){
            return resp.status(404).json({
                message:"Bad Credentials",
                success:false
            })
        }
        const payload = {
            id:user._id,
            username:user.username,
            email:user.email,
            isAdmin:user.isAdmin
        }
        console.log(process.env.TOKEN_SECRET)
        const token = await jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:"2hr"});
        resp.cookie("web_token",token,{expires:new Date(Date.now()+2*60*60*1000),httpOnly:true});
        const userdata = user._doc
        return resp.status(200).json({
            message:"User lOGIN sUCCSSFULL",
            token,
            userdata,
            success:true
        })

    }catch(err){
        console.log(err);
        return resp.status(400).json({
            message:"Error while login user",
            err:err.message,
            success:false
        })
    }

}


const logoutController = async(req,resp)=>{
    try{
        resp.clearCookie("web_token").json({
            status:200,
            success:true,
            msg:"User logout Successfully"
        })

    }catch(err){
        console.log(err.message)
        return resp.json({
            status:500,
            success:false,
            msg:"error while logoutg user",
            error:err.message
        })
    }
}
const googleAuthController = async(req,resp)=>{
    try{
            const {name,email,googlePhotourl} = req.body;
            if(!name || !email)
                return resp.status(400).json({
            msg:"Please fill all the fields",
            success:false      
        })
        const user = await User.findOne({email});
        if(user){
            const payload = {
                id:user._id,
                username:user.username,
                email:user.email,
                isAdmin:user.isAdmin
            }
            console.log(process.env.TOKEN_SECRET)
            const token = await jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:"2hr"});
            resp.cookie("web_token",token,{expires:new Date(Date.now()+2*60*60*1000),httpOnly:true});
            const userdata = user._doc
            return resp.status(200).json({
                msg:"User lOGIN sUCCSSFULL Google wala",
                token,
                userdata,
                success:true
            })
        }else{
            const password = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(password,10);
            const nuser =  await User.create({
                username:name,
                email,
                password:hashedPassword,
                profilePicture:googlePhotourl
            })
            const payload = {
                id:nuser._id,
                username:nuser.username,
                email:nuser.email,
                isAdmin:user.isAdmin
            }
            console.log(process.env.TOKEN_SECRET)
            const token = await jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:"2hr"});
            resp.cookie("web_token",token,{expires:new Date(Date.now()+2*60*60*1000),httpOnly:true});
            const userdata = nuser._doc
            return resp.status(200).json({
                msg:"User registered and login google wala",
                token,
                userdata,
                success:true
            })
        }
    }catch(err){
        console.log(err.message)
        return resp.status(500).json({
            msg:"Internal Server Error",
            sucess:false
        })
    }
}
const sendOtp = async(req,resp)=>{
    try{
        const { username, email, password } = req.body;
        const zodresp =  registerSchema.safeParse(req.body);
        if(!zodresp.success){
            return resp.json({
                message:zodresp.error.issues[0].message,
                success:false,
                status:500,
                err:zodresp.error.issues[0].message
            })
        }
        console.log(zodresp)
      
        if(!username || username=="")
            return resp.status(400).json({message:"Please Fill the username",sucess:false,err:
        "Please Fill the username"});
        if(!email || email == "")
            return resp.status(400).json({message:"Please Fill the email",sucess:false,err:
                "Please Fill the email"});;
        if(!password || password=="")
            return resp.status(400).json({message:"Please Fill the Password",sucess:false,err:
                "Please Fill the Password"});;
        
        const checkUserPresent = await User.findOne({ email })
        if (checkUserPresent) {
          return resp.json({
            status:401,
            success: false,
            message: `User Already exists`,
          })
        }
    
        var otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        })
        const result = await OTP.findOne({ otp: otp })
        console.log("Result is Generate OTP Func")
        console.log("OTP", otp)
        console.log("Result", result)
        while (result) {
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
          })
        }
        const otpPayload = { email, otp }
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Body", otpBody)
        resp.json({
            status:200,
          success: true,
          message: `OTP Sent Successfully`,
          otp,
        })
    }catch(err){
        console.log(err);
        return resp.json({
                message:"Internal Server Error",
            success:false,
            status:500,
            err
        })
    }
}

module.exports = {registerController,loginController,logoutController,googleAuthController,sendOtp}