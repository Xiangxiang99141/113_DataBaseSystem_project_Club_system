// const { raw } = require('mysql2');
const { Club,Club_member } = require('../db/models'); 
const verification = require('../util/verification');
const { error } = require('jquery');
const COOKIE_NAME = 'auth_token';


exports.Renderindex = async (req,res)=>{
    try{
        const clubs = await Club.findAll({
            attributes: ['C_id', 'C_name', 'C_type', 'C_intro', 'C_quota'],
            raw: true
        });
        const token = req.cookies[COOKIE_NAME]
        let is_login = false
        let userId = ""
        // let memberships;
        if(token){
            verification(token).
            then((user_id) => {
                    userId = user_id
                    is_login = true;
                });
            const memberships = await Club_member.findAll({
                where:{
                    M_id: userId
                },
                attributes:['C_id'],
                raw:true
            });
            const memberClubIds = memberships.map(m => m.C_id);

            // 為每個社團添加會員狀態
            clubs.forEach(club => {
                club.isMember = memberClubIds.includes(club.C_id);
            });
        }
        res.render('index',{
            clubs:clubs,
            isLogin:is_login,
            // userId:userId,
            error:null,
            success:null
        });
    }
    catch(e){
        console.error('Error in getClubs:', e);
        res.render('index',{
            clubs:clubs,
            isLogin:is_login,
            // userId:userId,
            error:"獲取社團列表失敗",
            success:null
        });
    }
};

exports.createClub = (req,res)=>{
    const { name } = req.body;
    console.log(req.body);
    const newClub = indexModel.create({
        name
    });
};

exports.login = (req,res) =>{
    const {account} = req.body;
    let exist_account = indexModel.login(account);
    console.log(exist_account);
    if(exist_account != null){
        const is_login = pwd === exist_account.M_pw?true:false
    }
    else{
        return "Not Found";
    }

    if(is_login){
        return {
            "status":"is_login",
            "account":exist_account.M_account,
            "name":exist_account.M_name
        }
        // res.render()
    }
}

exports.logout = (req,res)=>{

}