const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
         required: true },
    content:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg"
    },
    category:{
        type:String,
        default:"uncategorized"
    },
    slug:{
        type:String,
        requred:true,
        unique:true
    },
    isPublic:{
        type:Boolean,
        default:true
    },
    likes:[
     {   type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
   } ],
   numberOfLikes:{
    type:Number,
    default:0
   },
   isPaid:{
    type:Boolean,
    default:false
   } 
},{timestamps:true});

const Post = mongoose.model('POST',postSchema);

module.exports = Post;