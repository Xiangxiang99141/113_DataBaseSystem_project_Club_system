const { Club_member, Club_activity, Club_course,Club_sign_record, Club} = require('../db/models');
const {Op, where} = require('sequelize');
const verification = require('../util/verification');
const COOKIE_NAME = 'auth_token';


exports.getview = async (req,res) => {
    user = await verification(req.cookies[COOKIE_NAME]);
    if(req.query.id){
        try{
            HasAdmin(req.query.id).then(result=>{
                res.render('manage/Admin_index',result);
            });
        }catch(error){
            console.error('Error:', error);
            res.status(500).send('Server Error');
        };
    }
    else{
        try{
            const {count:is_verify_count,rows:is_verify_row} = await Club_sign_record.findAndCountAll({
                where:{
                    M_id:user.userId,
                    is_verify:false
                },
                include:[{
                    model:Club,
                    attributes: ['C_id', 'C_name', 'C_type'],
                }],
            });
            const {count:verify_count,rows:verify_row} = await Club_sign_record.findAndCountAll({
                where:{
                    M_id:user.userId,
                    is_verify:false
                },
                include:[{
                    model:Club,
                    attributes: ['C_id', 'C_name', 'C_type'],
                }],
            });
    
    
    
            res.render('manage/index',{
                isverify_clubCount:is_verify_count || 0,
                clubCount:verify_count || 0,
                activityCount:0,
                courseCount:0,
                admin_club:0,
                is_verify_club:is_verify_row,
                verify_club:verify_row
            });
        }catch(error){
            console.error('Error:', error);
            res.status(500).send('Server Error');
        };
    }
};






async function HasAdmin(id){
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // 獲取統計數據
    const memberCount = await Club_member.count({
        where: {
            C_id:id
        }
    });
    const activityCount = await Club_activity.count({
        where: {
            Ca_date: {
                [Op.between]: [firstDayOfMonth, lastDayOfMonth]
            },
            C_id:id
        }
    });
    const courseCount = await Club_course.count({
        where: {
            Cc_date: {
                [Op.between]: [firstDayOfMonth, lastDayOfMonth]
            },
            C_id:id
        }
    });
    return {
                memberCount,
                activityCount,
                courseCount
            }
}

// function isAdmin(token){
//     verification(token).then(tokenResult=>{
//         if(tokenResult.Permissions)
//     });
// }