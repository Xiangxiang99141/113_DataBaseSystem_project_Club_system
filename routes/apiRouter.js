const express = require('express');
const router = express.Router();
const {} = require('../db/models')

//根目錄
router.get('/');

//登入
router.get('/login');

//註冊
router.post('/signup');

//新增社團
router.post('/create/club');

//查詢社團
router.get('/club');

//報名社團
router.post('/club/signup');

//新增活動
router.post('/create/activity');

//查詢活動
router.get('/club/activity');

//新增社課
router.get('/create/course');

//查詢社課
router.get('/club/course');

//新增器材
router.get('/create/equipment');

//查詢器材
router.get('/club/equipment');

//新增會議
router.post('/create/meet');

//填寫會議記錄
router.get('/create/meet/record');

//查詢會議
router.get('/meet');

//填寫活動經歷
router.post('/create/record');

//查詢心得
router.get('/record');

//新增公告
router.get('/create/announcement');

//查詢公告
router.get('/announcement');

//新增社團歷史資料
router.get('/create/history');

//查詢社團歷史資料
router.get('/histroy');





module.exports = router;