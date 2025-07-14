const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middleware/auth');

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// View routes - Chỉ cho phép truy cập khi chưa đăng nhập
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('user/login', { layout: false });
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('user/register', { layout: 'auth-layout' });
});

router.get('/forgot-password', isNotAuthenticated, (req, res) => {
    res.render('auth/forgot-password', { layout: 'auth-layout' });
});

router.get('/reset-password', isNotAuthenticated, (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.redirect('/auth/login');
    }
    res.render('auth/reset-password', { layout: 'auth-layout' });
});

// API routes
router.post('/register', isNotAuthenticated, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                error: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Email không hợp lệ'
            });
        }

        // Validate phone format if provided
        if (phone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    error: 'Số điện thoại không hợp lệ'
                });
            }
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // Kiểm tra email đã tồn tại
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (userExists[0].length > 0) {
            return res.status(400).json({
                error: 'Email đã được sử dụng'
            });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Thêm user mới
        const [newUser] = await pool.query(
            'INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, phone || null, hashedPassword]
        );

        // Tạo session
        req.session.userId = newUser.insertId;

        res.status(201).json({
            message: 'Đăng ký thành công',
            redirectUrl: '/dashboard'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
        });
    }
});

// Sử dụng controller cho đăng nhập và đăng xuất
router.post('/login', isNotAuthenticated, authController.login);
router.post('/logout', authController.logout);

// Quên mật khẩu
router.post('/forgot-password', isNotAuthenticated, async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra email tồn tại
        const [result] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (result.length === 0) {
            return res.status(404).json({ error: 'Email không tồn tại trong hệ thống' });
        }

        // Tạo token reset password
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // Token hết hạn sau 1 giờ

        // Lưu token vào database
        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
            [resetToken, resetTokenExpiry, email]
        );

        // Gửi email
        const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Đặt lại mật khẩu - CareerTest',
            html: `
                <h1>Yêu cầu đặt lại mật khẩu</h1>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Link này sẽ hết hạn sau 1 giờ.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Đã gửi email hướng dẫn đặt lại mật khẩu' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã có lỗi xảy ra, vui lòng thử lại sau' });
    }
});

module.exports = router; 