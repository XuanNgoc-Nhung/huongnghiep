const db = require('../config/database');

class ChuyenNganhService {
    async getAllChuyenNganh() {
        try {
            // First get all chuyen nganh
            const [chuyenNganhs] = await db.query('SELECT ma_chuyen_nganh, ten_chuyen_nganh, ma_nganh, mo_ta FROM chuyen_nganh');
            
            // For each chuyen nganh, get the corresponding nganh names
            const result = await Promise.all(chuyenNganhs.map(async (cn) => {
                let maNganhs = [];
                try {
                    // Try to parse as JSON first
                    maNganhs = JSON.parse(cn.ma_nganh || '[]');
                } catch (e) {
                    // If not JSON, treat as single value
                    maNganhs = cn.ma_nganh ? [cn.ma_nganh] : [];
                }
                
                let tenNganh = '';
                if (maNganhs.length > 0) {
                    const [nganhs] = await db.query(
                        'SELECT ten_nganh FROM nganh WHERE ma_nganh IN (?)',
                        [maNganhs]
                    );
                    tenNganh = nganhs.map(n => n.ten_nganh).join(', ');
                }
                
                return {
                    ...cn,
                    id: cn.ma_chuyen_nganh,
                    tenNganh
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
            const [rows] = await db.query('SELECT * FROM chuyen_nganh WHERE ma_chuyen_nganh = ?', [id]);
            if (rows[0]) {
                let maNganhs = [];
                try {
                    // Try to parse as JSON first
                    maNganhs = JSON.parse(rows[0].ma_nganh || '[]');
                } catch (e) {
                    // If not JSON, treat as single value
                    maNganhs = rows[0].ma_nganh ? [rows[0].ma_nganh] : [];
                }
                
                return {
                    ...rows[0],
                    ma_nganh: maNganhs
                };
            }
            return null;
        } catch (error) {
            console.error('Error in getChuyenNganhById:', error);
            throw error;
        }
    }

    async createChuyenNganh(data) {
        try {
            const { maChuyenNganh, ten, nganhs, moTa } = data;
            
            // Convert nganhs array to JSON string
            const nganhsJson = JSON.stringify(nganhs || []);
            
            const [result] = await db.query(
                'INSERT INTO chuyen_nganh (ma_chuyen_nganh, ten_chuyen_nganh, ma_nganh, mo_ta) VALUES (?, ?, ?, ?)',
                [maChuyenNganh, ten, nganhsJson, moTa]
            );
            
            return result.insertId;
        } catch (error) {
            console.error('Error in createChuyenNganh:', error);
            throw error;
        }
    }

    async updateChuyenNganh(id, data) {
        try {
            const { ten, nganhs, moTa } = data;
            
            // Convert nganhs array to JSON string
            const nganhsJson = JSON.stringify(nganhs || []);
            
            const [result] = await db.query(
                'UPDATE chuyen_nganh SET ten_chuyen_nganh = ?, ma_nganh = ?, mo_ta = ? WHERE ma_chuyen_nganh = ?',
                [ten, nganhsJson, moTa, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in updateChuyenNganh:', error);
            throw error;
        }
    }

    async deleteChuyenNganh(id) {
        try {
            const [result] = await db.query('DELETE FROM chuyen_nganh WHERE ma_chuyen_nganh = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in deleteChuyenNganh:', error);
            throw error;
        }
    }

    async countChuyenNganh() {
        try {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM chuyen_nganh');
            return rows[0].count;
        } catch (error) {
            console.error('Error in countChuyenNganh:', error);
            throw error;
        }
    }
}

module.exports = new ChuyenNganhService(); 