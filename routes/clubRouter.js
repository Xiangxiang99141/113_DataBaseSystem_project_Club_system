const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { isAuthenticated } = require('../middleware/auth');
const verification = require('../util/verification');
const COOKIE_NAME = 'auth_token';


//獲取社團路由首頁
router.get('/',clubController.getHome);

//獲取社團資訊首頁
router.get('/info',clubController.getInfoHome);

//獲取社團資訊
router.get('/info/:id',clubController.getInfo);


router.post('/create', clubController.createClub);

// 獲取社團列表
router.get('/list', clubController.getClubs);

// API: 報名社團（需要登入）
router.post('/api/clubs/apply', isAuthenticated, clubController.applyClub);

router.post('/addMember', clubController.addClub_member);

//test
router.get('/getPermissions',clubController.getPermissions);

module.exports = router;