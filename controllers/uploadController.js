const { Club_announcement, Club_history,Club_equipment} = require('../db/models');

//新增公告
exports.uploadAnnouncement = async (req, res) => {
    try {
        const announcement = await Club_announcement.create({
            Can_type: req.body.type,
            Can_title: req.body.title,
            Can_content: req.body.content,
            Can_attachment: req.files?.attachment ? `/uploads/announcement/${req.files.attachment[0].filename}` : null,
            Can_image: req.files?.image ? `/uploads/announcement/${req.files.image[0].filename}` : null,
            Can_created_at: new Date(),
            C_id: req.params.id,
        });

        res.json({
            success: true,
            message: '公告發布成功',
            data: announcement
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '公告發布失敗'
        });
    }
}

//新增歷史資料
exports.uploadHistory = async (req,res)=>{
    try{
        let path = req.file ? `/uploads/histories/${req.file.filename}` : null;
        console.log(path)
        const history = await Club_history.create({
            Ch_type:req.body.type,
            Ch_name:req.body.name,
            Ch_description:req.body.description,
            Ch_update_at:new Date(req.body.date),
            Ch_attachment:req.file ? `/uploads/histories/${req.file.filename}` : null,
            C_id:req.params.id,
        });
        res.json({
            success: true,
            message: '資料新增成功',
            data: history
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '資料新增失敗'
        });
    }
};

exports.uploadEquipent = async (req, res) => {
    try {
        const { name, quantity, spec, use, source, admin, date ,report} = req.body;
        
        if (!name || !quantity || !spec || !use || !source || !admin || !report) {
            return res.status(400).json({
                success: false,
                message: '所有欄位都是必填的'
            });
        }

        const equipment = await Club_equipment.create({
            Ce_name: name,
            Ce_count: quantity,
            Ce_spec: spec,
            Ce_use: use,
            Ce_source: source,
            Ce_img: req.file ? `/uploads/equipments/${req.file.filename}` : null,
            Ce_admin: admin,
            Ce_report: report,
            Ce_purch_at: date ? new Date(date) : new Date(),
            C_id: req.params.id
        });

        res.json({
            success: true,
            message: '器材新增成功',
            data: equipment
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '新增器材時發生錯誤'
        });
    }
}