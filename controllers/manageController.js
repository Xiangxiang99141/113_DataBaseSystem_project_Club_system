const { Club_member,
    Club_activity,
    Club_course,
    Club_sign_record,
    Club,
    Member,
    Club_equipment,
    Club_meeting,
    Club_announcement,
    Club_history} = require('../db/models');
const {Op, where} = require('sequelize');
const verification = require('../util/verification');
const COOKIE_NAME = 'auth_token';
const moment = require('moment');


exports.getview = async (req,res) => {
    user = await verification(req.cookies[COOKIE_NAME]);
        if(req.query.id){
            try{
                HasPermissions(user.userId,req.query.id).then((isAdmin)=>{
                    if(isAdmin){
                        getClubDetail(req.query.id).then((result)=>{
                            res.render('manage/Admin_index',result);
                        })
                    }else{
                        res.render('error',{
                            message:"權限不足"
                        });
                    }
                });
            }catch(error){
                console.error('Error:', error);
                res.status(500).send('Server Error');
            };
        }
        else{
            try{
                const {count:is_admin_count,rows:is_admin_row} = await Club_member.findAndCountAll({
                    where:{
                        M_id:user.userId,
                        Cme_job:{[Op.in]:['社長','副社長',"幹部","社團指導老師"]}
                    },
                    include:[{
                        model:Club,
                        attributes: ['C_id', 'C_name', 'C_type'],
                    }],
                    nest:true,
                    raw:true
                });
                const {count:is_member_count,rows:is_member_row} =  await Club_member.findAndCountAll({
                    where:{
                        M_id:user.userId,
                        Cme_job:"社員"
                    },
                    include:[{
                        model:Club,
                        attributes: ['C_id', 'C_name', 'C_type'],
                    }],
                    nest:true,
                    raw:true
                }) 
    
    
    
                const {count:verify_count,rows:verify_row} = await Club_sign_record.findAndCountAll({
                    where:{
                        M_id:user.userId,
                        is_verify:false
                    },
                    include:[{
                        model:Club,
                        attributes: ['C_id', 'C_name', 'C_type'],
                    }],
                    nest:true,
                    raw:true
                });
    
                res.render('manage/index',{
                    isLogin:true,
                    is_member_clubCount:is_member_count || 0,
                    clubCount:verify_count || 0,
                    activityCount:0,
                    courseCount:0,
                    admin_club_count:is_admin_count,
                    admin_club:is_admin_row,
                    is_member_club:is_member_row,
                    verify_club:verify_row
                });
            }catch(error){
                console.error('Error:', error);
                res.status(500).send('Server Error');
            };
        }
};

exports.getEquipmentsView = async (req,res) => {
    user = await verification(req.cookies[COOKIE_NAME]);
    if(req.query.id){
        try{
            HasPermissions(user.userId,req.query.id).then((isAdmin)=>{
                if(isAdmin){
                    getClubMember(req.query.id).then(club_member=>{
                        getEquipments(req.query.id).then(equipments=>{
                            res.render('equipments/index',{
                                clubId:req.query.id,
                                equipments:equipments,
                                members:club_member,
                                success:null,
                                error:null
                            })
                        });
                    });
                }else{
                    res.render('error',{
                        message:"權限不足"
                    });
                }
            });
        }catch(error){
            console.error('Error:', error);
            res.status(500).send('Server Error');
        };
    }else{
        //驗證是否為系統管理員
    }
}

exports.getEquipments = (req,res)=>{
    try{
        getClubMember().then(club_member=>{
            getEquipment().then(equipments=>{
                res.render('equipments/index',{
                    equipments:equipments,
                    members:club_member,
                    success:null,
                    error:null
                })
            });
        });
    }catch{

    }
}

exports.getMembersView = async (req, res) => {
    user = await verification(req.cookies[COOKIE_NAME]);
    if(req.query.id){
        try {
            //權限管理
            HasPermissions(user.userId,req.query.id).then((isAdmin)=>{
                if(isAdmin){
                    Club_member.findAll({
                        attributes: ['C_id', 'M_id', 'Cme_job','Cme_member_join_at'],
                        include: [{
                            model: Member,
                            required: true,
                            attributes: ['M_name',]
                        }],
                        order: [
                            ['Cme_job', 'ASC'],
                            [Member, 'M_name', 'ASC']
                        ],
                        where: {
                            C_id: req.query.id
                        }
                    }).then(members => {
                        if (!members || members.length === 0) {
                            res.render('members/index', { 
                                members: [],
                                error: '目前沒有社員資料' 
                            });
                            return;
                        }
                        
                        // 處理數據以便於前端顯示
                        const processedMembers = members.map(member => ({
                            C_id: member.C_id,
                            M_id: member.M_id,
                            M_name: member.Member.M_name,
                            Cme_job: member.Cme_job,
                            join_at: moment(member.Cme_member_join_at).format('YYYY-MM-DD dddd'),
                        }));
            
                        res.render('members/index', {
                            clubId: req.query.id,
                            members:[],
                            clubMembers: processedMembers,
                            error: null 
                        });
                    }).catch(error => {
                        console.error('Error in getview:', error);
                        res.render('members/index', { 
                            members: [],
                            error: '獲取社員資料時發生錯誤' 
                        });
                    });
                }else{
                    res.render('error',{
                        message:"權限不足"
                    });
                }
            });
        } catch (error) {
            console.error('Error in getview:', error);
            res.render('members/index', { 
                members: [],
                error: '獲取社員資料時發生錯誤' 
            });
        }
    }else{

    }
}

exports.getActivitiesView = async (req, res) => {
    user = await verification(req.cookies[COOKIE_NAME]);
    if(req.query.id){
        try {
            HasPermissions(user.userId,req.query.id).then((isAdmin)=>{
                if(isAdmin){
                    Club_activity.findAll({
                        where:{
                            C_id:req.query.id
                        }
                    }).then(activities=>{
                        res.render('activities/index', { 
                            clubId:req.query.id,
                            activities,
                            success:null,
                            error:null
                        });
                    });
                }else{
                    res.render('error',{
                        message:"權限不足"
                    });
                }
            });
            
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Server Error');
        }
    }else{
        //驗證是否為系統管理員
    } 
}

exports.updateMemberJob = async (req,res) => {

}



//檢查是否有這個社團的編輯權限
async function HasPermissions(userId,clubId){
    const member = await Club_member.findOne({
        attributes: ['Cme_job'],
        where: {
            M_id:userId,
            C_id:clubId
        }
    });

    if(member.Cme_job == "社長" || 
        member.Cme_job == "副社長" || 
        member.Cme_job == "幹部" || 
        member.Cme_job == "社團指導老師"){
        return true
    }else {
        return false
    }
}
//獲取社團詳細資訊
async function getClubDetail(id){
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const club = await Club.findOne({
        attributes: ['C_id', 'C_name', 'C_type', 'C_intro', 'C_web', 'C_quota'],
        where: {
            C_id:id
        }
    });
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
                clubId:id,
                club,
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

//獲取社團器材
async function getEquipments(clubId=null){
    let equipents;
    if(clubId!=null){
        equipents = await Club_equipment.findAll({
            include:[{
                model:Member,
                attributes:['M_name']
            }],
            where:{
                C_id:clubId
            },
            nest:true,
            raw:true
        });
    }else{
        equipents = await Club_equipment.findAll({
            include:[{
                model:Club,
                attributes:['C_name']
            },{
                model:Member,
                attributes:['M_name']
            }],
            nest:true,
            raw:true
        });
    }

    return equipents;
}

//獲取社團成員
async function getClubMember(clubId=null){
    let club_member;
    if(clubId!=null){
        club_member = await Club_member.findAll({
            attributes:['M_id','Cme_job'],
            include:[{
                model:Member,
                attributes:['M_name']
            }],
            where:{
                C_id:clubId
            },
            nest:true,
            raw:true
        });
    }else{
        club_member = await Club_member.findAll({
            attributes:['M_id','Cme_job'],
            include:[{
                model:Member,
                attributes:['M_name']
            }],
            nest:true,
            raw:true
        });
    }
    
    return club_member;
}