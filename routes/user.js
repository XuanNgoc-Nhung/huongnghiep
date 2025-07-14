const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const tracNghiemRouter = require('./user/trac-nghiem');

// Tất cả các routes trong user đều yêu cầu đăng nhập
router.use(isAuthenticated);

// Lấy thông tin người dùng
router.get('/profile', (req, res) => {
    // TODO: Implement get user profile logic
    res.json({ message: 'Get user profile route' });
});

// Cập nhật thông tin người dùng
router.put('/profile', (req, res) => {
    // TODO: Implement update user profile logic
    res.json({ message: 'Update user profile route' });
});

// API đổi mật khẩu
router.put('/change-password', (req, res) => {
    // TODO: Implement change password logic
    res.json({ message: 'Change password route' });
});

// Routes cho phần trắc nghiệm
router.use('/trac-nghiem', tracNghiemRouter);

module.exports = router; 