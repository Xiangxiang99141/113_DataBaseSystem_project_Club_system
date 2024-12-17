const { v4:uuidv4 } = require('uuid');
const { Sequelize, where } = require('sequelize');
const { Member } = require('../db/models');
const encryptoion = require('../util/encryption');
const jwt = require('jsonwebtoken');
const Check = require('../util/check');
const verification = require('../util/verification');
require('dotenv').config();

check = new Check();


//註冊
exports.createUser = (req,res) =>{
    const {account,name,pwd,email,phone} = req.body;

    const hashpwd = encryptoion(pwd) 

    let checkEmail;
    if(email!=null){
        checkEmail = check.checkEmail(email);
        if(checkEmail == false){
            res.send({
                status:"註冊失敗",
                err:"請輸入正確的email格式(如:email@email.com)"
            });
            return;
        }
    }
    Member.findOrCreate({
        where:{
            M_account:account
        },
        defaults:{
            M_id:uuidv4(),
            M_account:account,
            M_name:name,
            M_pwd:hashpwd,
            M_phone:phone,
            email:email,
        }
        
    }).
    then(([user,create]) =>{
        if(create){
            res.send({
                status:200,
                register:"註冊成功",
                user:user
            });
        }
        else{
            res.send({
                status:200,
                register:"註冊失敗，此名稱已有人使用"
            })
        }
    }).
    catch(e => {
        console.log(e);
        res.send(e);
        // res.write(e);
    });
};

//尋找使用者
exports.findUser = (req,res) =>{
    //判斷由有無傳值
    if(req.body.user_id!= null){
        //使用主鍵尋找成員
        Member.findByPk(req.body.user_id).
        then(users =>{
            res.send(users);
        }).
        catch(e=>{
            res.send(e);
        })
    }
    else{
        //找全部
        Member.findAll().
        then(users =>{
            res.send(
                users
            );
        }).
        catch(e=>{
            res.send(e);
        })
    }
};


//登入
exports.login = (req,res) => {
    const {account,pwd} = req.body;
    const hashpwd = encryptoion(pwd) 
    Member.findOne({
        where:{
            M_account:account,
            M_pwd:hashpwd
        }
    }).
    then(result => {

        if(result === null){
            res.send({
                status:'登入失敗',
                err:"請輸入正確的使用者名稱或密碼"
                // loginMember:"歡迎" .
            });
        }else{

            const token = jwt.sign(
                {
                    algorithm:'HS256',
                    exp:Math.floor(Date.now()/1000)+(60*60), //token過期時間
                    data:result.M_id //將id存入token
                },
                process.env.JWTSecret
            );
            res.setHeader('token',token);
            res.send({
                status:'登入成功',
                loginMember:result
                // loginMember:"歡迎" .
            });
        }
        
    }).catch(e => {
        res.send({
            status:'登入失敗',
            err:'系統錯誤，請稍後再試'
        });
    });


}

//更新資料
exports.update = (req,res) =>{
    const token = req.headers['token'];
    if(check.checkNull(token) === true){
        res.send({
            err:'請登入'
        });
    }else if(check.checkNull(token) === false){
        verification(token).
        then(tokenResult => {
            if(tokenResult === false){
                res.send({
                    status:"token錯誤",
                    err:"請重新登入"
                });
            }else{
                const {account,name,pwd,email,phone} = req.body
                const hashpwd = encryptoion(pwd)    
                
                Member.update({
                    M_account:account,
                    M_name:name,
                    M_pwd:hashpwd,
                    M_phone:phone,
                    email:email
                },{
                    where:{
                        M_id:tokenResult
                    }
                }).then(result =>{
                    res.send({
                        status:"資料更新成功",
                        // id:tokenResult
                    });
                }).catch(e=>{
                    res.send(e);
                });
                
            }
            
        })
    }
}