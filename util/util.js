
const verification = require('../util/verification');

exports.loginInfo = (token)=>{
    if(token){
        verification(token).then(user=>{
            if(user){
                return {islogin:true,user}
            }
        });
    };
}