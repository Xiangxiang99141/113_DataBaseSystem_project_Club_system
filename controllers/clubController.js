const { Club } = require('../db/models');


exports.createClub = (req,res) =>{
    const {name,type,intro,web,quota} = req.body;

    Club.create({
        C_name:name,
        C_type:type,
        C_intro:intro,
        C_web:web,
        C_quota:quota
    }).
    then(club => {
        res.send({
            status:200,
            create:"創建社團成功",
            club:club
        })
    }).
    catch(e => {
        res.send(e);
    });
};


exports.getclubs = (req,res) => {
    Club.findAll().
    then(clubs => {
        res.send(clubs);
    }).
    catch(e => {
        res.send(e);
    })
}