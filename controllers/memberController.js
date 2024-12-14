const { v4:uuidv4 } = require('uuid');
const { Sequelize } = require('sequelize');
const { Member } = require('../db/models');
const encryptoion = require('../util/encryption');

const Check = require('../util/check');
check = new Check();

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