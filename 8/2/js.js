// Carousel Class
class ImageCarousel {
    constructor(config) {
        // Default configuration
        this.config = {
            container: document.getElementById('carousel'),
            images: [
                {
                    src: 'https://picsum.photos/id/1015/800/400',
                    title: 'Mountain Lake',
                    description: 'A beautiful mountain lake with clear water'
                },
                {
                    src: 'https://picsum.photos/id/1018/800/400',
                    title: 'Mountain View',
                    description: 'Stunning mountain view with snow peaks'
                },
                {
                    src: 'https://picsum.photos/id/1019/800/400',
                    title: 'Ocean Sunset',
                    description: 'Golden sunset over the ocean'
                },
                {
                    src: 'https://picsum.photos/id/1022/800/400',
                    title: 'Northern Lights',
                    description: 'Amazing aurora borealis in the night sky'
                },
                {
                    src: 'https://picsum.photos/id/1035/800/400',
                    title: 'Forest Path',
                    description: 'A peaceful path through a foggy forest'
                },
                {
                    src: 'https://picsum.photos/id/1039/800/400',
                    title: 'Desert Landscape',
                    description: 'Wide open desert landscape with rocks'
                },
                {
                    src: 'https://picsum.photos/id/1043/800/400',
                    title: 'Field of Flowers',
                    description: 'Beautiful field of colorful wildflowers'
                },
                {
                    src: 'https://picsum.photos/id/1059/800/400',
                    title: 'Beach View',
                    description: 'Tropical beach with palm trees and white sand'
                }
            ],
            duration: 500,
            autoplay: true,
            autoplaySpeed: 3000,
            showArrows: true,
            showDots: true,
            ...config
        };
        
        // DOM Elements
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('dots');
        
        // State
        this.currentSlide = 0;
        this.slideCount = this.config.images.length;
        this.autoplayTimer = null;
        this.isPaused = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Create slides
        this.createSlides();
        
        // Create dots
        this.createDots();
        
        // Update visibility of controls based on config
        this.updateControlsVisibility();
        
        // Set initial position
        this.goToSlide(0);
        
        // Add event listeners
        this.addEventListeners();
        
        // Start autoplay if enabled
        if (this.config.autoplay) {
            this.startAutoplay();
        }
    }
    
    createSlides() {
        // Clear container
        this.config.container.innerHTML = '';
        
        // Add slides
        this.config.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.title || `Slide ${index + 1}`;
            
            const content = document.createElement('div');
            content.className = 'slide-content';
            
            const title = document.createElement('h3');
            title.textContent = image.title || `Slide ${index + 1}`;
            
            const description = document.createElement('p');
            description.textContent = image.description || '';
            
            content.appendChild(title);
            content.appendChild(description);
            
            slide.appendChild(img);
            slide.appendChild(content);
            
            this.config.container.appendChild(slide);
        });
    }
    
    createDots() {
        // Clear dots container
        this.dotsContainer.innerHTML = '';
        
        // Add dots
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.dataset.index = i;
            
            dot.addEventListener('click', () => {
                this.goToSlide(parseInt(dot.dataset.index));
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateControlsVisibility() {
        // Update arrows visibility
        if (this.config.showArrows) {
            this.prevBtn.classList.remove('hidden');
            this.nextBtn.classList.remove('hidden');
        } else {
            this.prevBtn.classList.add('hidden');
            this.nextBtn.classList.add('hidden');
        }
        
        // Update dots visibility
        if (this.config.showDots) {
            this.dotsContainer.classList.remove('hidden');
        } else {
            this.dotsContainer.classList.add('hidden');
        }
    }
    
    addEventListeners() {
        // Arrow buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Pause autoplay on hover
        this.config.container.addEventListener('mouseenter', () => {
            if (this.config.autoplay) {
                this.isPaused = true;
                this.stopAutoplay();
            }
        });
        
        // Resume autoplay on mouseleave
        this.config.container.addEventListener('mouseleave', () => {
            if (this.config.autoplay && this.isPaused) {
                this.isPaused = false;
                this.startAutoplay();
            }
        });
    }
    
    goToSlide(index) {
        // Make sure index is within bounds (loop)
        if (index < 0) {
            index = this.slideCount - 1;
        } else if (index >= this.slideCount) {
            index = 0;
        }
        
        // Update current slide
        this.currentSlide = index;
        
        // Calculate position
        const position = -index * 100;
        
        // Update transform with animation duration from config
        this.config.container.style.transition = `transform ${this.config.duration}ms ease-in-out`;
        this.config.container.style.transform = `translateX(${position}%)`;
        
        // Update dots
        this.updateDots();
        
        // Reset autoplay timer if necessary
        if (this.config.autoplay && !this.isPaused) {
            this.resetAutoplay();
        }
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    updateDots() {
        // Remove active class from all dots
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current dot
        if (dots[this.currentSlide]) {
            dots[this.currentSlide].classList.add('active');
        }
    }
    
    startAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
        }
        
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.config.autoplaySpeed);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    updateConfig(newConfig) {
        // Update config
        this.config = {
            ...this.config,
            ...newConfig
        };
        
        // Stop autoplay
        this.stopAutoplay();
        
        // Re-initialize
        this.init();
    }
}

// Initialize the carousel when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create carousel instance
    const carousel = new ImageCarousel();
    
    // Configuration elements
    const autoplayCheckbox = document.getElementById('autoplay');
    const durationInput = document.getElementById('duration');
    const autoplaySpeedInput = document.getElementById('autoplaySpeed');
    const showArrowsCheckbox = document.getElementById('showArrows');
    const showDotsCheckbox = document.getElementById('showDots');
    const applyConfigBtn = document.getElementById('applyConfig');
    
    // Apply configuration button
    applyConfigBtn.addEventListener('click', () => {
        // Get current configuration
        const newConfig = {
            autoplay: autoplayCheckbox.checked,
            duration: parseInt(durationInput.value),
            autoplaySpeed: parseInt(autoplaySpeedInput.value),
            showArrows: showArrowsCheckbox.checked,
            showDots: showDotsCheckbox.checked
        };
        
        // Update carousel configuration
        carousel.updateConfig(newConfig);
    });
});