const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { totalDetailController, userAnalytics } = require('../controllers/analytics.controller');
const router = express.Router();


router.get('/total',isAuth,totalDetailController);
router.get('/user',isAuth,userAnalytics)


module.exports = router;