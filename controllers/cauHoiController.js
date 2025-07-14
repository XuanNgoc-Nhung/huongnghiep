const { pool } = require('../config/db');

const cauHoiController = {
    // Hiển thị danh sách câu hỏi
    index: async (req, res) => {
        try {
            // Lấy danh sách câu hỏi từ database
            const [cauHois] = await pool.query(`
                SELECT ch.*, GROUP_CONCAT(cn.ten_chuyen_nganh) as ten_chuyen_nganh
                FROM cau_hoi ch
                LEFT JOIN chuyen_nganh cn ON FIND_IN_SET(cn.ma_chuyen_nganh, REPLACE(REPLACE(ch.ma_chuyen_nganh, '[', ''), ']', ''))
                GROUP BY ch.ma_cau_hoi
                ORDER BY ch.ngay_cap_nhat DESC
            `);

            // Format lại dữ liệu để hiển thị
            const formattedCauHois = cauHois.map(cauHoi => ({
                ...cauHoi,
                ma_chuyen_nganh: JSON.parse(cauHoi.ma_chuyen_nganh),
                tags: cauHoi.tags ? JSON.parse(cauHoi.tags) : [],
                ten_chuyen_nganh: cauHoi.ten_chuyen_nganh ? cauHoi.ten_chuyen_nganh.split(',') : [],
                trang_thai: cauHoi.trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'
            }));

            console.log('Danh sách câu hỏi:', formattedCauHois); // Thêm log để kiểm tra

            res.render('admin/cau-hoi/index', {
                cauHois: formattedCauHois
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', {
                message: 'Có lỗi xảy ra khi tải danh sách câu hỏi'
            });
        }
    },

    // Hiển thị form tạo câu hỏi mới
    showCreateForm: async (req, res) => {
        try {
            // Lấy danh sách chuyên ngành
            const [chuyenNganhs] = await pool.query('SELECT * FROM chuyen_nganh');
            
            res.render('admin/cau-hoi/create', {
                chuyenNganhs
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', {
                message: 'Có lỗi xảy ra khi tải trang'
            });
        }
    },

    // Xử lý tạo câu hỏi mới
    create: async (req, res) => {
        try {
            const { noi_dung, cap_do, ma_chuyen_nganh, tags, trang_thai } = req.body;
            
            // Kiểm tra dữ liệu đầu vào
            const missingFields = [];
            if (!noi_dung) missingFields.push('Nội dung câu hỏi');
            if (!cap_do) missingFields.push('Cấp độ');
            if (!ma_chuyen_nganh || !Array.isArray(ma_chuyen_nganh) || ma_chuyen_nganh.length === 0) {
                missingFields.push('Chuyên ngành');
            }

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`
                });
            }

            const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            // Thêm câu hỏi vào database
            const [result] = await pool.query(
                'INSERT INTO cau_hoi (ma_cau_hoi, noi_dung, cap_do, ma_chuyen_nganh, tags, trang_thai, ngay_cap_nhat) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    `CH${Date.now()}`,
                    noi_dung,
                    cap_do,
                    JSON.stringify(ma_chuyen_nganh),
                    tags ? JSON.stringify(tags) : null,
                    trang_thai ? 1 : 0,
                    currentTime
                ]
            );

            res.json({
                success: true,
                message: 'Thêm câu hỏi thành công'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi thêm câu hỏi'
            });
        }
    }
};

module.exports = cauHoiController; 