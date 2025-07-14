const { pool } = require('../config/db');

const cauTraLoiController = {
    // Hiển thị form tạo câu trả lời mới
    showCreateForm: async (req, res) => {
        try {
            // Lấy danh sách câu hỏi từ database
            const [cauHois] = await pool.query(`
                SELECT ma_cau_hoi as id, noi_dung
                FROM cau_hoi
                WHERE trang_thai = 1
                ORDER BY ngay_cap_nhat DESC
            `);
            
            console.log('SQL Query Result:', cauHois);
            console.log('Number of questions:', cauHois.length);
            console.log('First question:', cauHois[0]);
            
            res.render('admin/cau-tra-loi/create', {
                cauHois
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', {
                message: 'Có lỗi xảy ra khi tải trang'
            });
        }
    },

    // Xử lý tạo câu trả lời mới
    create: async (req, res) => {
        try {
            const { cauHoiId, answers } = req.body;
            
            // Kiểm tra dữ liệu đầu vào
            if (!cauHoiId) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn câu hỏi'
                });
            }

            if (!answers || !Array.isArray(answers) || answers.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng thêm ít nhất một câu trả lời'
                });
            }

            // Kiểm tra từng câu trả lời
            for (let i = 0; i < answers.length; i++) {
                const answer = answers[i];
                if (!answer.noiDung || !answer.diem) {
                    return res.status(400).json({
                        success: false,
                        message: `Vui lòng điền đầy đủ thông tin cho câu trả lời #${i + 1}`
                    });
                }
            }

            const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            // Thêm các câu trả lời vào database
            for (const answer of answers) {
                await pool.query(
                    'INSERT INTO cau_tra_loi (ma_cau_tra_loi, ma_cau_hoi, noi_dung, diem, ghi_chu, ngay_cap_nhat) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        `CTL${Date.now()}`,
                        cauHoiId,
                        answer.noiDung,
                        answer.diem,
                        answer.ghiChu || null,
                        currentTime
                    ]
                );
            }

            res.redirect('/admin/cau-tra-loi');
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', {
                message: 'Có lỗi xảy ra khi thêm câu trả lời'
            });
        }
    }
};

module.exports = cauTraLoiController; 