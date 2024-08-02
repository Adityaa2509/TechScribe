const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { totalDetailController, userAnalytics, subscriptionAnalytics } = require('../controllers/analytics.controller');
const router = express.Router();


router.get('/total',isAuth,totalDetailController);
router.get('/user',isAuth,userAnalytics);
router.get('/subscription',isAuth,subscriptionAnalytics);

module.exports = router;