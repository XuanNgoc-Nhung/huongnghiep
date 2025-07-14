const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const authController = {
    // Hàm đăng nhập
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Vui lòng điền đầy đủ email và mật khẩu'
                });
            }

            // Tìm user trong database
            const [users] = await pool.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    error: 'Email hoặc mật khẩu không đúng'
                });
            }

            const user = users[0];

            // Kiểm tra mật khẩu
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    error: 'Email hoặc mật khẩu không đúng'
                });
            }

            // Trả về thông tin user (trừ password)
            const { password: _, ...userWithoutPassword } = user;

            // Tạo session
            req.session.userId = user.id;
            req.session.userRole = user.role;
            req.session.user = userWithoutPassword;

            console.log('User login status:', {
                isLoggedIn: true,
                userId: user.id,
                userRole: user.role,
                userInfo: userWithoutPassword
            });

            res.json({
                message: 'Đăng nhập thành công',
                user: userWithoutPassword,
                redirectUrl: '/'
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
            });
        }
    },

    // Hàm đăng xuất
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({
                    error: 'Đã có lỗi xảy ra khi đăng xuất'
                });
            }
            res.json({
                message: 'Đăng xuất thành công',
                redirectUrl: '/login'
            });
        });
    }
};

module.exports = authController; 