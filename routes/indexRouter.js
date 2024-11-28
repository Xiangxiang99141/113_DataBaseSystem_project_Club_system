const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController.js');




// router.get('/',indexController);
router.get('/',indexController.getAllClubs
    // res.render('index', {
    //     game: 'Final Fantasy VII',
    //     category: '<p><b>Characters:</b></p>',
    //     characters: ['Cloud', 'Aerith', 'Tifa', 'Barret']
    // });
);

router.post('/',indexController.createClub);


module.exports = router;












