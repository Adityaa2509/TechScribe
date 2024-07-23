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
            createdAt: {
                type: Date,
                expires: 60 * 60 * 24 * 30, // The document will be automatically deleted after 5 minutes of its creation time
            },
        startDate: { type: Date },
        expiryDate: { type: Date }
    }
},{timestamps:true})

userSchema.pre('save', function(next) {
    if (this.isNew) { // Check if the document is being newly created
        this.subscriptionPlan = {
            plan: 'none',
            startDate: null,
            expiryDate: null
        };
    }
    next();
});

const User = mongoose.model('User',userSchema);

module.exports = User