const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Lấy danh sách bài đánh giá - không cần đăng nhập
router.get('/', (req, res) => {
    // TODO: Implement get all assessments logic
    res.json({ message: 'Get all assessments route' });
});

// Các routes dưới đây yêu cầu đăng nhập
router.use(isAuthenticated);

// Làm bài đánh giá
router.post('/take', (req, res) => {
    // TODO: Implement take assessment logic
    res.json({ message: 'Take assessment route' });
});

// Xem kết quả đánh giá
router.get('/result/:id', (req, res) => {
    // TODO: Implement get assessment result logic
    res.json({ message: 'Get assessment result route' });
});

module.exports = router; 