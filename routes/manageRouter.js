const express = require('express');
const router = express.Router();
const { Club_member, Club_activity, Club_course, Club_meeting } = require('../db/models');
const { Op } = require('sequelize');
const MemberController = require('../controllers/memberController');
const ManageController = require('../controllers/manageController');
const ClubController = require('../controllers/clubController');

// 管理首頁
router.get('/',ManageController.getview)

// 社員管理
router.get('/members', MemberController.getview);

// 活動管理
router.get('/activities', async (req, res) => {
    try {
        const activities = await Club_activity.findAll();
        res.render('activities/index', { activities });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

// 社課管理
router.get('/courses', async (req, res) => {
    try {
        const courses = await Club_course.findAll();
        res.render('courses/index', { courses });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

// 會議管理
router.get('/meetings', 
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

router.get('/equipment',ClubController.getEquipments);


module.exports = router;