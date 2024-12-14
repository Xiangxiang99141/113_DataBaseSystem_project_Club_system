const express = require('express');
const router = express.Router();

const MemberContorller = require('../controllers/memberController');

router.get('/',MemberContorller.findUser);
router.post('/',MemberContorller.createUser);

module.exports = router;