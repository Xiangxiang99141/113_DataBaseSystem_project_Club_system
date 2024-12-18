const { Club, Club_member } = require('../db/models');
const { Op } = require('sequelize');

// 獲取所有社團
exports.getClubs = async ()=>{
    // try {
        const clubs = await Club.findAll({
            attributes: ['C_id', 'C_name', 'C_type', 'C_intro', 'C_quota'],
            raw: true
        });
    // }

        // 如果用戶已登入，檢查其社團成員身份
        // if (req.userId) {
        //     const memberships = await Club_member.findAll({
        //         where: {
        //             M_id: req.userId
        //         },
        //         attributes: ['C_id'],
        //         raw: true
        //     });

        //     const memberClubIds = memberships.map(m => m.C_id);

        //     // 為每個社團添加會員狀態
        //     clubs.forEach(club => {
        //         club.isMember = memberClubIds.includes(club.C_id);
        //     });
        // }

        // 如果是 API 請求
        // if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        //     return res.json({
        //         success: true,
        //         clubs: clubs,
        //         user: req.user || null
        //     });
        // }

        // 渲染首頁
        // res.render('index', {
        //     clubs: clubs,
        //     user: req.user || null,
        //     error: null,
        //     success: null
        // });

    // } catch (error) {
    //     console.error('Error in getClubs:', error);
        
    //     // 如果是 API 請求
    //     if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    //         return res.status(500).json({
    //             success: false,
    //             message: '獲取社團列表失敗'
    //         });
    //     }

    //     // 渲染首頁並顯示錯誤
    //     res.render('index', {
    //         clubs: [],
    //         user: req.user || null,
    //         error: '獲取社團列表失敗',
    //         success: null
    //     });
    // }
}

// 創建社團
exports.createClub = async (req, res) => {
    try {
        const { name, type, introduction, quota } = req.body;
        
        const club = await Club.create({
            C_name: name,
            C_type: type,
            C_introduction: introduction,
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

// 創建社團
exports.createClub = (req, res) => {
    const { name, type, intro, web, quota } = req.body;

    Club.create({
        C_name: name,
        C_type: type,
        C_intro: intro,
        C_web: web,
        C_quota: quota
    }).
    then(club => {
        res.send({
            status: 200,
            create: "創建社團成功",
            club: club
        })
    }).
    catch(e => {
        res.send(e);
    });
};

exports.getclubs = (req, res) => {
    Club.findAll().
    then(clubs => {
        res.send(clubs);
    }).
    catch(e => {
        res.send(e);
    })
}