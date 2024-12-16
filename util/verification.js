const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = function verifyToken(token){
    let tokenResult = ""
    const time = Math.floor(Date.now()/1000);
    return new Promise((reslove,reject) => {
        //判斷token是否正確
        if(token){
            jwt.verify(token,process.env.JWTSecret,(err,decode)=>{
                if(err){
                    tokenResult = false;
                    reslove(tokenResult);
                    //過期判斷
                }else if(decode.exp<=time){
                    tokenResult = false;
                    reslove(tokenResult);
                    //正確
                }else{
                    tokenResult = decode.data;
                    reslove(tokenResult);
                }
            })
        }
    })

};