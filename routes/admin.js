const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const nganhService = require('../services/nganhService');
const chuyenNganhService = require('../services/chuyenNganhService');
const cauHoiService = require('../services/cauHoiService');
const cauHoiController = require('../controllers/cauHoiController');
const cauTraLoiService = require('../services/cauTraLoiService');
const cauTraLoiController = require('../controllers/cauTraLoiController');
const { LOAI_CAU_HOI } = require('../constants');

// Admin dashboard
router.get('/', async (req, res) => {
    try {
        const [nganhCount, chuyenNganhCount, cauHoiCount, cauTraLoiCount] = await Promise.all([
            nganhService.countNganh(),
            chuyenNganhService.countChuyenNganh(),
            cauHoiService.countCauHoi(),
            cauTraLoiService.countCauTraLoi()
        ]);

        res.render('admin/dashboard', {
            title: 'Dashboard',
            path: '/admin',
            stats: {
                nganhCount,
                chuyenNganhCount,
                cauHoiCount,
                cauTraLoiCount
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải thống kê');
        res.redirect('/admin');
    }
});

// Ngành routes
router.get('/nganh', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const result = await nganhService.getNganhWithFilter(page, limit, search);
        
        res.render('admin/nganh/index', {
            title: 'Quản lý Ngành',
            path: '/admin/nganh',
            nganhs: result.nganhs,
            pagination: {
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total,
                limit: limit,
                startItem: (result.currentPage - 1) * limit + 1,
                endItem: Math.min(result.currentPage * limit, result.total)
            },
            search: search,
            limit: limit
        });
    } catch (error) {
        console.error('Error fetching nganh:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách ngành');
        res.redirect('/admin');
    }
});

router.get('/nganh/create', isAdmin, (req, res) => {
    res.render('admin/nganh/create', {
        title: 'Thêm Ngành Mới',
        path: '/admin/nganh'
    });
});

router.post('/nganh/create', isAdmin, async (req, res) => {
    try {
        await nganhService.createNganh(req.body);
        req.flash('success', 'Thêm ngành thành công');
        res.redirect('/admin/nganh');
    } catch (error) {
        console.error('Error creating nganh:', error);
        req.flash('error', 'Có lỗi xảy ra khi thêm ngành');
        res.redirect('/admin/nganh/create');
    }
});

router.get('/nganh/edit/:id', isAdmin, async (req, res) => {
    try {
        const nganh = await nganhService.getNganhById(req.params.id);
        if (!nganh) {
            req.flash('error', 'Không tìm thấy ngành');
            return res.redirect('/admin/nganh');
        }
        res.render('admin/nganh/edit', {
            title: 'Chỉnh sửa Ngành',
            path: '/admin/nganh',
            nganh
        });
    } catch (error) {
        console.error('Error fetching nganh:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải thông tin ngành');
        res.redirect('/admin/nganh');
    }
});

router.post('/nganh/edit/:id', isAdmin, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const success = await nganhService.updateNganh(req.params.id, req.body);
        if (success) {
            res.json({
                success: true,
                message: 'Cập nhật ngành thành công'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy ngành để cập nhật'
            });
        }
    } catch (error) {
        console.error('Error updating nganh:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật ngành'
        });
    }
});

router.post('/nganh/delete/:id', isAdmin, async (req, res) => {
    try {
        const success = await nganhService.deleteNganh(req.params.id);
        if (success) {
            res.json({
                success: true,
                message: 'Xóa ngành thành công'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy ngành để xóa'
            });
        }
    } catch (error) {
        console.error('Error deleting nganh:', error);
        if (error.code === 'NGANH_HAS_CAU_HOI') {
            res.status(400).json({
                success: false,
                message: error.message,
                cauHois: error.cauHois // trả về danh sách câu hỏi còn tồn tại
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi xóa ngành'
            });
        }
    }
});

// Chuyên ngành routes
router.get('/chuyen-nganh', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const chuyenNganhs = await chuyenNganhService.getAllChuyenNganh();
        const total = await chuyenNganhService.countChuyenNganh();
        console.log("chuyenNganhs");
        console.log(chuyenNganhs);
        res.render('admin/chuyen-nganh/index', {
            title: 'Quản lý Chuyên ngành',
            path: '/admin/chuyen-nganh',
            chuyenNganhs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total: total,
                limit: limit,
                startItem: (page - 1) * limit + 1,
                endItem: Math.min(page * limit, total)
            },
            search: search,
            limit: limit
        });
    } catch (error) {
        console.error('Error fetching chuyen nganh:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách chuyên ngành');
        res.redirect('/admin');
    }
});

router.get('/chuyen-nganh/create', isAdmin, async (req, res) => {
    try {
        const nganhs = await nganhService.getAllNganh();
        res.render('admin/chuyen-nganh/create', {
            title: 'Thêm Chuyên ngành Mới',
            path: '/admin/chuyen-nganh',
            nganhs
        });
    } catch (error) {
        console.error('Error fetching nganh:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách ngành');
        res.redirect('/admin/chuyen-nganh');
    }
});

router.post('/chuyen-nganh/create', isAdmin, async (req, res) => {
    try {
        await chuyenNganhService.createChuyenNganh(req.body);
        res.json({
            success: true,
            message: 'Thêm chuyên ngành thành công'
        });
    } catch (error) {
        if (error.code === 'CHUYEN_NGANH_EXISTS') {
            res.status(400).json({
                success: false,
                message: 'Mã chuyên ngành đã tồn tại',
                error: error.message,
                formData: req.body
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi thêm chuyên ngành',
                error: error.message
            });
        }
    }
});

router.get('/chuyen-nganh/edit/:id', isAdmin, async (req, res) => {
    try {
        const [chuyenNganh, nganhs] = await Promise.all([
            chuyenNganhService.getChuyenNganhById(req.params.id),
            nganhService.getChuyenNganhCha()
        ]);
        console.log("chuyên ngành:");
        console.log(chuyenNganh);
        console.log("chuyên ngành cha:");
        console.log(nganhs);
        if (!chuyenNganh) {
            req.flash('error', 'Không tìm thấy chuyên ngành');
            return res.redirect('/admin/chuyen-nganh');
        }
        res.render('admin/chuyen-nganh/edit', {
            title: 'Chỉnh sửa Chuyên ngành',
            path: '/admin/chuyen-nganh',
            chuyenNganh,
            nganhs
        });
    } catch (error) {
        console.error('Error fetching chuyen nganh:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải thông tin chuyên ngành');
        res.redirect('/admin/chuyen-nganh');
    }
});

router.post('/chuyen-nganh/edit/:id', isAdmin, async (req, res) => {
    try {
        const { ten_nhom_nganh, parent_id, mo_ta } = req.body;
        // Validate required fields
        if (!ten_nhom_nganh || ten_nhom_nganh.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Tên chuyên ngành không được để trống'
            });
        }
        if (!parent_id || parent_id === '' || parent_id === 'null') {
            return res.status(400).json({
                success: false,
                message: 'Ngành cha không được để trống'
            });
        }
        // Chuẩn hóa dữ liệu gửi sang service
        const updateData = {
            ten: ten_nhom_nganh,
            parent_id: parent_id,
            moTa: mo_ta
        };
        // Kiểm tra chuyên ngành tồn tại
        const chuyenNganh = await chuyenNganhService.getChuyenNganhById(req.params.id);
        if (!chuyenNganh) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên ngành để cập nhật'
            });
        }
        // Cập nhật chuyên ngành
        const success = await chuyenNganhService.updateChuyenNganh(req.params.id, updateData);
        if (success) {
            return res.json({
                success: true,
                message: 'Cập nhật chuyên ngành thành công'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên ngành để cập nhật'
            });
        }
    } catch (error) {
        console.error('Error updating chuyen nganh:', error);
        return res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật chuyên ngành'
        });
    }
});

router.post('/chuyen-nganh/delete/:id', isAdmin, async (req, res) => {
    try {
        const success = await chuyenNganhService.deleteChuyenNganh(req.params.id);
        if (success) {
            res.json({
                success: true,
                message: 'Xóa chuyên ngành thành công'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy chuyên ngành để xóa'
            });
        }
    } catch (error) {
        console.error('Error deleting chuyen nganh:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xóa chuyên ngành'
        });
    }
});

// Câu hỏi routes
router.get('/cau-hoi', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const result = await cauHoiService.getCauHoiWithFilter(page, limit, search);
        
        res.render('admin/cau-hoi/index', {
            title: 'Quản lý Câu hỏi',
            path: '/admin/cau-hoi',
            cauHois: result.questions,
            pagination: {
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total,
                limit: limit,
                startItem: (result.currentPage - 1) * limit + 1,
                endItem: Math.min(result.currentPage * limit, result.total)
            },
            search: search,
            limit: limit
        });
    } catch (error) {
        console.error('Error fetching cau hoi:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách câu hỏi');
        // res.redirect('/admin');
    }
});

router.get('/cau-hoi/them-moi', cauHoiController.showCreateForm);
router.post('/cau-hoi/create', cauHoiController.create);

router.get('/cau-hoi/sua/:id', isAdmin, async (req, res) => {
    try {
        const [cauHoi, nganhs] = await Promise.all([
            cauHoiService.getCauHoiById(req.params.id),
            nganhService.getAllNganh()
        ]);
        if (!cauHoi) {
            req.flash('error', 'Không tìm thấy câu hỏi');
            return res.redirect('/admin/cau-hoi');
        }
        const loaiCauHois = LOAI_CAU_HOI;
        res.render('admin/cau-hoi/edit', {
            title: 'Chỉnh sửa Câu hỏi',
            path: '/admin/cau-hoi',
            cauHoi,
            nganhs,
            loaiCauHois
        });
    } catch (error) {
        console.error('Error fetching cau hoi:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải thông tin câu hỏi');
        res.redirect('/admin/cau-hoi');
    }
});

router.post('/cau-hoi/sua/:id', isAdmin, async (req, res) => {
    try {
        const success = await cauHoiService.updateCauHoi(req.params.id, req.body);
        if (success) {
            res.json({
                success: true,
                message: 'Cập nhật câu hỏi thành công'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy câu hỏi để cập nhật'
            });
        }
    } catch (error) {
        console.error('Error updating cau hoi:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật câu hỏi'
        });
    }
});

router.post('/cau-hoi/xoa/:id', isAdmin, async (req, res) => {
    try {
        const success = await cauHoiService.deleteCauHoi(req.params.id);
        if (success) {
            res.json({
                success: true,
                message: 'Xóa câu hỏi thành công'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy câu hỏi để xóa'
            });
        }
    } catch (error) {
        console.error('Error deleting cau hoi:', error);
        if (error.code === 'CAU_HOI_HAS_CAU_TRA_LOI') {
            res.status(200).json({
                success: false,
                message: error.message,
                cauTraLoiCount: error.cauTraLoiCount
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi xóa câu hỏi'
            });
        }
    }
});

// Câu trả lời routes
router.get('/cau-tra-loi', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const result = await cauTraLoiService.getCauTraLoiGroupByCauHoiWithPagination(page, limit, search);
        res.render('admin/cau-tra-loi/index', {
            title: 'Quản lý Câu trả lời',
            path: '/admin/cau-tra-loi',
            cauHoiWithAnswers: result.cauHoiWithAnswers,
            pagination: {
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total,
                limit: limit,
                startItem: (result.currentPage - 1) * limit + 1,
                endItem: Math.min(result.currentPage * limit, result.total)
            },
            search: search,
            limit: limit
        });
    } catch (error) {
        console.error('Error fetching cau tra loi:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách câu trả lời');
        res.redirect('/admin');
    }
});

router.get('/cau-tra-loi/create', cauTraLoiController.showCreateForm);
router.post('/cau-tra-loi/create', cauTraLoiController.create);

router.get('/cau-tra-loi/edit/:id', isAdmin, async (req, res) => {
    try {
        const [cauTraLoi, cauHois] = await Promise.all([
            cauTraLoiService.getCauTraLoiById(req.params.id),
            cauHoiService.getAllCauHoi()
        ]);
        if (!cauTraLoi) {
            req.flash('error', 'Không tìm thấy câu trả lời');
            return res.redirect('/admin/cau-tra-loi');
        }
        res.render('admin/cau-tra-loi/edit', {
            title: 'Chỉnh sửa Câu trả lời',
            path: '/admin/cau-tra-loi',
            cauTraLoi,
            cauHois
        });
    } catch (error) {
        console.error('Error fetching cau tra loi:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải thông tin câu trả lời');
        res.redirect('/admin/cau-tra-loi');
    }
});

router.post('/cau-tra-loi/edit/:id', isAdmin, async (req, res) => {
    try {
        const success = await cauTraLoiService.updateCauTraLoi(req.params.id, req.body);
        if (req.xhr || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
            if (success) {
                return res.json({
                    success: true,
                    message: 'Cập nhật câu trả lời thành công'
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy câu trả lời để cập nhật'
                });
            }
        }
        if (success) {
            req.flash('success', 'Cập nhật câu trả lời thành công');
        } else {
            req.flash('error', 'Không tìm thấy câu trả lời để cập nhật');
        }
        res.redirect('/admin/cau-tra-loi');
    } catch (error) {
        console.error('Error updating cau tra loi:', error);
        if (req.xhr || req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
            return res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi cập nhật câu trả lời'
            });
        }
        req.flash('error', 'Có lỗi xảy ra khi cập nhật câu trả lời');
        res.redirect(`/admin/cau-tra-loi/edit/${req.params.id}`);
    }
});

router.post('/cau-tra-loi/delete/:id', isAdmin, async (req, res) => {
    try {
        const success = await cauTraLoiService.deleteCauTraLoi(req.params.id);
        if (success) {
            req.flash('success', 'Xóa câu trả lời thành công');
        } else {
            req.flash('error', 'Không tìm thấy câu trả lời để xóa');
        }
    } catch (error) {
        console.error('Error deleting cau tra loi:', error);
        req.flash('error', 'Có lỗi xảy ra khi xóa câu trả lời');
    }
    res.redirect('/admin/cau-tra-loi');
});

// Ngành nghề routes
router.get('/nghe-nghiep', isAdmin, async (req, res) => {
    try {
        const [nganhs, chuyenNganhs] = await Promise.all([
            nganhService.getAllNganh(),
            chuyenNganhService.getAllChuyenNganh()
        ]);
        res.render('admin/nghe-nghiep/index', {
            title: 'Quản lý Ngành nghề',
            path: '/admin/nghe-nghiep',
            nganhs,
            chuyenNganhs
        });
    } catch (error) {
        console.error('Error fetching nghe nghiep:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách ngành nghề');
        res.redirect('/admin');
    }
});

router.get('/nghe-nghiep/create', isAdmin, async (req, res) => {
    try {
        const nganhs = await nganhService.getAllNganh();
        res.render('admin/nghe-nghiep/create', {
            title: 'Thêm Ngành nghề Mới',
            path: '/admin/nghe-nghiep',
            nganhs
        });
    } catch (error) {
        console.error('Error fetching nganh:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải danh sách ngành');
        res.redirect('/admin/nghe-nghiep');
    }
});

router.post('/nghe-nghiep/create', isAdmin, async (req, res) => {
    try {
        const { type, ...data } = req.body;
        if (type === 'nganh') {
            await nganhService.createNganh(data);
            req.flash('success', 'Thêm ngành thành công');
        } else if (type === 'chuyen-nganh') {
            await chuyenNganhService.createChuyenNganh(data);
            req.flash('success', 'Thêm chuyên ngành thành công');
        }
        res.redirect('/admin/nghe-nghiep');
    } catch (error) {
        console.error('Error creating nghe nghiep:', error);
        req.flash('error', 'Có lỗi xảy ra khi thêm ngành nghề');
        res.redirect('/admin/nghe-nghiep/create');
    }
});

router.get('/nghe-nghiep/edit/:type/:id', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        let data;
        let nganhs;

        if (type === 'nganh') {
            data = await nganhService.getNganhById(id);
        } else if (type === 'chuyen-nganh') {
            [data, nganhs] = await Promise.all([
                chuyenNganhService.getChuyenNganhById(id),
                nganhService.getAllNganh()
            ]);
        }

        if (!data) {
            req.flash('error', 'Không tìm thấy ngành nghề');
            return res.redirect('/admin/nghe-nghiep');
        }

        res.render('admin/nghe-nghiep/edit', {
            title: 'Chỉnh sửa Ngành nghề',
            path: '/admin/nghe-nghiep',
            type,
            data,
            nganhs
        });
    } catch (error) {
        console.error('Error fetching nghe nghiep:', error);
        req.flash('error', 'Có lỗi xảy ra khi tải thông tin ngành nghề');
        res.redirect('/admin/nghe-nghiep');
    }
});

router.post('/nghe-nghiep/edit/:type/:id', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        const { type: formType, ...data } = req.body;
        let success;

        if (type === 'nganh') {
            success = await nganhService.updateNganh(id, data);
        } else if (type === 'chuyen-nganh') {
            success = await chuyenNganhService.updateChuyenNganh(id, data);
        }

        if (success) {
            req.flash('success', 'Cập nhật ngành nghề thành công');
        } else {
            req.flash('error', 'Không tìm thấy ngành nghề để cập nhật');
        }
        res.redirect('/admin/nghe-nghiep');
    } catch (error) {
        console.error('Error updating nghe nghiep:', error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật ngành nghề');
        res.redirect(`/admin/nghe-nghiep/edit/${req.params.type}/${req.params.id}`);
    }
});

router.post('/nghe-nghiep/delete/:type/:id', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        let success;

        if (type === 'nganh') {
            success = await nganhService.deleteNganh(id);
        } else if (type === 'chuyen-nganh') {
            success = await chuyenNganhService.deleteChuyenNganh(id);
        }

        if (success) {
            req.flash('success', 'Xóa ngành nghề thành công');
        } else {
            req.flash('error', 'Không tìm thấy ngành nghề để xóa');
        }
    } catch (error) {
        console.error('Error deleting nghe nghiep:', error);
        req.flash('error', 'Có lỗi xảy ra khi xóa ngành nghề');
    }
    res.redirect('/admin/nghe-nghiep');
});

module.exports = router; 