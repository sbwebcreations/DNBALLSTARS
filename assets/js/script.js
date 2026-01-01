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
    // SECTION FOCUS FADE EFFECT
    // ================================
    const headerOffset = 70;

    const handleSectionFocus = () => {
        const viewportHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionHeight = rect.height;

            // How far has the section TOP scrolled past the header?
            const topPastHeader = headerOffset - rect.top;

            // What percentage of the section has scrolled past the header?
            const percentPastHeader = topPastHeader / sectionHeight;

            let orangeGlow = 0;
            let blackFade = 0;

            // Section must be visible in viewport
            if (rect.top < viewportHeight && rect.bottom > headerOffset) {

                if (rect.top > headerOffset) {
                    // Section top is BELOW header (section entering from bottom)
                    // Fade orange IN smoothly as it approaches the header
                    const distanceToHeader = rect.top - headerOffset;
                    const fadeInZone = viewportHeight * 0.4; // Start fading in when 40% of viewport away
                    const fadeInProgress = 1 - Math.min(distanceToHeader / fadeInZone, 1);
                    orangeGlow = fadeInProgress * 0.15;
                    blackFade = 0;

                } else if (percentPastHeader < 0.50) {
                    // Section top is AT or PAST header, but less than 50% scrolled past
                    // Orange is fully ON, no black fade yet
                    orangeGlow = 0.15;
                    blackFade = 0;

                } else {
                    // More than 50% of section has scrolled past header
                    // Fade orange OUT smoothly and fade black IN
                    const fadeOutProgress = Math.min((percentPastHeader - 0.50) / 0.50, 1); // 0 to 1 over remaining 50%
                    orangeGlow = 0.15 * (1 - fadeOutProgress);
                    blackFade = fadeOutProgress * 0.7;
                }
            }

            section.style.setProperty('--focus-glow', orangeGlow);
            section.style.setProperty('--fade-out', blackFade);

            if (orangeGlow > 0.05) {
                section.classList.add('is-focused');
            } else {
                section.classList.remove('is-focused');
            }
        });
    };

    window.addEventListener('scroll', handleSectionFocus);
    handleSectionFocus();

    // ================================
    // ANIMATED NUMBER COUNTERS
    // ================================
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = entry.target;
                const countTo = parseInt(target.dataset.count);
                const suffix = target.dataset.suffix || '';
                const prefix = target.dataset.prefix || '';
                const duration = 2000;
                const startTime = performance.now();

                target.classList.add('counted');

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentCount = Math.floor(easeOut * countTo);

                    target.textContent = prefix + currentCount + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = prefix + countTo + suffix;
                    }
                };

                requestAnimationFrame(updateCounter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

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
                const parentCategory = item.closest('.faq__category');
                const siblingItems = parentCategory ? parentCategory.querySelectorAll('.faq__item') : faqItems;

                siblingItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('is-open');
                    }
                });
                item.classList.toggle('is-open');
            });
        }
    });

    // ================================
    // HEADER & FOOTER WIPE + CTA TRANSITION
    // ================================
    const headerBg = document.querySelector('.header__bg');
    const headerDefaultLayer = document.querySelector('.header__elements--default');
    const stickyFooter = document.getElementById('stickyFooter');
    const stickyFooterBg = document.querySelector('.sticky-footer__bg');
    const heroCta = document.querySelector('.hero__cta');
    const heroCtaBtn = document.querySelector('.hero__cta .btn--hero');
    const scrollIndicatorLine = document.querySelector('.scroll-indicator__line');

    const headerHeight = 70;
    const scrollRange = 150;

    const handleWipeScroll = () => {
        const scrollY = window.scrollY;

        // Header wipe progress
        const progress = Math.min(scrollY / scrollRange, 1);
        const headerClipBottom = progress * 100;
        const headerClipPath = `inset(0 0 ${headerClipBottom}% 0)`;

        if (headerBg) {
            headerBg.style.clipPath = headerClipPath;
        }
        if (headerDefaultLayer) {
            headerDefaultLayer.style.clipPath = headerClipPath;
        }

        // Scroll indicator line - scroll-based animation
        if (scrollIndicatorLine) {
            const scrollLineProgress = Math.min(scrollY / 200, 1);
            const linePosition = scrollLineProgress * 100;
            scrollIndicatorLine.style.setProperty('--line-progress', `${linePosition}%`);
        }

        // Footer & Hero CTA Transition - footer appears AS hero button disappears
        if (heroCta) {
            const heroCtaRect = heroCta.getBoundingClientRect();
            const triggerPoint = 100; // When hero CTA is 100px from top
            const transitionRange = 60; // Complete transition over 60px of scroll

            if (heroCtaRect.top < triggerPoint) {
                // Calculate transition progress (0 to 1)
                const transitionProgress = Math.min(Math.max(0, (triggerPoint - heroCtaRect.top) / transitionRange), 1);

                // Fade out hero CTA button
                if (heroCtaBtn) {
                    heroCtaBtn.style.opacity = 1 - transitionProgress;
                    heroCtaBtn.style.transform = `translateY(${transitionProgress * -15}px) scale(${1 - transitionProgress * 0.05})`;
                    heroCtaBtn.style.pointerEvents = transitionProgress > 0.5 ? 'none' : 'auto';
                }

                // Footer button fades IN as hero button fades OUT (synced)
                const footerClipTop = (1 - transitionProgress) * 100;
                const footerClipPath = `inset(${footerClipTop}% 0 0 0)`;

                if (stickyFooterBg) {
                    stickyFooterBg.style.clipPath = footerClipPath;
                }

                // Show footer content when transition is past halfway
                if (stickyFooter) {
                    if (transitionProgress > 0.5) {
                        stickyFooter.classList.add('is-visible');
                    } else {
                        stickyFooter.classList.remove('is-visible');
                    }
                }
            } else {
                // Reset hero CTA
                if (heroCtaBtn) {
                    heroCtaBtn.style.opacity = 1;
                    heroCtaBtn.style.transform = 'translateY(0) scale(1)';
                    heroCtaBtn.style.pointerEvents = 'auto';
                }

                // Hide footer
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
    handleWipeScroll();

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

    if (document.getElementById('days')) {
        setInterval(countdown, 1000);
        countdown();
    }

    // ================================
    // COOKIE CONSENT
    // ================================
    const cookieBanner = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 2000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // ================================
    // NEWSLETTER FORM
    // ================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'SUBSCRIBED!';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                newsletterForm.reset();
            }, 3000);
        });
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
            const dotsNeeded = this.maxIndex + 1;

            this.dots.forEach((dot, index) => {
                dot.classList.remove('active');
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
    const headlinersCarousel = document.getElementById('headlinersCarousel');
    if (headlinersCarousel) {
        new Carousel(headlinersCarousel, {
            slidesToShow: 3,
            slidesToShowTablet: 2,
            slidesToShowMobile: 1,
            loop: true
        });
    }

    // Accommodation Carousel (single slide with dots)
    const accommodationCarousel = document.getElementById('accommodationCarousel');
    if (accommodationCarousel) {
        new Carousel(accommodationCarousel, {
            slidesToShow: 1,
            slidesToShowTablet: 1,
            slidesToShowMobile: 1,
            loop: true,
            autoplay: true,
            autoplaySpeed: 5000
        });
    }
});
