document.addEventListener('DOMContentLoaded', function() {
    const togglePasswordButton = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    const toggleIcon = document.querySelector('.toggle-password img');

    togglePasswordButton.addEventListener('click', function() {
        // Chuyển đổi kiểu input giữa password và text
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Thay đổi icon tương ứng
        if (type === 'text') {
            toggleIcon.src = 'assets/eye.png'; // Icon khi đang hiện mật khẩu
            toggleIcon.alt = 'Hide password';
        } else {
            toggleIcon.src = 'assets/eye.png'; // Icon khi đang ẩn mật khẩu
            toggleIcon.alt = 'Show password';
        }
    });
}); 