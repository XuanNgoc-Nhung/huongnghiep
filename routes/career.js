const express = require('express');
const router = express.Router();

// Lấy danh sách nghề nghiệp
router.get('/', (req, res) => {
    // TODO: Implement get all careers logic
    res.json({ message: 'Get all careers route' });
});

// Lấy thông tin chi tiết một nghề
router.get('/:id', (req, res) => {
    // TODO: Implement get career by id logic
    res.json({ message: 'Get career by id route' });
});

// Tạo nghề nghiệp mới
router.post('/', (req, res) => {
    // TODO: Implement create career logic
    res.json({ message: 'Create career route' });
});

// Cập nhật thông tin nghề nghiệp
router.put('/:id', (req, res) => {
    // TODO: Implement update career logic
    res.json({ message: 'Update career route' });
});

// Xóa nghề nghiệp
router.delete('/:id', (req, res) => {
    // TODO: Implement delete career logic
    res.json({ message: 'Delete career route' });
});

module.exports = router; 