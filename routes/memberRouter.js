const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { isAuthenticated } = require('../middleware/auth');

// API 路由
router.post('/register', memberController.createUser);
router.post('/login', memberController.login);
router.post('/login',isAuthenticated, memberController.login);
router.get('/logout', isAuthenticated, memberController.logout);
router.put('/update', isAuthenticated, memberController.update);

module.exports = router;