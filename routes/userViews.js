const express = require('express');
const router = express.Router();

// Trang đổi mật khẩu
router.get('/change-password', (req, res) => {
    res.render('reset-password');
});

module.exports = router; 