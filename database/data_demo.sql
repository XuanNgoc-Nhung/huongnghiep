-- Insert sample data for users table
INSERT INTO users (first_name, last_name, email, phone, password) VALUES
('Nguyễn', 'Văn A', 'nguyenvana@example.com', '0987654321', '$2a$10$abcdefghijklmnopqrstuvwxyz'),
('Trần', 'Thị B', 'tranthib@example.com', '0987654322', '$2a$10$abcdefghijklmnopqrstuvwxyz'),
('Lê', 'Văn C', 'levanc@example.com', '0987654323', '$2a$10$abcdefghijklmnopqrstuvwxyz');

-- Insert sample data for nganh table
INSERT INTO nganh (ma_nganh, ten_nganh, mo_ta) VALUES
('CNTT', 'Công nghệ thông tin', 'Ngành học về máy tính và công nghệ thông tin'),
('KT', 'Kế toán', 'Ngành học về kế toán và tài chính'),
('QTKD', 'Quản trị kinh doanh', 'Ngành học về quản lý và kinh doanh');

-- Insert sample data for chuyen_nganh table
INSERT INTO chuyen_nganh (ma_chuyen_nganh, ma_nganh, mo_ta) VALUES
('CNTT1', 'CNTT', 'Chuyên ngành Công nghệ phần mềm'),
('CNTT2', 'CNTT', 'Chuyên ngành Mạng máy tính'),
('KT1', 'KT', 'Chuyên ngành Kế toán doanh nghiệp'),
('KT2', 'KT', 'Chuyên ngành Kiểm toán'),
('QTKD1', 'QTKD', 'Chuyên ngành Marketing'),
('QTKD2', 'QTKD', 'Chuyên ngành Quản trị nhân sự');

-- Insert sample data for cau_hoi table
INSERT INTO cau_hoi (ma_cau_hoi, noi_dung, ma_chuyen_nganh, tags, trang_thai) VALUES
('CH001', 'Bạn có thích lập trình không?', 'CNTT1', 'lập trình,đam mê', 1),
('CH002', 'Bạn có khả năng làm việc nhóm tốt không?', 'CNTT1', 'kỹ năng mềm,làm việc nhóm', 1),
('CH003', 'Bạn có đam mê với marketing không?', 'QTKD1', 'marketing,đam mê', 1),
('CH004', 'Bạn có khả năng phân tích số liệu tốt không?', 'KT1', 'phân tích,số liệu', 1);

-- Insert sample data for cau_tra_loi table
INSERT INTO cau_tra_loi (ma_cau_tra_loi, ma_cau_hoi, noi_dung, diem, ghi_chu, trang_thai) VALUES
('TL001', 'CH001', 'Rất thích', 5, 'Phù hợp với ngành CNTT', 1),
('TL002', 'CH001', 'Không thích lắm', 1, 'Không phù hợp với ngành CNTT', 1),
('TL003', 'CH002', 'Rất tốt', 5, 'Phù hợp với môi trường làm việc nhóm', 1),
('TL004', 'CH002', 'Cần cải thiện', 2, 'Cần rèn luyện thêm kỹ năng làm việc nhóm', 1),
('TL005', 'CH003', 'Rất đam mê', 5, 'Phù hợp với ngành Marketing', 1),
('TL006', 'CH004', 'Khá tốt', 4, 'Phù hợp với ngành Kế toán', 1); 