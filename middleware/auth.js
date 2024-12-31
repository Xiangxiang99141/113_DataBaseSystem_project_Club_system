const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWTSecret;
const COOKIE_NAME = 'auth_token';

// 生成 JWT token
exports.generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user.M_id,
            Permissions:user.Permissions
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// 設置認證 Cookie
exports.setAuthCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
};

// 清除認證 Cookie
exports.clearAuthCookie = (res) => {
    res.clearCookie(COOKIE_NAME);
};

// 檢查用戶是否已登入（API 路由使用）
exports.isAuthenticated = (req, res, next) => {
    try {
        if(!req.cookies[COOKIE_NAME]){
            console.log('....logout?')
            req.flash('success',false);
            req.flash('error','請先登入');
            res.redirect('/login');
            return;
        }
        const token = req.cookies[COOKIE_NAME];

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({
            success: false,
            message: '認證失敗，請重新登入'
        });
        req.flash('error', '認證失敗，請重新登入');
        res.redirect('/login');
    }
};

// 檢查用戶是否已登入（頁面路由使用）
exports.isAuthenticatedPage = (req, res, next) => {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (!token) {
            req.flash('error', '請先登入');
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        req.flash('error', '認證失敗，請重新登入');
        res.redirect('/login');
    }
};
