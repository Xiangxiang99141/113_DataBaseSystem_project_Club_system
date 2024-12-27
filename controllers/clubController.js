const { raw } = require('mysql2');
const { Club, Club_member, Member, Club_meeting, Club__equipment} = require('../db/models');
const { Op, where, Model } = require('sequelize');
const { cache } = require('ejs');
const e = require('connect-flash');

// 獲取所有社團
exports.getClubs = async ()=>{
        const clubs = await Club.findAll({
            attributes: ['C_id', 'C_name', 'C_type', 'C_intro', 'C_quota'],
            raw: true
        });
}

// 創建社團
exports.createClub = async (req, res) => {
    try {
        const { name, type, intro, quota } = req.body;
        
        const club = await Club.create({
            C_name: name,
            C_type: type,
            C_intro: intro,
            C_quota: quota
        });

        res.json({
            success: true,
            message: '社團創建成功',
            club: club
        });
    } catch (error) {
        console.error('Error in createClub:', error);
        res.status(500).json({
            success: false,
            message: '社團創建失敗'
        });
    }
};

// 申請加入社團
exports.applyClub = async (req, res) => {
    try {
        const { clubId } = req.body;
        const memberId = req.user.M_id;  // 從 JWT 中獲取用戶 ID

        // 檢查是否已經是社團成員
        const existingMembership = await Club_member.findOne({
            where: {
                M_id: memberId,
                C_id: clubId
            }
        });

        if (existingMembership) {
            return res.status(400).json({
                success: false,
                message: '你已經是該社團的成員'
            });
        }

        // 檢查社團名額
        const club = await Club.findByPk(clubId);
        const memberCount = await Club_member.count({
            where: { C_id: clubId }
        });

        if (memberCount >= club.C_quota) {
            return res.status(400).json({
                success: false,
                message: '該社團已達到人數上限'
            });
        }

        // 創建社團成員記錄
        await Club_member.create({
            M_id: memberId,
            C_id: clubId,
            CM_position: 'member',  // 預設為普通成員
            CM_status: 'active'
        });

        res.json({
            success: true,
            message: '成功加入社團'
        });
    } catch (error) {
        console.error('Error in applyClub:', error);
        res.status(500).json({
            success: false,
            message: '申請加入社團失敗'
        });
    }
};



exports.addClub_member = (req,res) => {
    const {userId,clubId,permission} = req.body

    Club_member.create({
        C_id:clubId,
        M_id:userId,
        Cme_job:permission
    }).
    then(job => {
        res.send(job);
    }).
    catch(e=>{
        res.send(e);
    });
}


exports.getPermissions = (req,res)=>{
    Club_member.findAll({
        include:[{
            attributes:['C_name'],
            model:Club,
        },
        {
            attributes:['M_name'],
            model:Member,
        }],
        where:{M_id:req.body.userId}
        
    }).then(clubPermissions=>{
        res.send(clubPermissions);
    }).catch(e=>{
        res.send(e)
    });
}

exports.getMeetings = (req,res) =>{
    try{
        getClubMember().then(club_member=>{
            getmeetings().
            then((meetings)=>{
                res.render('meetings/index',{
                    meetings:meetings,
                    members:club_member,
                    success:null,
                    error:null
                });
            });
        });
    }catch(e){
        res.send(e);
    }

}

exports.createMeeting = (req,res) =>{
    const {name,content,location,userId,clubId} = req.body;
    try {
        const meet = createMeeting(name,content,location,userId,clubId);
        res.flash('error',false);
        res.flash('success','新增會議成功');
        console.log(meet);
        res.redirect('..');
    } catch (error) {
        console.log(error);
        res.flash('error','新增失敗，請稍後再試');
        res.flash('success',false);
    }
    

}

exports.getEquipments = (req,res)=>{
    try{
        getClubMember().then(club_member=>{
            getEquipment().then(equipments=>{
                res.render('equipments/index',{
                    equipments:equipments,
                    members:club_member,
                    success:null,
                    error:null
                })
            });
        });
    }catch{

    }
}

async function getmeetings(clubId=null){
    try{ 
        const meetings = await Club_meeting.findAll({
            attributes:['Cm_name','Cm_content','Cm_location'],
            include:[{
                model:Club,
                attributes:['C_name']
            },{
                model:Member,
                attributes:['M_name']
            }],
            nest:true,
            raw:true
    });
        return meetings;
    }catch(e){
        console.log(`Get Error : '${e}'`);
    }
};

async function createmeeting(name,content,location,userId,clubId,date){
    const meeting = await Club_meeting.create({
        Cm_name:name,
        Cm_chair:userId,
        Cm_content:content,
        Cm_location:location,
        Cm_date_at:date,
        C_id:clubId
    });

    return meeting;

};


async function getEquipment(clubId=null){
    const equipents = await Club__equipment.findAll({
        include:[{
            model:Club,
            attributes:['C_name']
        },{
            model:Member,
            attributes:['M_name']
        }],
        nest:true,
        raw:true
    });

    return equipents;
}

async function getClubMember(){
    const club_member = await Club_member.findAll({
        attributes:['M_id','Cme_job'],
        include:[{
            model:Member,
            attributes:['M_name']
        },{
            model:Club,
            attributes:['C_name']
        }],
        nest:true,
        raw:true
    });
    return club_member;
}