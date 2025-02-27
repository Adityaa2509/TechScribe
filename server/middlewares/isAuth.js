const jwt = require('jsonwebtoken');

const isAuth = async (req, resp, next) => {
  
  try{
 const token = req.cookies.web_token;
 
 if (!token) {
  
    return resp.json({
        status:400,
        msg:"Unauthorized Access From Middleware0",
        token:token
    });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
       return resp.json({
        status:401,
        msg:"Unauthorized Access from middleware1"
    });
    }
    req.user = payload;
    
    next();})}catch(err){
      console.log(err)
      return resp.json({
        status:402,
        msg:"Unauthorized Access",
        error:err.message
      })
    }
};

module.exports = isAuth