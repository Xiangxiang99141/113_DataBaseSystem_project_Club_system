const { where } = require('sequelize');
const { Club, Club_member, Club_sign_record} = require('../db/models'); 
const verification = require('../util/verification');
const COOKIE_NAME = 'auth_token';

exports.Renderindex = async (req,res)=>{
    let clubs;
    try{
        //依照是否有篩選決定是否加入where
        switch (req.query.type){
            case '服務性':
            case '學藝性':
            case '體能性':
            case '自治性':
            case '康樂性':
                clubs = await Club.findAll({
                    attributes: ['C_id', 'C_name', 'C_type', 'C_intro', 'C_quota'],
                    raw: true,
                    where:{
                        C_type:req.query.type
                    }
                });
                break;
        
            default:
                clubs = await Club.findAll({
                    attributes: ['C_id', 'C_name', 'C_type', 'C_intro', 'C_quota'],
                    raw: true,
                });
                break;
        }

        const token = req.cookies[COOKIE_NAME];
        let is_login = false;
        let user = null;
        let memberClubIds = []

        // 檢查 token 並獲取用戶 ID
        if(token) {
            try {
                //驗證Token
                user = await verification(token);
                // 只有在用戶已登入的情況下才檢查社團成員資格
                if (user) {
                    is_login = true;
                    const verify_memberships = await Club_sign_record.findAll({
                        where:{
                            M_id: user.userId,
                            is_verify:true
                        },
                        attributes:['C_id','is_verify'],
                        raw:true
                    });
                    const memberships = await Club_sign_record.findAll({
                        where:{
                            M_id: user.userId,
                            is_verify:false
                        },
                        attributes:['C_id','is_verify'],
                        raw:true
                    });
                    const verifymemberClubIds = verify_memberships.map(m => m.C_id);
                    const memberClubIds = memberships.map(m => m.C_id);

                    // 為每個社團添加會員狀態
                    clubs.forEach(club => {
                        club.isMember = verifymemberClubIds.includes(club.C_id);
                        club.isVerify = memberClubIds.includes(club.C_id);
                    });
                }
            } catch (verifyError) {
                console.error('Token verification failed:', verifyError);
                is_login = false;
            }
        }

        // 如果用戶未登入，將所有社團的 isMember 設為 false
        if (!is_login) {
            clubs.forEach(club => {
                club.isMember = false;
            });
        }

        res.render('index',{
            clubs:clubs,
            isLogin:is_login,
            userId: user?user.userId:'',
            error:false,
            success:false
            // error:req.flash('error',false),
            // success:req.flash('success',false)
        });
    }
    catch(e){
        console.error('Error in Renderindex:', e);
        res.render('index',{
            clubs: [],
            isLogin: false,
            error:"獲取社團列表失敗",
            success:null
        });
    }
};

