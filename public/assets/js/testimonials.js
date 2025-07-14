document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.testimonials-container');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    const cardWidth = 330; // card width + gap
    const visibleCards = 3;
    let currentPosition = 0;

    function updateSliderPosition() {
        slider.style.transform = `translateX(${currentPosition}px)`;
    }

    function updateButtonStates() {
        const maxScroll = -(cardWidth * (slider.children.length - visibleCards));
        prevButton.style.opacity = currentPosition >= 0 ? '0.5' : '1';
        nextButton.style.opacity = currentPosition <= maxScroll ? '0.5' : '1';
    }

    prevButton.addEventListener('click', () => {
        currentPosition = Math.min(currentPosition + cardWidth, 0);
        updateSliderPosition();
        updateButtonStates();
    });

    nextButton.addEventListener('click', () => {
        const maxScroll = -(cardWidth * (slider.children.length - visibleCards));
        currentPosition = Math.max(currentPosition - cardWidth, maxScroll);
        updateSliderPosition();
        updateButtonStates();
    });

    // Initial button states
    updateButtonStates();

    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    slider.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            e.preventDefault();
        }
    });

    slider.addEventListener('touchend', () => {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextButton.click();
            } else {
                prevButton.click();
            }
        }
    });
}); 