const { Club_member, Club_activity, Club_course, Club_meeting } = require('../db/models');
const {Op} = require('sequelize')
const verification = require('../util/verification');
const COOKIE_NAME = 'auth_token';


exports.getview = (req,res) => {
    
    const token = req.cookies[COOKIE_NAME];
    if(token){
        verification(token).then(user=>{
            console.log(user);
        })
    };


    try{
        HasAdmin().then(result=>{
            res.render('manage/Admin_index',result);
        });
    }catch(error){
        console.error('Error:', error);
        res.status(500).send('Server Error');
    };
};






async function HasAdmin(){
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // 獲取統計數據
    const memberCount = await Club_member.count();
    const activityCount = await Club_activity.count({
        where: {
            Ca_date: {
                [Op.between]: [firstDayOfMonth, lastDayOfMonth]
            }
        }
    });
    const courseCount = await Club_course.count({
        where: {
            Cc_date: {
                [Op.between]: [firstDayOfMonth, lastDayOfMonth]
            }
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