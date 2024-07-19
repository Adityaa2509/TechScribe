const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT||3000
const connectDb = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(express.json());
app.use(cookieParser())
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route')
const postRouter = require('./routes/post.route');
const commentRouter = require('./routes/comment.route')
const paymentRouter = require('./routes/payment.route');
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/post',postRouter);
app.use('/api/v1/comment',commentRouter);
app.use('/api/v1/payment',paymentRouter);

connectDb();
require('./utils/cronjob');
app.listen(PORT,()=>{
    console.log(`Server is Running at PORT ${PORT} successfully`);
})
