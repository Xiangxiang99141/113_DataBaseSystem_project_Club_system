const {v4:uuidv4} = require('uuid');

class IndexModel{
    constructor(){
        this.clubs = [
            {
                name:'吉他社',
                intro:'音樂愛好者的交流天地',
                web:'#',
                amount:50,
                id:uuidv4()
            },
            {
                name:'攝影社',
                intro:'攝影愛好者的交流平台',
                web:'#',
                amount:30,
                id:uuidv4()
            }
        ];
    }

    //取得全部
    getAll(){
        return this.clubs;
    }

    //新增資料
    create(club){
        const {name} = club;
        const newClub = {
            name:name,
            id:uuidv4()
        }
        this.clubs.push(newClub);
        return newClub;
    }
}

module.exports = new IndexModel();