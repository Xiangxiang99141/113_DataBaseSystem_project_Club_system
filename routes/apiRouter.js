const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const encryptoion = require('../util/encryption');
const { v4: uuidv4 } = require('uuid');
const clubController = require('../controllers/clubController');
const memberController = require('../controllers/memberController');
const manageController = require('../controllers/manageController');

const uploadController = require('../controllers/uploadController');

const auth = require('../middleware/auth');
const { Club_sign_record, Club_meeting, Club_equipment, Member, Club, Club_member, Club_activity, Club_course, Club_history, Club_announcement} = require('../db/models');

// 設置文件上傳
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //設定上傳根目錄
        let uploadDir = 'public/uploads/';
        
        // 根據不同類型的文件設置不同的上傳目錄
        switch(req.query.type) {
            case 'equipment':
                uploadDir += 'equipments';
                break;
            case 'activity':
                uploadDir += 'activity';
                break;
            case 'clubs':
                uploadDir += 'clubs';
                break;
            case 'history':
                uploadDir += 'histories';
                break;
            case 'announcement':
                uploadDir += 'announcement';
                break;
            default:
                uploadDir += 'misc';
        }

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // console.log('type:'+req.query.type)
        let uniqueSuffix;
        //格式化日期成YYYYMMDD
        const date = new Date(req.body.date)
        const extdate = date.getFullYear().toString()+date.getMonth().toString()+date.getDate().toString()
        switch(req.query.type){
            case 'history':
                //製作檔名
                uniqueSuffix = req.params.id+'-'+req.body.name+'-'+extdate;
                cb(null, uniqueSuffix + path.extname(file.originalname));
                break;
            case 'activity':
                //製作檔名
                uniqueSuffix = req.params.id+'-'+req.body.name+'-'+extdate;
                cb(null, uniqueSuffix + path.extname(file.originalname));
                break;
            default:
                uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + path.extname(file.originalname));
                break;
        }
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('不支援的檔案類型'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// 根目錄
router.get('/', (req, res) => {
    res.send('API is working');
});

// 登入
router.get('/login', memberController.login);

// 註冊
router.post('/signup', async (req, res) => {
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
});

// 社團相關 API
//創建社團
router.post('/club/create', clubController.createClub);

//獲取社團列表
router.get('/clubs', clubController.getClubs);

//獲取社團資訊
router.get('/club/:id', clubController.getClub);
//更新社團資訊
router.put('/club/:id', clubController.updateClub);
// 社團報名
router.post('/club/:id/signUp',  clubController.signupClub);

//查看社團報名列表
router.get('/club/:id/signUpMember', clubController.getSignupMembers);

//社團成員
//查詢
router.get('/club/:id/members',async (req,res)=>{
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
    
});
router.post('/club/:id/member',async (req,res)=>{
    try {
        const clubMember = await Club_member.create({
            C_id:req.params.id,
            M_id:req.body.userId,
            Cme_job:req.body.job,
            Cme_member_join_at:new Date()
        });
        res.json({
            success: true,
            message: '社團報名成功',
            data: clubMember
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message ||'社團報名失敗'
        });
    }
});


// 活動相關 API
router.get('/club/:id/activities', async (req, res) => {
    try {
        const activities = await Club_activity.findAll({
            where: { C_id: req.params.id },
            include:[{
                model:Club,
                attributes:['C_name']
            }]
        });

        res.json({
            success: true,
            message: '活動獲取成功',
            data: activities
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '獲取活動失敗'
        });
    }
});
router.post('/club/:id/activity', upload.single('plan'),async (req, res) => {
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
            Ca_plan:req.file ? `/uploads/activityplan/${req.file.filename}` : null,
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
});

// 社課相關 API
router.get('/club/:id/courses', async (req, res) => {
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
});
router.post('/club/:id/course', async (req, res) => {
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
});

// 會議相關 API
router.get('/club/:id/meetings',async (req,res)=>{
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
            message: '會議記錄查詢結果',
            data: meetings
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '查尋會議記錄時發生錯誤'
        });
    }
    
});
router.post('/club/:id/meeting',  async (req, res) => {
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
            message: '會議記錄新增成功',
            data: meeting
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '新增會議記錄時發生錯誤'
        });
    }
});

// 設備相關 API
router.get('/club/:id/equipments', async (req, res) => {
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
});
router.get('/club/:id/equipment/:eid', async (req, res) => {
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
});
router.post('/club/:id/equipment',  upload.single('photo'), async (req, res) => {
    try {
        const { name, quantity, spec, use, source, admin, date ,report} = req.body;
        
        if (!name || !quantity || !spec || !use || !source || !admin || !report) {
            return res.status(400).json({
                success: false,
                message: '所有欄位都是必填的'
            });
        }

        const equipment = await Club_equipment.create({
            Ce_name: name,
            Ce_count: quantity,
            Ce_spec: spec,
            Ce_use: use,
            Ce_source: source,
            Ce_img: req.file ? `/uploads/equipments/${req.file.filename}` : null,
            Ce_admin: admin,
            Ce_report: report,
            Ce_purch_at: date ? new Date(date) : new Date(),
            C_id: req.params.id
        });

        res.json({
            success: true,
            message: '器材新增成功',
            data: equipment
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '新增器材時發生錯誤'
        });
    }
});
router.put('/club/:id/equipment/:eid', async (req, res) => {
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
});

//歷史資料
router.get('/club/:id/histories',async (req,res)=>{
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
    
});
router.post('/club/:id/history', upload.single('attachment'),uploadController.Upload_history);

//公告
router.get('/club/:id/announcements',async (req,res)=>{
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
    
});
router.post('/club/:id/announcement', upload.fields([
    { name: 'attachment', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]),uploadController.Upload_announcement);

// 解析 JSON
router.use(express.json());

module.exports = router;