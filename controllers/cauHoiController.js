const { pool } = require('../config/db');
const { LOAI_CAU_HOI } = require('../constants');
const cauHoiController = {
    // Hiển thị danh sách câu hỏi
    index: async (req, res) => {
        try {
            // Lấy danh sách câu hỏi từ database
            const [cauHois] = await pool.query(`
                SELECT ch.*, nn.ten_nhom_nganh
                FROM cau_hoi ch
                LEFT JOIN nhom_nganh nn ON ch.nhom_nganh_id = nn.id
                ORDER BY ch.ngay_cap_nhat DESC
            `);

            // Format lại dữ liệu để hiển thị
            const formattedCauHois = cauHois.map(cauHoi => ({
                ...cauHoi,
                nhom_nganh_id: cauHoi.nhom_nganh_id,
                ten_nhom_nganh: cauHoi.ten_nhom_nganh,
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
            const [nganhs] = await pool.query('SELECT * FROM nhom_nganh');
            const loaiCauHois = LOAI_CAU_HOI;
            res.render('admin/cau-hoi/them-moi', {
                nganhs,
                loaiCauHois
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
            const { cau_hoi, loai_cau_hoi, nhom_nganh_id, status } = req.body;
            
            // Kiểm tra dữ liệu đầu vào
            const missingFields = [];
            if (!cau_hoi) missingFields.push('Nội dung câu hỏi');
            if (!loai_cau_hoi) missingFields.push('Loại câu hỏi');
            if (!nhom_nganh_id) missingFields.push('Chuyên ngành');
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`
                });
            }

            const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            //Lấy thông tin người dùng đang đăng nhập từ session
            const user = req.session.user;
            console.log('User:', user);
            // Thêm câu hỏi vào database
            const [result] = await pool.query(
                'INSERT INTO cau_hoi (cau_hoi, loai_cau_hoi, nhom_nganh_id, status, created_at) VALUES (?, ?, ?, ?, ?)',
                [
                    cau_hoi,
                    loai_cau_hoi,
                    nhom_nganh_id,
                    status,
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