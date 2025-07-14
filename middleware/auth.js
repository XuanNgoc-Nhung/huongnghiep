const isAuthenticated = (req, res, next) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (req.session && req.session.userId) {
        // Nếu đã đăng nhập, cho phép tiếp tục
        return next();
    }
    
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    res.redirect('/auth/login');
};

const isNotAuthenticated = (req, res, next) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (req.session && req.session.userId) {
        // Nếu đã đăng nhập, chuyển hướng về trang chủ
        return res.redirect('/');
    }
    
    // Nếu chưa đăng nhập, cho phép tiếp tục
    next();
};

const isAdmin = (req, res, next) => {
    return next();
    // Kiểm tra xem người dùng đã đăng nhập và có quyền admin không
    if (req.session && req.session.userId && req.session.userRole === 'admin') {
        return next();
    }
    
    // Nếu không phải admin, chuyển hướng về trang chủ
    req.flash('error', 'Bạn không có quyền truy cập trang này');
    res.redirect('/');
};

const authMiddleware = (req, res, next) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const isLoggedIn = req.session && req.session.userId;
    
    // Truyền biến isLoggedIn và user vào tất cả các view
    res.locals.isLoggedIn = isLoggedIn;
    if (isLoggedIn) {
        res.locals.user = req.session.user;
    }
    
    next();
};

// Middleware để log trạng thái đăng nhập
const logAuthStatus = (req, res, next) => {
    console.log('Trạng thái đăng nhập:', {
        path: req.path,
        isAuthenticated: !!req.session.userId,
        userId: req.session.userId,
        userRole: req.session.userRole,
        userInfo: req.session.user
    });
    next();
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin,
    authMiddleware,
    logAuthStatus
}; 