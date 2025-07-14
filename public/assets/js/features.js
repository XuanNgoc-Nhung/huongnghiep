document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    let activeIndex = 1; // Middle card is initially active

    featureCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index !== activeIndex) {
                // Get the cards
                const clickedCard = featureCards[index];
                const activeCard = featureCards[activeIndex];

                // Get initial positions before any class changes
                const clickedRect = clickedCard.getBoundingClientRect();
                const activeRect = activeCard.getBoundingClientRect();

                // Calculate the distance to move
                const xDistance = activeRect.left - clickedRect.left;
                const yDistance = activeRect.top - clickedRect.top;

                // Add transitioning class to both cards
                clickedCard.classList.add('transitioning');
                activeCard.classList.add('transitioning');

                // Remove active class from current active card
                activeCard.classList.remove('active');
                
                // Set initial positions
                clickedCard.style.transition = 'none';
                activeCard.style.transition = 'none';
                
                // Force reflow
                clickedCard.offsetHeight;
                activeCard.offsetHeight;

                // Add transitions back
                clickedCard.style.transition = 'transform 0.5s ease';
                activeCard.style.transition = 'transform 0.5s ease';

                // Move cards
                clickedCard.style.transform = `translate(${xDistance}px, ${yDistance}px)`;
                activeCard.style.transform = `translate(${-xDistance}px, ${-yDistance}px)`;

                // After animation
                setTimeout(() => {
                    // Reset transforms
                    clickedCard.style.transform = '';
                    activeCard.style.transform = '';
                    clickedCard.style.transition = '';
                    activeCard.style.transition = '';

                    // Remove transitioning class
                    clickedCard.classList.remove('transitioning');
                    activeCard.classList.remove('transitioning');

                    // Update DOM order
                    const parent = clickedCard.parentNode;
                    const clickedIndex = Array.from(parent.children).indexOf(clickedCard);
                    const currentActiveIndex = Array.from(parent.children).indexOf(activeCard);
                    
                    if (clickedIndex < currentActiveIndex) {
                        parent.insertBefore(activeCard, clickedCard);
                    } else {
                        parent.insertBefore(clickedCard, activeCard);
                    }

                    // Add active class to clicked card
                    clickedCard.classList.add('active');
                    
                    // Update active index
                    activeIndex = Array.from(featureCards).indexOf(clickedCard);
                }, 500);
            }
        });
    });
}); 