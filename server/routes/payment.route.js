const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { checkOut, paymentVerification } = require('../controllers/payment.controller');
const router = express.Router();



router.post('/checkout',isAuth,checkOut);
router.post('/paymentVerification',paymentVerification);

module.exports = router