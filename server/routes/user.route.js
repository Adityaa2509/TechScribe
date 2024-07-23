const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { deleteUser, updateUserController, getUsers, deleteAdmin, allSubscribers, deleteSubscription } = require('../controllers/user.controllers');
const router = express.Router();

//delete yourself
router.delete('/delete',isAuth,deleteUser)

//update your profile
router.put('/update/:userId',isAuth,updateUserController);

//get all users
router.get('/getusers',isAuth,getUsers);

//delete user by admin using id
router.delete('/delete/:userId',isAuth,deleteAdmin);

//get all subscribers by admin
router.get('/subscriberAll',isAuth,allSubscribers)

//delete yourself
router.delete('/deleteSubscriber/:subscriberId',isAuth,deleteSubscription)

module.exports = router;