const { 
    Club_activity,
    Club_announcement,
    Club_course,
    Club_equipment,
    Club_history,
    Club_meeting_participate_member,
    Club_meeting_record,
    Club_meeting,
    Club_member,
    Club_record,
    Club_sign_record,
    Club, 
    Insurance_img,
    Insurance,
    Member,
    Signup_record,
    Transportation,} = require('../db/models');
const { Op, where, Model } = require('sequelize');
const { cache } = require('ejs');
const e = require('connect-flash');
const moment = require('moment');
const COOKIE_NAME = 'auth_token';
const verification = require('../util/verification');
const { param } = require('jquery');

// 獲取所有社團
exports.getClubs = async (req, res) => {
    try {
        const clubs = await Club.findAll();
        if(req.query.noInfo){
            res.status(200).json(clubs);
        }else{
            res.status(200).json({ 
                success: true, 
                message: '社團獲取成功',
                clubs: clubs 
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || '社團查詢失敗' 
        });
    }
}

// 創建社團
exports.createClub = async (req, res) => {
    try {
        const user = await verification(req.cookies[COOKIE_NAME]);
        console.log(user);
        const club = await Club.create({
            C_name: req.body.name,
            C_type: req.body.type,
            C_intro: req.body.intro,
            C_web: req.body.web||null,
            C_quota: req.body.quota,
            C_colse: false,
            C_created_at: new Date(),
            C_update_at: new Date(),
        });

        //新增報名紀錄
        await Club_sign_record.create({
            M_id: user.userId,
            C_id: club.C_id,
            signup_cause: '創建社團',
            signup_at: new Date(),
            is_verify: true
        });

        //新增為成員
        await Club_member.create({
            M_id: user.userId,
            C_id: club.C_id,
            Cme_job: '社長'
        });
        res.json({
            success: true,
            message: '社團創建申請成功',
            data: club
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '社團創建申請失敗'
        });
    }
};

// 申請加入社團
exports.applyClub = async (req, res) => {
    try {
        const { clubId } = req.body;
        const memberId = req.user.M_id;  // 從 JWT 中獲取用戶 ID

        // 檢查是否已經是社團成員
        const existingMembership = await Club_member.findOne({
            where: {
                M_id: memberId,
                C_id: clubId
            }
        });

        if (existingMembership) {
            return res.status(400).json({
                success: false,
                message: '你已經是該社團的成員'
            });
        }

        // 檢查社團名額
        const club = await Club.findByPk(clubId);
        const memberCount = await Club_member.count({
            where: { C_id: clubId }
        });

        if (memberCount >= club.C_quota) {
            return res.status(400).json({
                success: false,
                message: '該社團已達到人數上限'
            });
        }

        // 創建社團成員記錄
        await Club_member.create({
            M_id: memberId,
            C_id: clubId,
            CM_position: 'member',  // 預設為普通成員
            CM_status: 'active'
        });

        res.json({
            success: true,
            message: '成功加入社團'
        });
    } catch (error) {
        console.error('Error in applyClub:', error);
        res.status(500).json({
            success: false,
            message: '申請加入社團失敗'
        });
    }
};

//報名社團
exports.signupClub = async (req, res) => {
    try {
        const signup = await Club_sign_record.create({
            // M_id: req.user.M_id,
            M_id:req.body.userId,
            C_id: req.params.id,
            signup_cause: req.body.cause,
            signup_at: new Date(),
            is_verify:false
        });

        res.json({
            success: true,
            message: '您的報名已提交，請待幹部審核',
            data: signup
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '報名失敗'
        });
    }
};

//獲取報名列表
exports.getSignupMembers = async (req, res) => {
    try {
        const signups = await Club_sign_record.findAll({
            attributes:['signup_cause','is_verify','not_verify_cause'],
            raw: true, // 使用原始查詢結果
            nest: true, // 巢狀結果
            where: {
                C_id: req.params.id
            },
            include: [{
                model: Member,
                attributes: ['M_name', 'M_account', 'email', 'M_phone']
            }]
        });

        // 格式化日期
        const formattedSignups = signups.map(signup => ({
            ...signup,
            signup_at: signup.signup_at ? new Date(signup.signup_at).toLocaleString() : null
        }));

        res.json({
            success: true,
            message: '申請列表查詢成功',
            data: formattedSignups
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '查詢失敗'
        });
    }
}
exports.addClub_member = (req,res) => {
    const {userId,clubId,permission} = req.body

    Club_member.create({
        C_id:clubId,
        M_id:userId,
        Cme_job:permission
    }).
    then(job => {
        res.send(job);
    }).
    catch(e=>{
        res.send(e);
    });
}
//審核通過
exports.applySignup = (req,res) => {
    try {
        Club_sign_record.update({
            is_verify:true
        },{
            where: {
                M_id:req.params.Mid,
                C_id: req.params.id,
                }
        }).then(result=>{
            console.log(result)
            Club_member.create({
                C_id:req.params.id,
                M_id:req.params.Mid,
                Cme_job:'社員',
                Cme_member_join_at:new Date()
            }).then(
                res.json({
                    success: true,
                    message: '報名已通過成功',
                    data: result
                })
            );
        }).catch(error=>{
            res.json({
                success: false,
                message: '審核失敗',
                data: error
            });
        });

        

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '查詢失敗'
        });
    }
}


exports.getPermissions = (req,res)=>{
    Club_member.findAll({
        include:[{
            attributes:['C_name'],
            model:Club,
        },
        {
            attributes:['M_name'],
            model:Member,
        }],
        where:{M_id:req.body.userId}
        
    }).then(clubPermissions=>{
        res.send(clubPermissions);
    }).catch(e=>{
        res.send(e)
    });
}
//新增會議
exports.createMeeting = (req,res) =>{
    const {name,content,location,userId,clubId} = req.body;
    try {
        const meet = createMeeting(name,content,location,userId,clubId);
        res.flash('error',false);
        res.flash('success','新增會議成功');
        console.log(meet);
        res.redirect('..');
    } catch (error) {
        console.log(error);
        res.flash('error','新增失敗，請稍後再試');
        res.flash('success',false);
    }
    

}


//獲取社團路由首頁
exports.getHome = async (req,res)=>{
    let is_login = false;
    let user = null;
    switch(req.query.action){
        case 'create':
            if(req.cookies[COOKIE_NAME]){
                const token = req.cookies[COOKIE_NAME];
                user = await verification(token);
                if(user){
                    is_login = true
                }
                res.render('create-club',{
                isLogin:is_login,
                error:null,
                success:null
            });
            }else{
                res.redirect('/login');
            }
            break;
        default:
            res.render('error',{message:"你以為這裡有東西嗎\n想的美😛😛"});
            break;
    }
}

//獲取社團資訊
exports.getInfoHome = async (req,res) => {
    try {
        res.render('error',{message:"你以為這裡有東西嗎\n想的美😛😛"});
    } catch (error) {
        console.error('Error in getClub info:', error);
        res.status(500).json({
            success: false,
            message: '社團資訊獲取失敗'
        });
    }
}
exports.getInfo = async (req,res) => {
    try {
        let is_login = false;
        let user;
        if(req.cookies[COOKIE_NAME]){
            user = await verification(req.cookies[COOKIE_NAME]);
        }
        if(user){
            is_login = true;
        }
        //使用社團ID找尋社團
        const club = await Club.findByPk(req.params.id,{
            include:[{
                model:Member,
                attributes:['M_name'],
                through:{
                    where:{Cme_job:"社長"},
                    attributes:['Cme_job']
                }
            }],
            nest:true,
            raw:true
        });
        club.C_created_at = moment(club.C_created_at).format('YYYY-MM-DD');

        //獲取社團活動
        const {count:activity_count,rows:activity_rows} = await Club_activity.findAndCountAll({
            attributes:['Ca_id','Ca_name','Ca_content','Ca_location','Ca_date','Ca_quota','Ca_open_at','Ca_close_at'],
            where:{
                C_id:req.params.id
            },
            nest:true,
            raw:true
        });
        
        //獲取社團課程
        const {count:course_count,rows:course_rows} = await Club_course.findAndCountAll({
            attributes:['Cc_id','Cc_name','Cc_content','Cc_location','Cc_date','Cc_quota','Cc_open_at','Cc_close_at'],
            where:{
                C_id:req.params.id
            },
            nest:true,
            raw:true
        });

        //獲取成員人數
        const member_count = await Club_member.count({
            where:{
                C_id:req.params.id
            }
        });

        //將陣列重新映射成包含是否可以報名
        const activities = activity_rows.map((activity) => {
            return {
                Ca_id:activity.Ca_id,
                Ca_name:activity.Ca_name,
                Ca_content:activity.Ca_content,
                Ca_location:activity.Ca_location,
                Ca_date:covertDate(activity.Ca_date),
                Ca_quota:activity.Ca_quota,
                Ca_status: isStrat(activity.Ca_open_at,activity.Ca_close_at,activity.Ca_date)
            }
        });

        const courses = course_rows.map((course) => {
            return {
                Cc_id:course.Cc_id,
                Cc_name:course.Cc_name,
                Cc_content:course.Cc_content,
                Cc_location:course.Cc_location,
                Cc_date:course.Cc_date,
                Cc_quota:course.Cc_quota,
                Cc_status: isStrat(course.Cc_open_at,course.Cc_close_at,course.Cc_date)
            }
        });

        res.render('club_info',{
            isLogin:is_login,
            club:club,
            activities:activities || [],
            courses:courses || [],
            member_count:member_count || 0,
            activities_count:activity_count || 0,
            courses_count:course_count || 0,
        });
    } catch (error) {
        console.error('Error in getClub info:', error);
        res.status(500).json({
            success: false,
            message: '社團資訊獲取失敗'
        });
    }
}

//顯示活動頁面
exports.getActivitiesListView = async (req,res)=>{
    try{
        let is_login = false;
        let user;
        let activities;
        if(req.cookies[COOKIE_NAME]){
            user = await verification(req.cookies[COOKIE_NAME]);
        }
        if(user){
            is_login = true;
        }
        let clubs = await getClubs();
        Club_activity.findAll({
            attributes:['Ca_id','Ca_name','Ca_location','Ca_date','Ca_quota','Ca_open_at','Ca_close_at'],
            include:[{
                model:Club,
                attributes:['C_id','C_name']
            }],
            nest:true,
            raw:true
        }).then(result=>{
            activities = result.map(row=>({
                    Ca_id:row.Ca_id,
                    Ca_name:row.Ca_name,
                    Ca_location:row.Ca_location,
                    Ca_date:covertDate(row.Ca_date),
                    Ca_quota:row.Ca_quota,
                    Ca_status:isStrat(
                        row.Ca_open_at,
                        row.Ca_close_at
                    ),
                    C_name:row.Club.C_name,
                    C_id:row.Club.C_id
            }));
            res.status(200).render('activity_list',{
                isLogin:is_login,
                activities:activities,
                clubs:clubs,
                success:null,
            })
        });

    } catch (error) {
        console.error('Error in getClub Activities:', error);
        res.status(500).json({
            success: false,
            message: '社團活動獲取失敗'
        });
    }
}

//顯示社課頁面
exports.getCoursesListView = async (req,res) =>{
    try{
        let is_login = false;
        let user;
        let courses;
        if(req.cookies[COOKIE_NAME]){
            user = await verification(req.cookies[COOKIE_NAME]);
        }
        if(user){
            is_login = true;
        }
        let clubs = await getClubs();
        Club_course.findAll({
            attributes:[
                'Cc_id',
                'Cc_name',
                'Cc_location',
                'Cc_date',
                'Cc_quota',
                'Cc_open_at',
                'Cc_close_at'],
            include:[{
                model:Club,
                attributes:['C_id','C_name']
            },{
                model:Signup_record,
                attributes:['su_id']
            }],
            nest:true,
            raw:true
        }).then(result=>{
            courses = result.map(row=>({
                    Cc_id:row.Cc_id,
                    Cc_name:row.Cc_name,
                    Cc_location:row.Cc_location,
                    Cc_date:covertDate(row.Cc_date),
                    Cc_quota:row.Cc_quota,
                    Cc_status:isStrat(
                        row.Cc_open_at,
                        row.Cc_close_at,
                        row.Cc_date
                    ),
                    is_signup:(row.Signup_record.su_id!=null)?true:false,
                    C_name:row.Club.C_name,
                    C_id:row.Club.C_id
            }));
            res.status(200).render('course_list',{
                isLogin:is_login,
                clubs:clubs,
                courses:courses,
                success:null,
            });
        });

    } catch (error) {
        console.error('Error in getClub Courses:', error);
        res.status(500).json({
            success: false,
            message: '社團課程獲取失敗'
        });
    }
}

//顯示活動報名畫面
exports.getActivitySignupView = async (req,res)=>{
    //參數 CId=> 社團Id CAId =>課程Id
    //passlet is_login = false;
    let user;
    if(req.cookies[COOKIE_NAME]){
        user = await verification(req.cookies[COOKIE_NAME]);
    }
    if(user){
        is_login = true;
    }
    //參數 CId=> 社團Id CCId =>課程Id
    if(req.query.CId && req.query.CAId){
        try{
            Club_activity.findOne({
                attributes:[
                    'Ca_id',
                    'Ca_content',
                    'Ca_id',
                    'Ca_location',
                    'Ca_date',
                    'insurance',
                    'transportation',
                    'C_id'
                ],
                where:{
                    Ca_id:req.query.CAId,
                    C_id:req.query.CId
                },
                nest:true,
                raw:true
            }).then((activity)=>{
                res.status(200).render('activity_signup',{
                    isLogin:is_login,
                    activity:activity
                });
            });
        }catch(error){
            res.status(500).render('error',{
                message:error
            })
        }
    }else{
        res.status(200).render('error',{
            message:'未找到活動'
        })
    }
}

//顯示社課報名畫面
exports.getCourseSignupView = async (req,res)=>{
    let is_login = false;
    let user;
    if(req.cookies[COOKIE_NAME]){
        user = await verification(req.cookies[COOKIE_NAME]);
    }
    if(user){
        is_login = true;
    }
    //參數 CId=> 社團Id CCId =>課程Id
    if(req.query.CId && req.query.CCId){
        try{
            Club_course.findOne({
                attributes:[
                    'Cc_id',
                    'Cc_id',
                    'Cc_content',
                    'Cc_location',
                    'Cc_date',
                    'insurance',
                    'transportation',
                    'C_id'
                ],
                where:{
                    Cc_id:req.query.CCId,
                    C_id:req.query.CId
                },
                nest:true,
                raw:true
            }).then((course)=>{
                
                res.status(200).render('course_signup',{
                    isLogin:is_login,
                    course:course
                });
            });
        }catch(error){
            res.status(500).render('error',{
                message:error
            })
        }
    }else{
        res.status(200).render('error',{
            message:'未找到社課'
        })
    }
}
//獲取社團列表
exports.getClub = async (req,res) => {
    try{
        const club = await Club.findByPk(req.params.id,{
            attributes:['C_name','C_type','C_intro','C_web','C_quota'],
            nest:true,
            raw:true
        });
        if(club){
            res.json({
                success: true,
                message: '社團資訊獲取成功',
                data: club
            });
        }
    }catch(error){
        res.json({
            success: false,
            message: '社團資訊獲取失敗',
        });
    }
};

//更新社團資訊
exports.updateClub = async (req,res) => {
    if(req.params.id){
        try{
            const club = await Club.update({
                C_intro:req.body.intro,
                C_web:req.body.web,
                C_quota:req.body.quota,
                C_update_at:new Date()
            }, {
                where:{
                    C_id:req.params.id
                }
            });
            if(club){
                res.json({
                    success:true,
                    message:'社團資訊更新成功',
                    data:club
                });
            }else{
                res.status(500).json({
                    success:false,
                    message:'你是不是想抓bug'
                });
            }
        }catch(error){

        }
    }else{
        res.status(500).json({
            success:false,
            message:'想抓bug阿'
        });
    }
}
//獲取社團成員
exports.getClubMembers = async (req,res)=>{
    try {
        const clubMembers = await Club_member.findAll({
            where:{C_id:req.params.id},
            include:[{
                model:Club,
                attributes:['C_name']
            },{
                model:Member,
                attributes:['M_name']
            }]
        });
        res.json({
            success: true,
            message: '社團成員列表查詢成功',
            data: clubMembers
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message || '查詢失敗',
        });
    }
    
}
//新增社員
exports.addClubMember = async (req,res)=>{
    try {
        //新增社團成員
        const clubMember = await Club_member.create({
            C_id:req.params.id,
            M_id:req.body.userId,
            Cme_job:req.body.job,
            Cme_member_join_at:new Date()
        });
        //新增報名紀錄
        const clubSignRecord = await Club_sign_record.create({
            M_id:req.body.userId,
            C_id:req.params.id,
            is_verify:true,
            signup_cause:'由社團幹部新增',
            signup_at:new Date()
        });
        //如果都新增成功才回傳成功
        if(clubMember && clubSignRecord){
            res.status(200).json({
                success: true,
                message: '社團成員新增成功',
                data: clubMember
            });
        }else{
            res.json({
                success: false,
                message: '伺服器錯誤'
            });
        };
    } catch (error) {
        res.json({
            success: false,
            message: error.message ||'社團報名失敗'
        });
    }
}

exports.getClubActivitNoInfo = async (req,res)=>{
    try {
        Club_activity.findAll({
            include:[{
                model:Club,
                attributes:['C_name']
            }]
        }).then((activities)=>{
            console.log(646)
            res.json(
                activities
            );
        }).catch(e=>{
            console.log(e)
        })
        
        

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取活動失敗'
        });
    }
}

//獲取社團活動
exports.getClubActivity = async (req, res) => {
    try {
        let activities;
        activities = await Club_activity.findAll({
            where: { C_id: req.params.id },
            include:[{
                model:Club,
                attributes:['C_name']
            }]
        });
        

        if(req.query.noInfo){
            res.json(
                activities
            );
        }else{
            res.json({
                success: true,
                message: '活動獲取成功',
                data: activities
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取活動失敗'
        });
    }
}
//獲取社團公告
exports.getAnnouncements = async (req,res)=>{
    try {
        const announcements = await Club_announcement.findAll({
            where:{C_id:req.params.id},
            include:[{
                model:Club,
                attributes:['C_name']
            }],
            //排序
            order:[['Can_created_at','DESC']]
        });
        res.json({
            success: true,
            message: '獲取公告成功',
            data: announcements
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取公告失敗'
        });
    } 
}
//獲取社團歷史資料
exports.getHistories = async (req,res)=>{
    try {
        const histories = await Club_history.findAll({
            where:{C_id:req.params.id},
            include:[{
                model:Club,
                attributes:['C_name']
            }]
        });
        res.json({
            success: true,
            message: '資料獲取成功',
            data: histories
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '資料獲取失敗'
        });
    }
}
//獲取所有器材
exports.getEquipments = async (req, res) => {
    try {
        const equipment = await Club_equipment.findAll({
            where:{
                C_id:req.params.id
            },
            include:[{
                model:Club,
                attributes:['C_name']
            },{
                model:Member,
                attributes:['M_name','M_id']
            }]
        });
        res.json({
            success: true,
            message: '器材獲取成功',
            data: equipment
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取器材失敗'
        });
    }
}
//獲取單一器材
exports.getEquipment = async (req, res) => {
    try {
        const equipment = await Club_equipment.findOne({
            where:{
                Ce_id:req.params.eid,
                C_id:req.params.id
            },
            include:[{
                model:Club,
                attributes:['C_name']
            },{
                model:Member,
                attributes:['M_name','M_id']
            }]
        });
        res.status(200).json({
            success: true,
            message: '器材獲取成功',
            data: equipment
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取器材失敗'
        });
    }
}
//更新器材
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await Club_equipment.update({
            Ce_name: req.body.name,
            Ce_count: req.body.quantity,
            Ce_spec: req.body.spec,
            Ce_use: req.body.use,
            Ce_source: req.body.source,
            Ce_admin: req.body.admin,
            Ce_report: req.body.report,
            Ce_purch_at: req.body.date ? new Date(req.body.date) : new Date()
        }, {
            where: {
                Ce_id: req.params.eid,
                C_id: req.params.id
            }
        });

        res.json({
            success: true,
            message: '器材更新成功',
            data: equipment
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '更新器材時發生錯誤'
        });
    }
}


//新增會議記錄
exports.addMeeting = async (req, res) => {
    try {
        const meeting = await Club_meeting.create({
            Cm_name: req.body.name,
            Cm_chair: req.body.chair,
            Cm_content: req.body.content,
            Cm_location: req.body.location,
            Cm_date_at: new Date(req.body.datetime),
            C_id: req.params.id
        });

        res.json({
            success: true,
            message: '會議新增成功',
            data: meeting
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '新增會議時發生錯誤'
        });
    }
}
//獲取會議記錄
exports.getMeetings = async (req,res)=>{
    try {
        const meetings = await Club_meeting.findAll({
            where:{C_id:req.params.id},
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
        res.json({
            success: true,
            message: '會議查詢結果',
            data: meetings
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '查尋會議時發生錯誤'
        });
    }
    
}

//報名社課
exports.signupCourse = async (req,res)=>{
    if(req.params.CId){
        user = await verification(req.cookies['auth_token']);
        try{
            let insurance_img;
            let insurance = null;
            let transportation = null;
            
            //判斷有無保險資料
            if(req.body.useinsurance == 'true'){
                console.log(req.files);
                if(req.files.length>0){
                    let front = req.files['idcardImgFront'][0].filename
                    let obserse = req.files['idcardImgObverse'][0].filename
                    if(front!=false && obserse!=false){
                        insurance_img =await Insurance_img.create({
                            front:`/uploads/misc/${front}`,
                            obverse:`/uploads/misc/${obserse}`
                        });
                    }
                }else{
                    insurance_img = false;
                }
                insurance = await Insurance.create({
                    Ins_isadult:req.body.isadult,
                    Ins_idcard:req.body.idcardnumber,
                    Ins_nationality:req.body.nationality,
                    Ins_birthday:req.body.birthday,
                    Ins_liaison:(req.body.liaison=='')?null:req.body.liaison,
                    Ins_liaisonPhone:(req.body.liaisonPhone=='')?null:req.body.liaisonPhone,
                    Ins_engname:(req.body.engname=='')?null:req.body.engname,
                    Ins_idcardimg:(insurance_img==false)?null:insurance_img.Insimg_id
                });
            }

            //判斷有無交通資料
            if(req.body.usetransport == 'true'){
                transportation = await Transportation.create({
                    Ts_method:req.body.Transport
                });
            }

            Signup_record.create({
                M_id:user.userId,
                Su_type:'社課',
                Ca_id:null,
                Cc_id:req.params.CId,
                Ins_id:(insurance != null )?insurance.Ins_id: null,
                Ts_id:(transportation!=null)?transportation.Ts_id:null,
                Su_create_at:new Date()
            }).then(
                Club_record.create({
                    M_id:user.userId,
                    Cr_type:'社課',
                    Ca_id:null,
                    Cc_id:req.params.CId,
                    Cr_comment:'',
                    Cr_vote:'非常滿意',
                    C_id:req.params.id
                }).then(
                    res.status(200).json({
                        success: true,
                        message: '社課報名成功',
                    })
                )
                
            );

        }catch(error){
            console.log(error.message);
            res.status(500).json({
                success:false,
                message: error.message || '伺服器錯誤'
            });
        };

    }else{
        console.log('Error:未找到可報名課程')
    }
}
//新增社課
exports.addCourse = async (req, res) => {
    try {
        const courses = await Club_course.create({
            Cc_name:req.body.name,
            Cc_content:req.body.content,
            Cc_location:req.body.location,
            Cc_date:new Date(req.body.datetime),
            Cc_quota:req.body.quota,
            Cc_open_at:new Date(req.body.open),
            Cc_close_at:new Date(req.body.close),
            insurance:req.body.insurance,
            transportation:req.body.transportation,
            C_id:req.params.id
        });
        res.json({
            success: true,
            message: '課程新增成功',
            data: courses
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '課程新增失敗'
        });
    }
}
//獲取社課
exports.getCourse = async (req, res) => {
    try {
        const courses = await Club_course.findAll({
            where:{C_id:req.params.id},
            include:[{
                model:Club,
                attributes:['C_name']
            }],
            nest:true,
            raw:true
        });
        res.json({
            success: true,
            message: '課程獲取成功',
            data: courses
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取課程失敗'
        });
    }
}

//報名活動
exports.signupActivity = async (req,res)=>{
    if(req.params.AId){
        console.log(req.body);
    }else{
        console.log('Error:未找到可報名活動')
        res.status(500).json({
            success:false,
            message: '未找到可報名活動'
        });
    }
}
//新增活動
exports.addActivity = async (req, res) => {
    try {
        const courses = await Club_activity.create({
            Ca_name:req.body.name,
            Ca_content:req.body.content,
            Ca_location:req.body.location,
            Ca_date:new Date(req.body.datetime),
            Ca_quota:req.body.quota,
            Ca_open_at:new Date(req.body.open),
            Ca_close_at:new Date(req.body.close),
            insurance:req.body.insurance,
            transportation:req.body.transportation,
            Ca_plan:req.file ? `/uploads/activity/${req.file.filename}` : null,
            C_id:req.params.id
        });
        res.json({
            success: true,
            message: '活動新增成功',
            data: courses
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '活動新增失敗'
        });
    }
}

//判斷活動是否可報名
//時間內可報名，當天顯示即將開始
function isStrat(open,close,date){
    if(Date.now() >= open && Date.now() <= close){
        return "報名中";
    }else if(Date.now()>= close){
        return "已結束"
    }else if(Date.now() == date){
        return "即將開始"
    }
}


//轉換時間格式
function covertDate(date){
    return moment(date).format('YYYY-MM-DD dddd');
}

async function getmeetings(clubId=null){
    let meetings;
    try{ 
        if(clubId!=null){
            meetings = await Club_meeting.findAll({
                attributes:['Cm_name','Cm_content','Cm_location'],
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
        }else{
            meetings = await Club_meeting.findAll({
                attributes:['Cm_name','Cm_content','Cm_location'],
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
        return meetings;
    }catch(e){
        console.log(`Get Error : '${e}'`);
    }
};

async function createmeeting(name,content,location,userId,clubId,date){
    const meeting = await Club_meeting.create({
        Cm_name:name,
        Cm_chair:userId,
        Cm_content:content,
        Cm_location:location,
        Cm_date_at:date,
        C_id:clubId
    });

    return meeting;

};


async function getEquipment(clubId=null){
    const equipents = await Club_equipment.findAll({
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

    return equipents;
}

async function getClubMember(clubId=null){
    let club_member;
    if(club_member != null){
        club_member = await Club_member.findAll({
            attributes:['M_id','Cme_job'],
            include:[{
                model:Member,
                attributes:['M_name']
            },{
                model:Club,
                attributes:['C_name']
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
            },{
                model:Club,
                attributes:['C_name']
            }],
            nest:true,
            raw:true
        });
    }
    return club_member;
}

async function getClubs(){
    const clubs = Club.findAll({
        attributes:['C_id','C_name','C_type'],
        nest:true,
        raw:true
    })
    return clubs;
}
