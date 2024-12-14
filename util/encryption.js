const crypto = require('crypto')

module.exports = function GetRePassword(pwd){
    let hashPassword  = crypto.createHash('sha256');
    hashPassword.update(pwd);
    const repassword  = hashPassword.digest('hex');

    return repassword;
};