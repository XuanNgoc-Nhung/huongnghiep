const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');

// Tất cả các routes trong trac-nghiem đều yêu cầu đăng nhập
router.use(isAuthenticated);

// Lấy danh sách bài trắc nghiệm
router.get('/', (req, res) => {
    // TODO: Implement get quiz list logic
    res.render('user/trac-nghiem/index', {
        title: 'Danh sách bài trắc nghiệm',
        quizzes: [] // TODO: Get quizzes from database
    });
});

// Trang bắt đầu làm bài trắc nghiệm
router.get('/bat-dau', (req, res) => {
    res.render('user/trac-nghiem/bat-dau', {
        title: 'Bắt đầu làm bài trắc nghiệm'
    });
});

// Route cho bài trắc nghiệm sở thích đam mê
router.get('/so-thich-dam-me', (req, res) => {  
    res.render('user/trac-nghiem/so-thich-dam-me', {
        title: 'Trắc nghiệm sở thích đam mê',
        questions: [1,2,3,4,5,6,7,8,9,10]
    });
});
// Route cho kỹ năng và khả năng
router.get('/ky-nang-kha-nang', (req, res) => {  
    res.render('user/trac-nghiem/ky-nang-kha-nang', {
        title: 'Kỹ năng, khả năng',
        questions: [1,2,3,4,5,6,7,8,9,10]
    });
});
// Route cho môi trường làm việc
router.get('/moi-truong-lam-viec', (req, res) => {  
    res.render('user/trac-nghiem/moi-truong-lam-viec', {
        title: 'Môi trường làm việc',
        questions: [1,2,3,4,5,6,7,8,9,10]
    });
});
// Route cho môi trường làm việc
router.get('/moi-truong-lam-viec', (req, res) => {  
    res.render('user/trac-nghiem/moi-truong-lam-viec', {
        title: 'Môi trường làm việc',
        questions: [1,2,3,4,5,6,7,8,9,10]
    });
});
// Route cho ngành phù hợp  
router.get('/nganh-phu-hop', (req, res) => {  
    const faqItems = [
        {
            id: "1",
            question: "1. Kinh tế, Tài chính, Kế toán",
            options: [
                { value: "business", label: "Quản trị kinh doanh" },
                { value: "technology", label: "Quản trị tài chính" },
                { value: "arts", label: "Quản trị nhân sự" }
            ],
            answers: [
                {
                    value: "business",
                    html: "<b>Kinh doanh & Quản lý:</b> Phù hợp với người thích lãnh đạo, quản lý, phát triển doanh nghiệp."
                },
                {
                    value: "technology",
                    html: "<b>Kỹ thuật & Công nghệ:</b> Dành cho người yêu thích sáng tạo, giải quyết vấn đề kỹ thuật."
                },
                {
                    value: "arts",
                    html: "<b>Nghệ thuật & Sáng tạo:</b> Phù hợp với người đam mê nghệ thuật, thiết kế, sáng tạo nội dung."
                }
            ]
        },
        {
            id: "2",
            question: "2. Công nghệ thông tin",
            options: [
                { value: "software", label: "Kỹ thuật phần mềm" },
                { value: "network", label: "Mạng máy tính" },
                { value: "ai", label: "Trí tuệ nhân tạo" }
            ],
            answers: [
                {
                    value: "software",
                    html: "<b>Kỹ thuật phần mềm:</b> Phù hợp với người có tư duy logic, yêu thích lập trình và phát triển ứng dụng."
                },
                {
                    value: "network",
                    html: "<b>Mạng máy tính:</b> Dành cho người quan tâm đến hệ thống mạng, bảo mật và cơ sở hạ tầng CNTT."
                },
                {
                    value: "ai",
                    html: "<b>Trí tuệ nhân tạo:</b> Phù hợp với người đam mê nghiên cứu, phát triển các giải pháp AI và machine learning."
                }
            ]
        }
    ];
    
    // Danh sách trường đại học, học viện đào tạo theo chuyên ngành
    const universityList = [
        {
            name: "ĐH Kinh tế Quốc dân",
            major: "Quản trị kinh doanh",
            quota: 550,
            method: "THPT, học bạ, ĐGNL",
            scores: [
                { year: 2021, value: 27.5 },
                { year: 2022, value: 27 },
                { year: 2023, value: 28.5 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        {
            name: "ĐH Ngoại thương",
            major: "Quản trị kinh doanh",
            quota: 450,
            method: "THPT, chứng chỉ quốc tế, học bạ",
            scores: [
                { year: 2021, value: 28.2 },
                { year: 2022, value: 28.5 },
                { year: 2023, value: 29 }
            ],
            detailUrl: "#"
        },
        // ... các trường khác, điền tương tự
    ];
    // Lấy mảng 3 năm gần nhất từ trường đầu tiên
    const years = universityList[0].scores.map(s => s.year);
    const latestYear = years[years.length - 1];

    res.render('user/trac-nghiem/nganh-phu-hop', {
        title: 'Ngành phù hợp',
        questions: [1,2,3,4,5,6,7,8,9,10],
        faqItems: faqItems,
        universityList: universityList,
        years: years,
        latestYear: latestYear
    });
});


// Route cho kết quả trắc nghiệm
router.get('/ket-qua', (req, res) => {
    res.render('user/trac-nghiem/ket-qua', {
        title: 'Kết quả trắc nghiệm'
    });
});
// Lấy chi tiết một bài trắc nghiệm
router.get('/:id', (req, res) => {
    // TODO: Implement get quiz detail logic
    res.json({ message: 'Get quiz detail route', quizId: req.params.id });
});

// Bắt đầu làm bài trắc nghiệm
router.post('/:id/start', (req, res) => {
    // TODO: Implement start quiz logic
    res.json({ message: 'Start quiz route', quizId: req.params.id });
});

// Nộp bài trắc nghiệm
router.post('/:id/submit', (req, res) => {
    // TODO: Implement submit quiz logic
    res.json({ message: 'Submit quiz route', quizId: req.params.id });
});

// Xem kết quả bài trắc nghiệm
router.get('/:id/result', (req, res) => {
    // TODO: Implement get quiz result logic
    res.json({ message: 'Get quiz result route', quizId: req.params.id });
});

// Lấy lịch sử làm bài trắc nghiệm của người dùng
router.get('/history', (req, res) => {
    // TODO: Implement get quiz history logic
    res.json({ message: 'Get quiz history route' });
});


module.exports = router; 