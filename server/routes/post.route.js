const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { updatePostController, createPostController, getAllPosts, deletePostController, toogleVisibiblity, likePostController, toogleSubscription } = require('../controllers/post.controllers');
const router = express.Router();


//create post
router.post('/create',isAuth,createPostController);


//update post
router.put('/update/:postId',isAuth,updatePostController)


//get all post based on search parameter
router.get('/all',getAllPosts)


//delete post
router.delete('/delete/:postId',isAuth,deletePostController)


//toggle visibility
router.put('/toggle/:postId',isAuth,toogleVisibiblity)


//like the post 
router.put('/like/:postId',isAuth,likePostController)


//toogle subcription status
router.put('/toogleSubscription/:postId',isAuth,toogleSubscription);

module.exports = router;