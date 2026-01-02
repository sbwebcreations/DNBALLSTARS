document.addEventListener('DOMContentLoaded', () => {
    // ================================
    // HEADER & FOOTER WIPE EFFECT
    // ================================
    const headerBg = document.querySelector('.header__bg');
    const headerDefaultLayer = document.querySelector('.header__elements--default');
    const stickyFooter = document.getElementById('stickyFooter');
    const stickyFooterBg = document.querySelector('.sticky-footer__bg');

    // Configuration
    const headerHeight = 70;
    const footerHeight = 60;
    const scrollRange = 150; // How many pixels of scroll to complete the wipe

    const handleWipeScroll = () => {
        const scrollY = window.scrollY;

        // Calculate wipe progress (0 to 1)
        const progress = Math.min(scrollY / scrollRange, 1);

        // Header wipe: clips from bottom up (revealing transparent underneath)
        const headerClipBottom = progress * 100;
        const headerClipPath = `inset(0 0 ${headerClipBottom}% 0)`;

        if (headerBg) {
            headerBg.style.clipPath = headerClipPath;
        }
        if (headerDefaultLayer) {
            headerDefaultLayer.style.clipPath = headerClipPath;
        }

        // Footer wipe: clips from top down (revealing the orange)
        // Mirror effect - as header disappears, footer appears
        const footerClipTop = (1 - progress) * 100;
        const footerClipPath = `inset(${footerClipTop}% 0 0 0)`;

        if (stickyFooterBg) {
            stickyFooterBg.style.clipPath = footerClipPath;
        }

        // Show/hide footer content based on progress
        if (stickyFooter) {
            if (progress > 0.1) {
                stickyFooter.classList.add('is-visible');
            } else {
                stickyFooter.classList.remove('is-visible');
            }
        }
    };

    window.addEventListener('scroll', handleWipeScroll);
    handleWipeScroll(); // Run on load

    // ================================
    // MOBILE MENU
    // ================================
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            const isActive = mobileMenu.classList.contains('is-active');

            if (isActive) {
                mobileMenu.classList.remove('is-active');
                burger.classList.remove('is-active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                mobileMenu.classList.add('is-active');
                burger.classList.add('is-active');
                burger.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                burger.classList.remove('is-active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ================================
    // COUNTDOWN TIMER
    // ================================
    const countdown = () => {
        const countDate = new Date('January 23, 2026 15:00:00').getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        if (gap > 0) {
            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;

            const textDay = Math.floor(gap / day);
            const textHour = Math.floor((gap % day) / hour);
            const textMinute = Math.floor((gap % hour) / minute);
            const textSecond = Math.floor((gap % minute) / second);

            const dayEl = document.getElementById('days');
            const hourEl = document.getElementById('hours');
            const minEl = document.getElementById('minutes');
            const secEl = document.getElementById('seconds');

            if (dayEl) dayEl.innerText = textDay < 10 ? '0' + textDay : textDay;
            if (hourEl) hourEl.innerText = textHour < 10 ? '0' + textHour : textHour;
            if (minEl) minEl.innerText = textMinute < 10 ? '0' + textMinute : textMinute;
            if (secEl) secEl.innerText = textSecond < 10 ? '0' + textSecond : textSecond;
        }
    };

    // Run countdown every second if countdown elements exist
    if (document.getElementById('days')) {
        setInterval(countdown, 1000);
        countdown(); // Run immediately on load
    }

    // ================================
    // CAROUSEL CLASS
    // ================================
    class Carousel {
        constructor(element, options = {}) {
            this.carousel = element;
            this.track = element.querySelector('.carousel__track');
            this.slides = Array.from(element.querySelectorAll('.carousel__slide'));
            this.dots = Array.from(element.querySelectorAll('.carousel__dot'));
            this.prevBtn = element.querySelector('.carousel__arrow--left');
            this.nextBtn = element.querySelector('.carousel__arrow--right');

            this.options = {
                slidesToShow: options.slidesToShow || 1,
                slidesToShowMobile: options.slidesToShowMobile || 1,
                slidesToShowTablet: options.slidesToShowTablet || options.slidesToShow || 1,
                autoplay: options.autoplay || false,
                autoplaySpeed: options.autoplaySpeed || 5000,
                loop: options.loop !== undefined ? options.loop : true,
                ...options
            };

            this.currentIndex = 0;
            this.slidesToShow = this.getSlidesToShow();
            this.totalSlides = this.slides.length;
            this.maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);

            this.init();
        }

        getSlidesToShow() {
            const width = window.innerWidth;
            if (width <= 768) {
                return this.options.slidesToShowMobile;
            } else if (width <= 900) {
                return this.options.slidesToShowTablet;
            }
            return this.options.slidesToShow;
        }

        init() {
            this.bindEvents();
            this.updateDots();
            this.goToSlide(0);

            if (this.options.autoplay) {
                this.startAutoplay();
            }

            // Handle resize
            window.addEventListener('resize', () => {
                this.slidesToShow = this.getSlidesToShow();
                this.maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);
                if (this.currentIndex > this.maxIndex) {
                    this.currentIndex = this.maxIndex;
                }
                this.goToSlide(this.currentIndex);
                this.updateDots();
            });
        }

        bindEvents() {
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }

            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prev());
            }

            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            // Touch/Swipe support
            let startX = 0;
            let endX = 0;

            this.carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            this.carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
            }, { passive: true });
        }

        next() {
            if (this.options.loop) {
                this.currentIndex = (this.currentIndex + 1) % (this.maxIndex + 1);
            } else {
                this.currentIndex = Math.min(this.currentIndex + 1, this.maxIndex);
            }
            this.goToSlide(this.currentIndex);
        }

        prev() {
            if (this.options.loop) {
                this.currentIndex = this.currentIndex === 0 ? this.maxIndex : this.currentIndex - 1;
            } else {
                this.currentIndex = Math.max(this.currentIndex - 1, 0);
            }
            this.goToSlide(this.currentIndex);
        }

        goToSlide(index) {
            this.currentIndex = index;
            const slideWidth = 100 / this.slidesToShow;
            const offset = -index * slideWidth;
            this.track.style.transform = `translateX(${offset}%)`;
            this.updateDots();
        }

        updateDots() {
            // Calculate which dots to show based on slides to show
            const dotsNeeded = this.maxIndex + 1;

            this.dots.forEach((dot, index) => {
                dot.classList.remove('active');
                // Hide extra dots if we have more dots than needed
                if (index < dotsNeeded) {
                    dot.style.display = '';
                    if (index === this.currentIndex) {
                        dot.classList.add('active');
                    }
                } else {
                    dot.style.display = 'none';
                }
            });
        }

        startAutoplay() {
            this.autoplayInterval = setInterval(() => {
                this.next();
            }, this.options.autoplaySpeed);
        }

        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
            }
        }
    }

    // ================================
    // INITIALIZE CAROUSELS
    // ================================

    // Hype Carousel (The Ultimate DNB Holiday)
    const hypeCarousel = document.getElementById('hypeCarousel');
    if (hypeCarousel) {
        new Carousel(hypeCarousel, {
            slidesToShow: 3,
            slidesToShowTablet: 2,
            slidesToShowMobile: 1,
            loop: true
        });
    }

    // Headliners Carousel
    const headlinersCarousel = document.getElementById('headlinersCarousel');
    if (headlinersCarousel) {
        new Carousel(headlinersCarousel, {
            slidesToShow: 3,
            slidesToShowTablet: 2,
            slidesToShowMobile: 1,
            loop: true
        });
    }
});
