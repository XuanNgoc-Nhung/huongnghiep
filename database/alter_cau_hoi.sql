-- Thay đổi cấu hình của bảng cau_hoi để hỗ trợ Unicode
ALTER TABLE cau_hoi CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thay đổi cấu hình của cột ma_chuyen_nganh để hỗ trợ Unicode
ALTER TABLE cau_hoi MODIFY ma_chuyen_nganh VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thay đổi cấu hình của cột cau_hoi để hỗ trợ Unicode
ALTER TABLE cau_hoi MODIFY cau_hoi TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thay đổi cấu hình của cột dap_an để hỗ trợ Unicode
ALTER TABLE cau_hoi MODIFY dap_an TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 