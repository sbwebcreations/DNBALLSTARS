document.addEventListener('DOMContentLoaded', () => {
    // ================================
    // SCROLL REVEAL ANIMATIONS
    // ================================
    const sections = document.querySelectorAll('.section');

    const revealOnScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('is-visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run on load

    // ================================
    // BACK TO TOP BUTTON
    // ================================
    const backToTop = document.getElementById('backToTop');

    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('is-visible');
        } else {
            backToTop.classList.remove('is-visible');
        }
    };

    if (backToTop) {
        window.addEventListener('scroll', toggleBackToTop);

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ================================
    // LANGUAGE TOGGLE
    // ================================
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'en';

    const switchLanguage = (lang) => {
        currentLang = lang;

        // Update button states
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update all translatable elements
        document.querySelectorAll('[data-en][data-th]').forEach(el => {
            el.textContent = el.dataset[lang];
        });
    };

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });

    // ================================
    // FAQ CATEGORY DROPDOWN
    // ================================
    const faqCategories = document.querySelectorAll('.faq__category');

    faqCategories.forEach(category => {
        const categoryTitle = category.querySelector('.faq__category-title');
        if (categoryTitle) {
            categoryTitle.addEventListener('click', () => {
                // Toggle current category
                category.classList.toggle('is-open');
            });
        }
    });

    // ================================
    // FAQ ACCORDION (Individual Questions)
    // ================================
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        if (question) {
            question.addEventListener('click', () => {
                // Close other items within the same category
                const parentCategory = item.closest('.faq__category');
                const siblingItems = parentCategory ? parentCategory.querySelectorAll('.faq__item') : faqItems;

                siblingItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('is-open');
                    }
                });
                // Toggle current item
                item.classList.toggle('is-open');
            });
        }
    });

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

    // Get hero CTA button for footer visibility trigger
    const heroCta = document.querySelector('.hero__cta');

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

        // Footer: Show when hero CTA reaches the header area
        if (heroCta) {
            const heroCtaRect = heroCta.getBoundingClientRect();
            const triggerPoint = 100; // Start when CTA is near the header (around 100px from top)

            if (heroCtaRect.top < triggerPoint) {
                // Calculate footer wipe progress based on CTA position
                const footerProgress = Math.min(Math.max(0, (triggerPoint - heroCtaRect.top) / scrollRange), 1);
                const footerClipTop = (1 - footerProgress) * 100;
                const footerClipPath = `inset(${footerClipTop}% 0 0 0)`;

                if (stickyFooterBg) {
                    stickyFooterBg.style.clipPath = footerClipPath;
                }

                if (stickyFooter && footerProgress > 0.1) {
                    stickyFooter.classList.add('is-visible');
                }
            } else {
                // Hide footer completely
                if (stickyFooterBg) {
                    stickyFooterBg.style.clipPath = 'inset(100% 0 0 0)';
                }
                if (stickyFooter) {
                    stickyFooter.classList.remove('is-visible');
                }
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
    // COUNTDOWN TIMER WITH FLIP ANIMATION
    // ================================
    let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

    const updateWithFlip = (el, newValue, key) => {
        if (el && prevValues[key] !== newValue) {
            el.classList.add('flip');
            el.innerText = newValue;
            prevValues[key] = newValue;

            setTimeout(() => {
                el.classList.remove('flip');
            }, 600);
        }
    };

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

            const dayStr = textDay < 10 ? '0' + textDay : String(textDay);
            const hourStr = textHour < 10 ? '0' + textHour : String(textHour);
            const minStr = textMinute < 10 ? '0' + textMinute : String(textMinute);
            const secStr = textSecond < 10 ? '0' + textSecond : String(textSecond);

            updateWithFlip(dayEl, dayStr, 'days');
            updateWithFlip(hourEl, hourStr, 'hours');
            updateWithFlip(minEl, minStr, 'minutes');
            updateWithFlip(secEl, secStr, 'seconds');
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

    // Lineup Carousel (formerly Headliners)
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
