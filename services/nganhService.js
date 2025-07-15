const db = require('../config/database');

class NganhService {
    // Lấy danh sách tất cả các ngành
    async getAllNganh() {
        try {
            const [rows] = await db.query('SELECT id as id, ma_nganh as ma_nganh, ten_nhom_nganh as ten, mo_ta as moTa FROM nhom_nganh where parent_id is null');
            return rows;
        } catch (error) {
            throw error;
        }
    }
    async getChuyenNganhCha() {
        try {
            const [rows] = await db.query('SELECT id as id, ma_nganh as ma_nganh, ten_nhom_nganh as ten, mo_ta as moTa FROM nhom_nganh where parent_id is null');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin một ngành theo ID
    async getNganhById(id) {
        try {
            const [rows] = await db.query('SELECT id as id, ma_nganh as ma_nganh, ten_nhom_nganh as ten, mo_ta as moTa FROM nhom_nganh WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Thêm ngành mới
    async createNganh(nganhData) {
        try {
            const { parentId = null, maNganh, ten, moTa } = nganhData;
            const [result] = await db.query(
                'INSERT INTO nhom_nganh (parent_id, ma_nganh, ten_nhom_nganh, mo_ta) VALUES (?, ?, ?, ?)',
                [parentId, maNganh, ten, moTa]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật thông tin ngành
    async updateNganh(id, nganhData) {
        try {
            const { ten, moTa } = nganhData;
            const [result] = await db.query(
                'UPDATE nhom_nganh SET ten_nhom_nganh = ?, mo_ta = ? WHERE id = ?',
                [ten, moTa, id]
            );
            
            if (result.affectedRows > 0) {
                // Lấy thông tin ngành sau khi cập nhật
                const [updatedNganh] = await db.query(
                    'SELECT id as id, ma_nganh as ma_nganh, ten_nhom_nganh as ten, mo_ta as moTa FROM nhom_nganh WHERE id = ?',
                    [id]
                );
                return updatedNganh[0];
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Xóa ngành
    async deleteNganh(id) {
        try {
            // 1. Lấy danh sách mã chuyên ngành thuộc ngành này
            const [chuyenNganhs] = await db.query('SELECT id FROM nhom_nganh WHERE id = ?', [id]);
            if (chuyenNganhs.length > 0) {
                // 2. Kiểm tra có câu hỏi nào thuộc các chuyên ngành này không
                const maChuyenNganhList = chuyenNganhs.map(row => row.id);
                const placeholders = maChuyenNganhList.map(() => '?').join(',');
                const [cauHois] = await db.query(
                    `SELECT id, cau_hoi FROM cau_hoi WHERE nhom_nganh_id IN (${placeholders})`,
                    maChuyenNganhList
                );
                if (cauHois.length > 0) {
                    // Có câu hỏi thuộc chuyên ngành này
                    const error = new Error('Không thể xóa ngành vì vẫn còn câu hỏi thuộc các chuyên ngành của ngành này.');
                    error.code = 'NGANH_HAS_CAU_HOI';
                    error.cauHois = cauHois; // Thêm thông tin chi tiết các câu hỏi
                    throw error;
                } else {
                    // 3. Nếu không còn chuyên ngành, xóa ngành
                    const [result] = await db.query('DELETE FROM nhom_nganh WHERE id = ?', [id]);
                    return result.affectedRows > 0;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    // Đếm số lượng ngành
    async countNganh() {
        try {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM nganh_hoc');
            return rows[0].count;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách ngành với lọc và phân trang
    async getNganhWithFilter(page = 1, limit = 10, search = '') {
        try {
            const offset = (page - 1) * limit;
            let query = 'SELECT id as id, ma_nganh as ma_nganh, ten_nhom_nganh as ten, mo_ta as moTa FROM nhom_nganh where parent_id is null';
            let countQuery = 'SELECT COUNT(*) as count FROM nhom_nganh';
            const params = [];
            const countParams = [];

            if (search) {
                query += ' WHERE ten_nhom_nganh LIKE ? OR ten_nhom_nganh LIKE ?';
                countQuery += ' WHERE ten_nhom_nganh LIKE ? OR ten_nhom_nganh LIKE ?';
                params.push(`%${search}%`, `%${search}%`);
                countParams.push(`%${search}%`, `%${search}%`);
            }

            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const [rows, countRows] = await Promise.all([
                db.query(query, params),
                db.query(countQuery, countParams)
            ]);

            return {
                nganhs: rows[0],
                total: countRows[0][0].count,
                currentPage: page,
                totalPages: Math.ceil(countRows[0][0].count / limit)
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new NganhService(); 