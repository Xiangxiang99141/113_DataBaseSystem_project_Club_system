const {v4:uuidv4} = require('uuid');

class IndexModel{
    constructor(){
        this.clubs = [
            {
                name:'吉他社',
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