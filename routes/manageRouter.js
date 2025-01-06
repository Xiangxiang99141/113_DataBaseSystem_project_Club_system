const express = require('express');
const router = express.Router();
const { Club_member, Club_activity, Club_course, Club_meeting, Club_sign_record, Member} = require('../db/models');
const { Op, Model, where } = require('sequelize');
const MemberController = require('../controllers/memberController');
const ManageController = require('../controllers/manageController');
const ClubController = require('../controllers/clubController');
const { raw } = require('mysql2');
const util = require('../util/util');
const {isAuthenticated} = require('../middleware/auth');

// 管理首頁
router.get('/', isAuthenticated, ManageController.getview)

// 社員管理
router.get('/members', isAuthenticated, ManageController.getMembersView);

// 活動管理
router.get('/activities', isAuthenticated, ManageController.getActivitiesView);

// 社課管理
router.get('/courses', isAuthenticated, ManageController.getCoursesView);

// 會議管理
router.get('/meetings', isAuthenticated, 
    ClubController.getMeetings
    // async (req, res) => {
    // try {
    //     const meetings = await Club_meeting.findAll({
    //         include: [{
    //             model: Club_member,
    //             as: 'chair',
    //             attributes: ['M_name']
    //         }]
    //     });
    //     const members = await Club_member.findAll();
    //     res.render('meetings/index', { meetings, members });
    // } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).send('Server Error');
    // }}
);
// router.post('/meeting',ClubController.createMeeting);

router.get('/equipment',isAuthenticated,ManageController.getEquipmentsView);

//顯示報名列表
router.get('/signup', isAuthenticated, ManageController.getSignupView);

router.get('/records', isAuthenticated,ManageController.getRecordsView);
module.exports = router;