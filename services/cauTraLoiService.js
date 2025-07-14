const db = require('../config/database');

class CauTraLoiService {
    async getAllCauTraLoi() {
        try {
            const [rows] = await db.query('SELECT * FROM cau_tra_loi');
            return rows;
        } catch (error) {
            console.error('Error in getAllCauTraLoi:', error);
            throw error;
        }
    }

    async getCauTraLoiById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM cau_tra_loi WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error in getCauTraLoiById:', error);
            throw error;
        }
    }

    async createCauTraLoi(data) {
        try {
            const { noiDung, cauHoiId, dungSai } = data;
            const [result] = await db.query(
                'INSERT INTO cau_tra_loi (noiDung, cauHoiId, dungSai) VALUES (?, ?, ?)',
                [noiDung, cauHoiId, dungSai]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in createCauTraLoi:', error);
            throw error;
        }
    }

    async updateCauTraLoi(id, data) {
        try {
            const { noiDung, cauHoiId, dungSai } = data;
            const [result] = await db.query(
                'UPDATE cau_tra_loi SET noiDung = ?, cauHoiId = ?, dungSai = ? WHERE id = ?',
                [noiDung, cauHoiId, dungSai, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in updateCauTraLoi:', error);
            throw error;
        }
    }

    async deleteCauTraLoi(id) {
        try {
            const [result] = await db.query('DELETE FROM cau_tra_loi WHERE ma_cau_tra_loi = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in deleteCauTraLoi:', error);
            throw error;
        }
    }

    async countCauTraLoi() {
        try {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM cau_tra_loi');
            return rows[0].count;
        } catch (error) {
            console.error('Error in countCauTraLoi:', error);
            throw error;
        }
    }
}

module.exports = new CauTraLoiService(); 