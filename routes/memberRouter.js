const express = require('express');
const router = express.Router();

const MemberContorller = require('../controllers/memberController');

router.get('/',MemberContorller.findUser);
router.post('/',MemberContorller.createUser);
router.post('/login',MemberContorller.login);
router.put('/update',MemberContorller.update);

module.exports = router;