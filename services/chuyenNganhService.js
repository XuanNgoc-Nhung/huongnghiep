const db = require('../config/database');

class ChuyenNganhService {
    async getAllChuyenNganh() {
        try {
            // First get all chuyen nganh
            const [chuyenNganhs] = await db.query('SELECT * FROM nhom_nganh where parent_id is not null');
            // For each chuyen nganh, get the corresponding nganh names and maNganhCha
            const result = await Promise.all(chuyenNganhs.map(async (cn) => {
                let maNganhs = [];
                try {
                    // Try to parse as JSON first
                    maNganhs = JSON.parse(cn.ma_nganh || '[]');
                } catch (e) {
                    // If not JSON, treat as single value
                    maNganhs = cn.parent_id ? [cn.parent_id] : [];
                }
                
                let tenNganh = '';
                if (maNganhs.length > 0) {
                    const [nganhs] = await db.query(
                        'SELECT ten_nhom_nganh FROM nhom_nganh WHERE id IN (?)',
                        [maNganhs]
                    );
                    tenNganh = nganhs.map(n => n.ten_nhom_nganh).join(', ');
                }

                // Lấy thông tin ngành cha
                let maNganhCha = null;
                if (cn.parent_id) {
                    const [nganhChaRows] = await db.query(
                        'SELECT * FROM nhom_nganh WHERE id = ?',
                        [cn.parent_id]
                    );
                    if (nganhChaRows && nganhChaRows.length > 0) {
                        maNganhCha = nganhChaRows[0];
                    }
                }
                
                return {
                    ...cn,
                    tenNganh,
                    maNganhCha
                };
            }));
            
            return result;
        } catch (error) {
            console.error('Error in getAllChuyenNganh:', error);
            throw error;
        }
    }

    async getChuyenNganhById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM nhom_nganh WHERE id = ?', [id]);
            if (rows[0]) {
                return rows[0];
            }
            return null;
        } catch (error) {
            console.error('Error in getChuyenNganhById:', error);
            throw error;
        }
    }

    async createChuyenNganh(data) {
        try {
            const { parent_id, maChuyenNganh, ten, moTa } = data;
            // Kiểm tra ma_nganh đã tồn tại chưa
            const [existRows] = await db.query(
                'SELECT id FROM nhom_nganh WHERE ma_nganh = ?',
                [maChuyenNganh]
            );
            if (existRows && existRows.length > 0) {
                const error = new Error('Mã chuyên ngành đã tồn tại');
                error.code = 'CHUYEN_NGANH_EXISTS';
                throw error;
            }
            const [result] = await db.query(
                'INSERT INTO nhom_nganh (parent_id, ma_nganh, ten_nhom_nganh, mo_ta) VALUES (?, ?, ?, ?)',
                [parent_id, maChuyenNganh, ten, moTa]
            );
            return { insertId: result.insertId };
        } catch (error) {
            throw error;
        }
    }

    async updateChuyenNganh(id, data) {
        try {
            const { ten, parent_id, moTa } = data;
            const [result] = await db.query(
                'UPDATE nhom_nganh SET ten_nhom_nganh = ?, parent_id = ?, mo_ta = ? WHERE id = ?',
                [ten, parent_id, moTa, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in updateChuyenNganh:', error);
            throw error;
        }
    }

    async deleteChuyenNganh(id) {
        try {
            const [result] = await db.query('DELETE FROM nhom_nganh WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in deleteChuyenNganh:', error);
            throw error;
        }
    }

    async countChuyenNganh() {
        try {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM nganh_hoc');
            return rows[0].count;
        } catch (error) {
            console.error('Error in countChuyenNganh:', error);
            throw error;
        }
    }
}

module.exports = new ChuyenNganhService(); 