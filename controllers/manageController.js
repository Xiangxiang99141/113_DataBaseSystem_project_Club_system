const { Club_member, Club_activity, Club_course, Club_meeting } = require('../db/models');
const {Op} = require('sequelize')
// const verification = require('../util/verification');
const util = require('../util/util');
const COOKIE_NAME = 'auth_token';


exports.getview = (req,res) => {
    
    // const token = req.cookies[COOKIE_NAME];
    // if(token){
    //     verification(token).then(user=>{
    //     })
    // };
    const islogin = util.loginInfo(req.cookies[COOKIE_NAME]);

    try{
        HasAdmin(req.query.id).then(result=>{
            res.render('manage/Admin_index',result);
        });
    }catch(error){
        console.error('Error:', error);
        res.status(500).send('Server Error');
    };
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