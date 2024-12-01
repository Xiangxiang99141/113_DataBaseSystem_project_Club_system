const express = require('express');
const ejs = require('ejs'); /*導入ejs*/
// const bodyParser = require('body-parser'); // 導入Body-Parser
const path = require('path');
const app = express();


//Routes
const indexRouter = require('./routes/indexRouter');

/*設定 view engine 為 ejs*/
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));

//解析JSON跟URL編碼，需在路由前設定
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//導入static檔案 ex:css,js,img
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'/public')));
app.use('/css',express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')));
app.use('/js',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')));
app.use('/js',express.static(path.join(__dirname,'node_modules/jquery/dist')));

//設定路由
app.use('/',indexRouter);

//製作API路由
// app.use('/api');

app.listen('3000',()=>{
    console.log(">> Server is Start on 3000 <<")
});