const db = require('../config/database');

class NganhService {
    // Lấy danh sách tất cả các ngành
    async getAllNganh() {
        try {
            const [rows] = await db.query('SELECT ma_nganh as id, ten_nganh as ten, mo_ta as moTa FROM nganh');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin một ngành theo ID
    async getNganhById(id) {
        try {
            const [rows] = await db.query('SELECT ma_nganh as id, ten_nganh as ten, mo_ta as moTa FROM nganh WHERE ma_nganh = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Thêm ngành mới
    async createNganh(nganhData) {
        try {
            const { maNganh, ten, moTa } = nganhData;
            const [result] = await db.query(
                'INSERT INTO nganh (ma_nganh, ten_nganh, mo_ta) VALUES (?, ?, ?)',
                [maNganh, ten, moTa]
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
                'UPDATE nganh SET ten_nganh = ?, mo_ta = ? WHERE ma_nganh = ?',
                [ten, moTa, id]
            );
            
            if (result.affectedRows > 0) {
                // Lấy thông tin ngành sau khi cập nhật
                const [updatedNganh] = await db.query(
                    'SELECT ma_nganh as id, ten_nganh as ten, mo_ta as moTa FROM nganh WHERE ma_nganh = ?',
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
            const [result] = await db.query('DELETE FROM nganh WHERE ma_nganh = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Đếm số lượng ngành
    async countNganh() {
        try {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM nganh');
            return rows[0].count;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách ngành với lọc và phân trang
    async getNganhWithFilter(page = 1, limit = 10, search = '') {
        try {
            const offset = (page - 1) * limit;
            let query = 'SELECT ma_nganh as id, ten_nganh as ten, mo_ta as moTa FROM nganh';
            let countQuery = 'SELECT COUNT(*) as count FROM nganh';
            const params = [];
            const countParams = [];

            if (search) {
                query += ' WHERE ma_nganh LIKE ? OR ten_nganh LIKE ?';
                countQuery += ' WHERE ma_nganh LIKE ? OR ten_nganh LIKE ?';
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