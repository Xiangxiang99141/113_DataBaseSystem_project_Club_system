const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { isAuthenticated } = require('../middleware/auth');
const verification = require('../util/verification');
const { error } = require('jquery');
const COOKIE_NAME = 'auth_token';


// 創建社團
router.get('/',async (req,res)=>{
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
        case 'info':
            break;
        default:
            break;
        }

});

router.post('/create', clubController.createClub);

// 獲取社團列表
router.get('/list', clubController.getClubs);

// API: 報名社團（需要登入）
router.post('/api/clubs/apply', isAuthenticated, clubController.applyClub);

router.post('/addMember', clubController.addClub_member);

//test
router.get('/getPermissions',clubController.getPermissions);

module.exports = router;