-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(100),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng ngành
CREATE TABLE nganh(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nganh VARCHAR(10) UNIQUE NOT NULL,
    ten_nganh VARCHAR(255) NOT NULL,
    mo_ta TEXT
);

-- Tạo bảng chuyên ngành
CREATE TABLE chuyen_nganh(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_chuyen_nganh VARCHAR(10) UNIQUE NOT NULL,
    ten_chuyen_nganh VARCHAR(100) NOT NULL,
    ma_nganh TEXT,
    mo_ta TEXT
);

-- Tạo bảng câu hỏi
CREATE TABLE cau_hoi(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_cau_hoi VARCHAR(10) UNIQUE NOT NULL,
    noi_dung TEXT NOT NULL,
    ma_chuyen_nganh VARCHAR(10) NOT NULL,
    tags TEXT,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME,
    trang_thai TINYINT(1) DEFAULT 1,
    cap_do TINYINT(1),
    FOREIGN KEY(ma_chuyen_nganh) REFERENCES chuyen_nganh(ma_chuyen_nganh)
);

-- Tạo bảng câu trả lời
CREATE TABLE cau_tra_loi(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_cau_tra_loi VARCHAR(10) UNIQUE NOT NULL,
    ma_cau_hoi VARCHAR(10) NOT NULL,
    noi_dung TEXT NOT NULL,
    diem FLOAT,
    ghi_chu TEXT,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME,
    trang_thai TINYINT(1) DEFAULT 1,
    FOREIGN KEY(ma_cau_hoi) REFERENCES cau_hoi(ma_cau_hoi)
););
