const { v4:uuidv4 } = require('uuid');
const { Member,Club_member,Club } = require('../db/models');
const encryptoion = require('../util/encryption');
const Check = require('../util/check');
const verification = require('../util/verification');
const auth = require('../middleware/auth'); // 新增 auth 模組
const { raw } = require('mysql2');
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
exports.login = async (req, res) => {
    try {
        const { account, pwd } = req.body;
        const hashpwd = encryptoion(pwd);

        const member = await Member.findOne({
            attributes:['M_id'],
            where: {
                M_account: account,
                M_pwd: hashpwd
            },
            raw:true,
            nest:true
        });

        if (!member) {
            req.flash('error', '帳號或密碼錯誤');
            return res.status(401).json({
                success: false,
                message: '帳號或密碼錯誤'
            });
        }

        const clubPermissions = await Club_member.findAll({
            attributes:['Cme_job'],
            include:[{
                    attributes:['C_name'],
                    model:Club,
                },{
                    attributes:['M_name'],
                    model:Member,
            }],
            where:{M_id:member.M_id},
            raw:true,
            nest:true
        });

        member.Permissions = clubPermissions

        // 生成 JWT token
        const token = auth.generateToken(member);
        
        // 設置 Cookie
        auth.setAuthCookie(res, token);

        req.flash('success', '登入成功');
        res.send({
            success:true,
            message: '登入成功'
        })
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', '登入失敗，請稍後再試');
        res.status(500).json({
            success: false,
            message: '登入失敗，請稍後再試'
        });
    }
};

// 登出
exports.logout = (req, res) => {
    // 清除所有相關的 cookies
    
    // 清除 session（如果有使用的話）
    if (req.session) {
        req.session.destroy();
    }

    // 使用 auth 模組清除認證相關的 cookie
    auth.clearAuthCookie(res);

    // 重定向到首頁
    res.redirect('/');
};

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

//註冊
exports.signup = async (req, res) => {
    try {
        const { account, name, password, phone, email } = req.body;

        // 驗證必填欄位
        if (!account || !name || !password) {
            return res.status(400).json({
                success: false,
                message: '帳號、姓名和密碼為必填欄位'
            });
        }
        
        //加密
        const hashpwd = encryptoion(password);

        // 創建及檢查新會員
        const [member, create] = await Member.findOrCreate({
            attributes:['M_id','M_account','M_name','M_phone','email','M_register_at'],
            where: {
                M_account: account,
            },
            defaults: {
                M_id: uuidv4(),
                M_account: account,
                M_name: name,
                M_pwd: hashpwd,
                M_phone: phone || null,
                email: email || null,
                M_register_at: new Date()
            }
        });
        
        if(create) {
            res.json({
                success: true,
                message: '註冊成功',
                user:member
            });
        } else {
            res.json({
                success: false,
                message: '此帳號已被註冊'
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '註冊時發生錯誤'
        });
    }
}

exports.getMember = async (req,res)=>{
    try {
        const members = await Member.findAll({
            attributes:['M_id','M_name'],
            raw:true,
            nest:true
        });
        res.status(200).json({
            success: true,
            message: '獲取成員成功',
            data: members
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取成員失敗'
        });
    }
}