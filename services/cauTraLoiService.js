const db = require('../config/database');

class CauTraLoiService {
    async getAllCauTraLoi() {
        try {
            const [rows] = await db.query(`
                SELECT ctl.*, ch.cau_hoi AS cauHoi
                FROM cau_tra_loi ctl
                JOIN cau_hoi ch ON ctl.id_cau_hoi = ch.id
            `);
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
            const { noiDung, cauHoiId, diem } = data;
            const [result] = await db.query(
                'UPDATE cau_tra_loi SET cau_tra_loi = ?, id_cau_hoi = ?, diem = ? WHERE id = ?',
                [noiDung, cauHoiId, diem, id]
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

    async getCauTraLoiGroupByCauHoi() {
        try {
            // Lấy tất cả câu hỏi
            const [questions] = await db.query('SELECT * FROM cau_hoi ORDER BY id');
            // Lấy tất cả câu trả lời
            const [answers] = await db.query('SELECT * FROM cau_tra_loi ORDER BY id_cau_hoi, id');
            // Gộp câu trả lời vào từng câu hỏi
            return questions.map(q => ({
                ...q,
                cauTraLois: answers.filter(a => a.id_cau_hoi === q.id)
            }));
        } catch (error) {
            console.error('Error in getCauTraLoiGroupByCauHoi:', error);
            throw error;
        }
    }

    async getCauTraLoiGroupByCauHoiWithPagination(page = 1, limit = 10, search = '') {
        try {
            const offset = (page - 1) * limit;
            let questionQuery = 'SELECT * FROM cau_hoi';
            let countQuery = 'SELECT COUNT(*) as total FROM cau_hoi';
            const params = [];
            const countParams = [];

            if (search) {
                questionQuery += ' WHERE noi_dung LIKE ?';
                countQuery += ' WHERE noi_dung LIKE ?';
                params.push(`%${search}%`);
                countParams.push(`%${search}%`);
            }

            questionQuery += ' ORDER BY id LIMIT ? OFFSET ?';
            params.push(limit, offset);

            // Lấy danh sách câu hỏi phân trang và tổng số câu hỏi
            const [[questions], [countRows]] = await Promise.all([
                db.query(questionQuery, params),
                db.query(countQuery, countParams)
            ]);

            // Lấy tất cả câu trả lời của các câu hỏi này
            const questionIds = questions.map(q => q.id);
            let answers = [];
            if (questionIds.length > 0) {
                const [answerRows] = await db.query(
                    `SELECT * FROM cau_tra_loi WHERE id_cau_hoi IN (${questionIds.map(() => '?').join(',')}) ORDER BY id_cau_hoi, id`,
                    questionIds
                );
                answers = answerRows;
            }

            // Gộp câu trả lời vào từng câu hỏi
            const cauHoiWithAnswers = questions.map(q => ({
                ...q,
                cauTraLois: answers.filter(a => a.id_cau_hoi === q.id)
            }));

            return {
                cauHoiWithAnswers,
                total: countRows[0].total,
                currentPage: page,
                totalPages: Math.ceil(countRows[0].total / limit)
            };
        } catch (error) {
            console.error('Error in getCauTraLoiGroupByCauHoiWithPagination:', error);
            throw error;
        }
    }
}

module.exports = new CauTraLoiService(); 