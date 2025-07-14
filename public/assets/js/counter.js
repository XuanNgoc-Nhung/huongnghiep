function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16); // 16ms is roughly 60fps
    let current = start;
    
    const animate = () => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target) + '+';
            return;
        }
        element.textContent = Math.floor(current) + '+';
        requestAnimationFrame(animate);
    };
    
    animate();
}

// Intersection Observer để bắt đầu animation khi section hiện ra trong viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Lấy tất cả các số thống kê
            const statNumbers = entry.target.querySelectorAll('.stat-item h2');
            
            // Animate từng số
            statNumbers.forEach(number => {
                const target = parseInt(number.textContent);
                animateCounter(number, target, 3000); // 3000ms = 3s
            });
            
            // Ngừng theo dõi sau khi đã chạy animation
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Theo dõi section statistics
document.addEventListener('DOMContentLoaded', () => {
    const statistics = [
        { target: 563, element: document.querySelector('.stat-item:first-child h2') },
        { target: 232, element: document.querySelector('.stat-item:last-child h2') }
    ];

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const animateCounter = (element, target) => {
        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = 20; // Update every 20ms for smoother animation
        const totalSteps = duration / stepTime;
        const stepValue = target / totalSteps;

        const counter = setInterval(() => {
            current += stepValue;
            if (current >= target) {
                current = target;
                clearInterval(counter);
                element.textContent = `${Math.floor(current)}+`;
            } else {
                element.textContent = `${Math.floor(current)}`;
            }
        }, stepTime);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItem = statistics.find(stat => 
                    stat.element === entry.target
                );
                if (statItem) {
                    animateCounter(statItem.element, statItem.target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, options);

    statistics.forEach(stat => {
        if (stat.element) {
            stat.element.textContent = '0';
            observer.observe(stat.element);
        }
    });
}); 