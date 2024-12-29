const express = require('express');
const ejs = require('ejs'); /*導入ejs*/
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
require('dotenv').config()


//Routes
const indexRouter = require('./routes/indexRouter');
const memberRouter = require('./routes/memberRouter')
const clubRouter = require('./routes/clubRouter');
const manageRouter = require('./routes/manageRouter');
const apiRouter = require('./routes/ApiRouter');

/*設定 view engine 為 ejs*/
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));


//解析JSON跟URL編碼，需在路由前設定
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//導入static檔案 ex:css,js,img
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'/public')));
// app.use('/css',express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')));
// app.use('/js',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')));
app.use('/css',express.static(path.join(__dirname,'public/bootstrap/css')));
app.use('/js',express.static(path.join(__dirname,'public/bootstrap/js')));
app.use('/js',express.static(path.join(__dirname,'node_modules/jquery/dist')));
app.use('/js',express.static(path.join(__dirname,'public/script')));


// 設置 session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 小時
    }
}));


// 設置 flash 消息
app.use(flash());


// 全局中間件，設置 flash 消息到 res.locals
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


//設定路由
app.use('/',indexRouter);
app.use('/user',memberRouter);
app.use('/club',clubRouter);
app.use('/manage',manageRouter);

//API路由
app.use('/api',apiRouter);

app.listen('3000',()=>{
    console.log(">> Server is Start on 3000 <<");
});