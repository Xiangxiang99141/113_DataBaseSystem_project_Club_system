
const verification = require('../util/verification');
const moment = require('moment')


exports.loginInfo = (token)=>{
    if(token){
        verification(token).then(user=>{
            if(user){
                return {islogin:true,user}
            }
        });
    };
}

//轉換時間格式
function covertDate(date,format='YYYY-MM-DD dddd'){
    return moment(date).format('YYYY-MM-DD dddd');
}

module.exports = {
    covertDate:covertDate
}