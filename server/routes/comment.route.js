const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { createCommentController, getCommentController, likeOnCommentController, editCommentController, deleteCommentController, getAllCommentController } = require('../controllers/comment.controllers');
const router = express.Router();

//CREATE comment
router.post('/create',isAuth,createCommentController);

//get comments on a particular post
router.get('/getComments/:postId',isAuth,getCommentController);

//toogle like on a particular post
router.put('/likeOnComment/:commentId',isAuth,likeOnCommentController)

//edit comment 
router.put('/editComment/:commentId',isAuth,editCommentController)

//delete comment
router.delete('/deleteComment/:commentId',isAuth,deleteCommentController)

//get all comments by admin
router.get('/getAll',isAuth,getAllCommentController);


module.exports = router;