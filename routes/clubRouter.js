const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { isAuthenticated } = require('../middleware/auth');


//獲取社團路由首頁
router.get('/',clubController.getHome);

//獲取社團資訊首頁
router.get('/info',clubController.getInfoHome);

//獲取社團資訊
router.get('/info/:id',clubController.getInfo);

router.get('/activity',clubController.getActivitiesListView)
router.get('/course',clubController.getCoursesListView)

// API: 報名社團（需要登入）
router.post('/api/clubs/apply', isAuthenticated, clubController.applyClub);

router.post('/addMember', clubController.addClub_member);

//test
router.get('/getPermissions',clubController.getPermissions);

module.exports = router;