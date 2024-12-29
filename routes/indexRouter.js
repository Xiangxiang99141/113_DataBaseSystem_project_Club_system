const express = require('express');
const router = express.Router();


const indexController = require('../controllers/indexController');

// 首頁顯示社團列表
router.get('/', indexController.Renderindex);

// 登入頁面
router.get('/login', (req, res) => {
    res.render('login', { error: req.flash('error') });
});

// 註冊頁面
router.get('/signup', (req, res) => {
    res.render('signup', { error: false });
});

module.exports = router;
