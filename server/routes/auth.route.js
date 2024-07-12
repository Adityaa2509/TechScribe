const express = require('express');
const { registerController, loginController, logoutController, googleAuthController } = require('../controllers/auth.controllers');
const router = express.Router();

router.post('/register',registerController);
router.post('/login',loginController);
router.post('/google',googleAuthController);
router.post('/logout',logoutController)

module.exports = router;
