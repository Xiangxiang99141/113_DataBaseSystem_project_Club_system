const express = require('express');
const router = express.Router();

const ClubController = require('../controllers/clubController');

router.get('/',ClubController.getclubs);
router.post('/',ClubController.createClub);


module.exports = router;