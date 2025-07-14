const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
require('dotenv').config();
const db = require('./config/database');
const { dbStatus } = require('./config/db');
const { isAuthenticated, authMiddleware, logAuthStatus, isNotAuthenticated } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const careerRoutes = require('./routes/career');
const userRoutes = require('./routes/user');
const userViewRoutes = require('./routes/userViews');
const assessmentRoutes = require('./routes/assessment');
const adminRoutes = require('./routes/admin');
const tracNghiemRouter = require('./routes/user/trac-nghiem');

const app = express();

// Set view engine
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main-layout',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: [
        path.join(__dirname, 'views', 'partials'),
        path.join(__dirname, 'views', 'user', 'trac-nghiem'),
        path.join(__dirname, 'views', 'layouts')
    ],
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        },
        eq: function(v1, v2) {
            return v1 === v2;
        },
        currentYear: function() {
            return new Date().getFullYear();
        },
        gt: function (a, b) {
            return a > b;
        },
        lt: function (a, b) {
            return a < b;
        },
        add: function (a, b) {
            return a + b;
        },
        subtract: function (a, b) {
            return a - b;
        },
        multiply: function (a, b) {
            return a * b;
        },
        times: function (n, block) {
            let accum = '';
            for (let i = 1; i <= n; ++i) {
                accum += block.fn(i);
            }
            return accum;
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages configuration
app.use(flash());

// Log authentication status for all requests (after session initialization)
app.use(logAuthStatus);

// Auth middleware
app.use(authMiddleware);

// Truyền trạng thái database và thông tin đăng nhập vào tất cả các view
app.use((req, res, next) => {
    res.locals.dbStatus = dbStatus;
    res.locals.user = req.session.user || null;
    res.locals.isLoggedIn = req.session.userId ? true : false;
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    next();
});

// Auth routes - Không cần authentication và sử dụng auth-layout
app.use('/auth', (req, res, next) => {
    res.locals.layout = 'auth-layout';
    next();
}, authRoutes);

app.use('/api/auth', isNotAuthenticated, authRoutes);

// API routes - Yêu cầu authentication
app.use('/api/users', isAuthenticated, userRoutes);
app.use('/api/assessments', assessmentRoutes);

// Main routes - Yêu cầu authentication và sử dụng main-layout
app.use((req, res, next) => {
    res.locals.layout = 'main-layout';
    next();
});

// Main route - Yêu cầu authentication
app.get('/', isAuthenticated, (req, res) => {
    res.render('user/index', { layout: 'main-layout' });
});

// Trac-nghiem routes - Yêu cầu authentication và sử dụng main-layout
app.use('/trac-nghiem', isAuthenticated, (req, res, next) => {
    res.locals.layout = 'main-layout';
    next();
}, tracNghiemRouter);

// Password change success page - Yêu cầu authentication
app.get('/password-change-success', isAuthenticated, (req, res) => {
    res.render('password-change-success');
});

// Admin routes - Yêu cầu authentication và sử dụng admin-layout
app.use('/admin', (req, res, next) => {
    res.locals.layout = 'admin-layout';
    next();
}, adminRoutes);

// 404 handler - Đặt sau tất cả các routes khác
app.use((req, res) => {
    res.status(404).render('404', {
        message: 'Trang bạn đang tìm kiếm không tồn tại',
        url: req.url
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Đã có lỗi xảy ra!',
        error: err
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Hệ thống được khởi chạy trên đường dẫn: http://localhost:${PORT}`);
}); 