const express = require('express');
const ejs = require('ejs'); /*導入ejs*/
// const bodyParser = require('body-parser'); // 導入Body-Parser
const app = express();

//Routes
const indexRouter = require('./routes/indexRouter')

/*設定 view engine 為 ejs*/
app.set('view engine', 'ejs');

//解析JSON跟URL編碼，需在路由前設定
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//設定路由
app.use('/',indexRouter);

//製作API路由
// app.use('/api');

app.listen('3000',()=>{
    console.log(">> Server is Start on 3000 <<")
});