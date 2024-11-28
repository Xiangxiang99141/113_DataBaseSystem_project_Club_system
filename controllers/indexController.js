const indexModel = require('../models/indexModel');

exports.getAllClubs = (req,res)=>{
    const clubs = indexModel.getAll();
    res.send({
        status:'success',
        clubs
    })
};

exports.createClub = (req,res)=>{
    const { name } = req.body;
    console.log(req.body);
    const newClub = indexModel.create({
        name
    });
    res.send({
        status:'success',
        club:newClub
    })
};