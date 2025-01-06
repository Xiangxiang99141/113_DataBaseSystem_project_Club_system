const express = require('express');
const router = express.Router();
const verification = require('../util/verification');

const indexController = require('../controllers/indexController');

// 首頁顯示社團列表
router.get('/', indexController.renderIndex);

// 登入頁面
router.get('/login', indexController.loginView);

// 註冊頁面
router.get('/signup', indexController.signupView);

module.exports = router;
