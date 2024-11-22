const express = require('express');
const ejs = require('ejs'); /*導入ejs*/
const app = express();

/*設定 view engine 為 ejs*/
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    /*渲染畫面  並將後面參數傳置檔案*/
    res.render('index', {
        game: 'Final Fantasy VII',
        category: '<p><b>Characters:</b></p>',
        characters: ['Cloud', 'Aerith', 'Tifa', 'Barret']
    });
});


app.listen('3000',()=>{
    console.log(">> Server is Start on 3000 <<")
});