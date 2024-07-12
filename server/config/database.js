const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database connected successfully`);
    }catch(err){
        console.log(err);

    }
}

module.exports = connectDB