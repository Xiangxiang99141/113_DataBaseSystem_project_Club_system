const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { isAuthenticated } = require('../middleware/auth');

// 創建社團
router.post('/create', clubController.createClub);

// 獲取社團列表
router.get('/list', clubController.getClubs);

// API: 報名社團（需要登入）
router.post('/api/clubs/apply', isAuthenticated, clubController.applyClub);

router.post('/addMember', clubController.addClub_member);

//test
router.get('/getPermissions',clubController.getPermissions);

module.exports = router;