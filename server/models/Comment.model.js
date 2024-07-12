const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required:true
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'POST',
         required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
         required: true
    },
    likes:{
        type: Array,
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Comment = mongoose.model('Comment',commentSchema);


module.exports = Comment;