const express = require('express');
const router = express.Router();
const verification = require('../util/verification');

const indexController = require('../controllers/indexController');

// 首頁顯示社團列表
router.get('/', indexController.Renderindex);

// 登入頁面
router.get('/login', (req, res) => {
    if(req.cookies['auth_token']){
        const user = verification(req.cookies['auth_token']);
        console.log(user);
        if(user){
            res.redirect('/');
            return;
        }else{
            res.render('login', { error: req.flash('error','認證失敗，請重新登入') });
        }
        
    }else{
        res.render('login', { error: req.flash('error') });
    }
});

// 註冊頁面
router.get('/signup', (req, res) => {
        res.render('signup', { error: false });
});

module.exports = router;
