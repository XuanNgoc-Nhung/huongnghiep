const db = require('../config/database');
const { LOAI_CAU_HOI } = require('../constants');

class CauHoiService {
    async getAllCauHoi() {
        try {
            const [rows] = await db.query('SELECT * FROM cau_hoi');
            return rows;
        } catch (error) {
            console.error('Error in getAllCauHoi:', error);
            throw error;
        }
    }

    async getCauHoiById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM cau_hoi WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error in getCauHoiById:', error);
            throw error;
        }
    }

    async createCauHoi(data) {
        try {
            const { noiDung, loaiCauHoi, doKho } = data;
            const [result] = await db.query(
                'INSERT INTO cau_hoi (noiDung, loaiCauHoi, doKho) VALUES (?, ?, ?)',
                [noiDung, loaiCauHoi, doKho]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in createCauHoi:', error);
            throw error;
        }
    }

    async updateCauHoi(id, data) {
        try {
            const { cau_hoi, loai_cau_hoi, nhom_nganh_id } = data;
            const [result] = await db.query(
                'UPDATE cau_hoi SET cau_hoi = ?, loai_cau_hoi = ?, nhom_nganh_id = ? WHERE id = ?',
                [cau_hoi, loai_cau_hoi, nhom_nganh_id, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in updateCauHoi:', error);
            throw error;
        }
    }

    async deleteCauHoi(id) {
        try {
            // Xóa tất cả câu trả lời liên quan trước
            const [deleteCauTraLoiResult] = await db.query(
                'DELETE FROM cau_tra_loi WHERE id_cau_hoi = ?',
                [id]
            );
            
            // Sau đó xóa câu hỏi
            const [result] = await db.query('DELETE FROM cau_hoi WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {   
            console.error('Error in deleteCauHoi:', error);
            throw error;
        }
    }

    async countCauHoi() {
        try {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM cau_hoi');
            return rows[0].count;
        } catch (error) {
            console.error('Error in countCauHoi:', error);
            throw error;
        }
    }

    async getCauHoiWithFilter(page, limit, search) {
        try {
            const offset = (page - 1) * limit;
            let query = `
                SELECT c.*, nn.ten_nhom_nganh 
                FROM cau_hoi c 
                LEFT JOIN nhom_nganh nn ON c.nhom_nganh_id = nn.id
            `;
            let countQuery = 'SELECT COUNT(*) as total FROM cau_hoi';
            const params = [];

            if (search) {
                query += ' WHERE c.noi_dung LIKE ?';
                countQuery += ' WHERE noi_dung LIKE ?';
                params.push(`%${search}%`);
            }

            query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const [rows, countRows] = await Promise.all([
                db.query(query, params),
                db.query(countQuery, search ? [`%${search}%`] : [])
            ]);

            console.log('Raw questions:', rows[0]);

            // Format lại dữ liệu và lấy tên chuyên ngành
            const formattedQuestions = await Promise.all(rows[0].map(async (cauHoi) => {
                const maChuyenNganhs = JSON.parse(cauHoi.ma_chuyen_nganh || '[]');
                const loaiCauHoi = LOAI_CAU_HOI.find(loai => loai.id === cauHoi.loai_cau_hoi);
                // console.log('Question ID:', cauHoi.ma_cau_hoi);
                // console.log('Ma chuyen nganh:', maChuyenNganhs);
                // console.log('Ten chuyen nganh:', tenChuyenNganhs);

                return {
                    ...cauHoi,
                    loai_cau_hoi: loaiCauHoi.name,
                    trang_thai: cauHoi.trang_thai === 1
                };
            }));

            console.log('Formatted questions:', formattedQuestions);
            console.log('Total count:', countRows[0][0].total);

            return {
                questions: formattedQuestions,
                total: countRows[0][0].total,
                currentPage: page,
                totalPages: Math.ceil(countRows[0][0].total / limit)
            };
        } catch (error) {
            console.error('Error in getCauHoiWithFilter:', error);
            throw error;
        }
    }

    async getCauHoiWithChuyenNganh() {
        try {
            // First get all questions
            const [questions] = await db.query('SELECT * FROM cau_hoi ORDER BY ngay_cap_nhat DESC');
            
            // For each question, get the corresponding chuyen nganh names
            const result = await Promise.all(questions.map(async (cauHoi) => {
                let maChuyenNganhs = [];
                try {
                    // Try to parse as JSON first
                    maChuyenNganhs = JSON.parse(cauHoi.ma_chuyen_nganh || '[]');
                } catch (e) {
                    // If not JSON, treat as single value
                    maChuyenNganhs = cauHoi.ma_chuyen_nganh ? [cauHoi.ma_chuyen_nganh] : [];
                }
                
                let tenChuyenNganh = [];
                if (maChuyenNganhs.length > 0) {
                    const [chuyenNganhs] = await db.query(
                        'SELECT ten_chuyen_nganh FROM chuyen_nganh WHERE ma_chuyen_nganh IN (?)',
                        [maChuyenNganhs]
                    );
                    tenChuyenNganh = chuyenNganhs.map(cn => cn.ten_chuyen_nganh);
                }
                
                return {
                    ...cauHoi,
                    ma_chuyen_nganh: maChuyenNganhs,
                    ten_chuyen_nganh: tenChuyenNganh
                };
            }));
            
            return result;
        } catch (error) {
            console.error('Error in getCauHoiWithChuyenNganh:', error);
            throw error;
        }
    }
}

module.exports = new CauHoiService(); 