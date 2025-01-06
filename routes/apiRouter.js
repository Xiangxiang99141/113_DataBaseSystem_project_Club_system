const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const clubController = require('../controllers/clubController');
const memberController = require('../controllers/memberController');

const uploadController = require('../controllers/uploadController');

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
router.post('/signup', memberController.signup);

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
router.get('/club/:id/members',clubController.getClubMembers);
//新增社員
router.post('/club/:id/member',clubController.addClubMember);


// 活動相關 API
router.get('/club/:id/activities', clubController.getClubActivity);
router.post('/club/:id/activity', upload.single('plan'),clubController.addActivity);
//報名活動
router.post('/club/:id/activity/signup/:AId',clubController.signupActivity);

// 社課相關 API
router.get('/club/:id/courses', clubController.getCourse);
router.post('/club/:id/course', clubController.addCourse);
//報名社課
router.post('/club/:id/course/signup/:CId',upload.fields([
    {name:'idcardImgFront',maxCount:1},
    {name:'idcardImgObverse',maxCount:1}
]),clubController.signupCourse);

// 會議相關 API
router.get('/club/:id/meetings', clubController.getMeetings);
router.post('/club/:id/meeting',  clubController.addMeeting);

// 設備相關 API
router.get('/club/:id/equipments', clubController.getEquipments);
router.get('/club/:id/equipment/:eid', clubController.getEquipment);
router.post('/club/:id/equipment',  upload.single('photo'), uploadController.uploadEquipent);
router.put('/club/:id/equipment/:eid', clubController.updateEquipment);

//歷史資料
router.get('/club/:id/histories',clubController.getHistories);
router.post('/club/:id/history', upload.single('attachment'),uploadController.uploadHistory);

//公告
router.get('/club/:id/announcements', clubController.getAnnouncements);
router.post('/club/:id/announcement', upload.fields([
    { name: 'attachment', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]),uploadController.uploadAnnouncement);

//獲取系統成員
router.get('/members',memberController.getMember);

// 解析 JSON
router.use(express.json());

module.exports = router;