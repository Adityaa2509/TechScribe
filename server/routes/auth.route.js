const express = require('express');
const { registerController, loginController, logoutController, googleAuthController, sendOtp } = require('../controllers/auth.controllers');
const router = express.Router();

router.post('/register',registerController);
router.post('/login',loginController);
router.post('/google',googleAuthController);
router.post('/logout',logoutController)
router.post('/sendOtp',sendOtp);

module.exports = router;
