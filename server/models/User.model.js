const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    profilePicture:{
        type:String,
        default:"https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg"
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    subscriptionPlan:{
        plan: { 
            type: String, 
            default: 'none' },
        startDate: { type: Date },
        expiryDate: { type: Date }
    }
},{timestamps:true})



const User = mongoose.model('User',userSchema);

module.exports = User