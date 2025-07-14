document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // Toggle password visibility
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert('Mật khẩu không khớp!');
            return;
        }

        // Validate password strength
        if (passwordInput.value.length < 8) {
            alert('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    password: passwordInput.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Đã có lỗi xảy ra');
            }

            // Redirect on success
            window.location.href = data.redirectUrl;
        } catch (error) {
            alert(error.message);
        }
    });

    // Google Sign In
    const googleButton = document.querySelector('.google-btn');
    if (googleButton) {
        googleButton.addEventListener('click', () => {
            window.location.href = '/auth/google';
        });
    }
}); 