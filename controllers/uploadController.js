const { Club_announcement, Club_history} = require('../db/models');

exports.Upload_announcement = async (req, res) => {
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


exports.Upload_history = async (req,res)=>{
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