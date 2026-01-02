document.addEventListener('DOMContentLoaded', () => {
    // ================================
    // PERFORMANCE: THROTTLED SCROLL
    // ================================
    let ticking = false;
    const scrollCallbacks = [];

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                scrollCallbacks.forEach(cb => cb());
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // ================================
    // SCROLL REVEAL ANIMATIONS
    // ================================
    const sections = document.querySelectorAll('.section');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        sections.forEach(section => {
            if (!section.classList.contains('is-visible')) {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop < windowHeight * 0.85) {
                    section.classList.add('is-visible');
                }
            }
        });
    };

    scrollCallbacks.push(revealOnScroll);
    revealOnScroll(); // Run on load

    // ================================
    // SECTION FOCUS FADE EFFECT
    // ================================
    const headerOffset = 70;
    const viewportHeight = window.innerHeight;

    const handleSectionFocus = () => {
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionHeight = rect.height;
            const topPastHeader = headerOffset - rect.top;
            const percentPastHeader = topPastHeader / sectionHeight;

            let orangeGlow = 0;
            let blackFade = 0;

            if (rect.top < viewportHeight && rect.bottom > headerOffset) {
                if (rect.top > headerOffset) {
                    const distanceToHeader = rect.top - headerOffset;
                    const fadeInZone = viewportHeight * 0.4;
                    const fadeInProgress = 1 - Math.min(distanceToHeader / fadeInZone, 1);
                    orangeGlow = fadeInProgress * 0.15;
                } else if (percentPastHeader < 0.50) {
                    orangeGlow = 0.15;
                } else {
                    const fadeOutProgress = Math.min((percentPastHeader - 0.50) / 0.50, 1);
                    orangeGlow = 0.15 * (1 - fadeOutProgress);
                    blackFade = fadeOutProgress * 0.7;
                }
            }

            section.style.setProperty('--focus-glow', orangeGlow);
            section.style.setProperty('--fade-out', blackFade);
            section.classList.toggle('is-focused', orangeGlow > 0.05);
        });
    };

    scrollCallbacks.push(handleSectionFocus);
    handleSectionFocus();

    // ================================
    // ANIMATED NUMBER COUNTERS (Premium Animation)
    // ================================
    const counters = document.querySelectorAll('[data-count]');

    // Custom easing: slow start, fast middle, elegant deceleration at end
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = entry.target;
                const countTo = parseInt(target.dataset.count);
                const suffix = target.dataset.suffix || '';
                const prefix = target.dataset.prefix || '';
                const duration = 1800;
                const startTime = performance.now();

                target.classList.add('counted', 'counting');

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = easeOutExpo(progress);
                    const currentCount = Math.floor(easedProgress * countTo);

                    target.textContent = prefix + currentCount + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = prefix + countTo + suffix;
                        target.classList.remove('counting');
                        target.classList.add('count-complete');
                    }
                };

                requestAnimationFrame(updateCounter);
            }
        });
    }, { threshold: 0.6 });

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
        scrollCallbacks.push(toggleBackToTop);

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
    const allLangBtns = document.querySelectorAll('.lang-btn, .floating-lang__btn');
    let currentLang = 'en';

    const switchLanguage = (lang) => {
        currentLang = lang;

        // Update all button states (mobile menu and floating)
        allLangBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update all translatable elements (supports en, th, ru)
        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.dataset[lang];
            if (translation) {
                el.textContent = translation;
            }
        });

        // Update placeholder translations
        document.querySelectorAll('[data-placeholder-en]').forEach(el => {
            const placeholderKey = `placeholder${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
            const placeholder = el.dataset[placeholderKey];
            if (placeholder) {
                el.placeholder = placeholder;
            }
        });
    };

    // Add click handlers to all language buttons
    allLangBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });

    // ================================
    // FLOATING LANGUAGE SELECTOR VISIBILITY
    // ================================
    const floatingLang = document.getElementById('floatingLang');
    const heroSection = document.querySelector('.hero');

    const handleFloatingLangVisibility = () => {
        if (floatingLang && heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            const heroBottom = heroRect.bottom;

            // Hide floating language selector when hero is scrolled past
            if (heroBottom < 150) {
                floatingLang.classList.add('is-hidden');
            } else {
                floatingLang.classList.remove('is-hidden');
            }
        }
    };

    scrollCallbacks.push(handleFloatingLangVisibility);
    handleFloatingLangVisibility();

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

    const header = document.querySelector('.header');
    const headerHeight = 70;
    const scrollRange = 150;
    let previousBgType = 'light'; // Start as light because header bg is yellow initially
    let headerWipeComplete = false; // Track if header wipe animation is done
    let lastScrollY = 0; // Track scroll direction
    let currentHeaderColorState = 'light'; // Lock in the current header color state
    let initialWipeJustCompleted = false; // Track if we just finished the wipe

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

        // Track header wipe state
        if (header) {
            if (progress >= 1) {
                header.classList.add('is-scrolled');
                if (!headerWipeComplete) {
                    // Just completed wipe - set to dark (now over hero)
                    headerWipeComplete = true;
                    currentHeaderColorState = 'dark';
                    header.classList.add('on-dark');
                }
            } else {
                header.classList.remove('is-scrolled');
                header.classList.remove('on-dark', 'on-yellow', 'on-light');
                headerWipeComplete = false;
                currentHeaderColorState = 'light';
            }
        }

        // Get all ticket buttons
        const ticketBtns = header ? header.querySelectorAll('.btn--tickets, .btn--tickets-orange') : [];

        // PHASE 1: Header wipe transition (scroll 0 to scrollRange)
        // During this phase, transition from green (yellow header) to yellow (dark hero behind)
        if (!headerWipeComplete && header) {
            // Remove section-based classes during wipe
            header.classList.remove('on-yellow', 'on-dark', 'on-light');

            // Fill button with yellow as header wipes away (revealing dark hero)
            const fillPercent = progress * 100;
            ticketBtns.forEach(btn => {
                btn.style.setProperty('--btn-fill', `${fillPercent}%`);
                btn.style.color = fillPercent > 50 ? 'var(--color-bg-dark)' : '#ffffff';
            });

            // Transition burger color during wipe
            const burger = header.querySelector('.burger');
            if (burger) {
                if (progress > 0.5) {
                    burger.style.color = 'var(--color-accent)';
                } else {
                    burger.style.color = 'var(--color-primary-dark)';
                }
            }

            // Set previous type based on what we're transitioning to
            if (progress >= 1) {
                previousBgType = 'dark';
            }
            // Continue to process scroll indicator and footer (don't return)
        }

        // PHASE 2: Section-based color changes (after header wipe complete)
        // Simple opacity fade - no wipe animation
        else if (header && headerWipeComplete) {
            const scrollingDown = scrollY > lastScrollY;
            const headerBottom = headerHeight + 10;

            // Determine the background type of a section
            const getSectionBgType = (section) => {
                if (!section) return null;
                if (section.classList.contains('hero') || section.classList.contains('numbers') || section.classList.contains('experience') || section.classList.contains('newsletter') || section.classList.contains('partners')) {
                    return 'dark';
                } else if (section.classList.contains('about') || section.classList.contains('about-lineup') || section.classList.contains('lineup') || section.classList.contains('faq') || section.classList.contains('accommodation')) {
                    return 'light';
                }
                return null;
            };

            // Only check when scrolling DOWN
            if (scrollingDown) {
                // Find section entering from below
                const allSections = document.querySelectorAll('.section, .hero');
                let enteringSection = null;

                allSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top > 0 && rect.top < headerHeight + 40) {
                        enteringSection = section;
                    }
                });

                if (enteringSection) {
                    const newBgType = getSectionBgType(enteringSection);

                    if (newBgType && newBgType !== currentHeaderColorState) {
                        header.classList.remove('on-yellow', 'on-dark', 'on-light');

                        if (newBgType === 'dark') {
                            header.classList.add('on-dark');
                        } else if (enteringSection.classList.contains('accommodation')) {
                            header.classList.add('on-light');
                        } else {
                            header.classList.add('on-yellow');
                        }

                        currentHeaderColorState = newBgType;
                    }
                }
            }
            // Scrolling UP - snap to correct state
            else {
                const elementsAtPoint = document.elementsFromPoint(window.innerWidth / 2, headerBottom);

                for (const el of elementsAtPoint) {
                    if (el.classList.contains('section') || el.classList.contains('hero')) {
                        const bgType = getSectionBgType(el);

                        if (bgType && bgType !== currentHeaderColorState) {
                            header.classList.remove('on-yellow', 'on-dark', 'on-light');

                            if (bgType === 'dark') {
                                header.classList.add('on-dark');
                            } else if (el.classList.contains('accommodation')) {
                                header.classList.add('on-light');
                            } else {
                                header.classList.add('on-yellow');
                            }

                            currentHeaderColorState = bgType;
                        }
                        break;
                    }
                }
            }
        }

        // Update last scroll position
        lastScrollY = scrollY;

        // Scroll indicator line - scroll-based animation
        if (scrollIndicatorLine) {
            const scrollLineProgress = Math.min(scrollY / 200, 1);
            const linePosition = scrollLineProgress * 100;
            scrollIndicatorLine.style.setProperty('--line-progress', `${linePosition}%`);
        }

        // Sticky footer background detection
        if (stickyFooter) {
            const footerTop = window.innerHeight - 80; // Top of sticky footer
            const elementsAtFooter = document.elementsFromPoint(window.innerWidth / 2, footerTop);

            stickyFooter.classList.remove('on-light', 'on-dark');

            for (const el of elementsAtFooter) {
                if (el.classList.contains('section') || el.classList.contains('hero') || el.classList.contains('footer')) {
                    // Light backgrounds: about-lineup, accommodation, faq
                    if (el.classList.contains('about-lineup') || el.classList.contains('accommodation') || el.classList.contains('faq')) {
                        stickyFooter.classList.add('on-light');
                        break;
                    }
                    // Dark backgrounds: hero, numbers, experience, newsletter, partners, footer
                    else if (el.classList.contains('hero') || el.classList.contains('numbers') || el.classList.contains('experience') || el.classList.contains('newsletter') || el.classList.contains('partners') || el.classList.contains('footer')) {
                        stickyFooter.classList.add('on-dark');
                        break;
                    }
                    break;
                }
            }
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

    // ================================
    // SCROLL PROGRESS BAR
    // ================================
    const scrollProgress = document.getElementById('scrollProgress');

    const updateScrollProgress = () => {
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.height = `${scrollPercent}%`;

            // Calculate where the bottom of the progress bar is on the page
            const progressBarBottom = scrollPercent / 100 * window.innerHeight;
            const elementsAtProgress = document.elementsFromPoint(10, progressBarBottom);

            // Remove previous color classes
            scrollProgress.classList.remove('on-yellow', 'on-dark');

            // Find section at progress bar tip and set color
            for (const el of elementsAtProgress) {
                if (el.classList.contains('section') || el.classList.contains('hero')) {
                    if (el.classList.contains('hero')) {
                        scrollProgress.classList.add('on-dark');
                        break;
                    }
                    if (el.classList.contains('about') || el.classList.contains('about-lineup') || el.classList.contains('lineup') || el.classList.contains('faq')) {
                        scrollProgress.classList.add('on-yellow');
                        break;
                    } else if (el.classList.contains('numbers') || el.classList.contains('experience') || el.classList.contains('newsletter') || el.classList.contains('partners')) {
                        scrollProgress.classList.add('on-dark');
                        break;
                    } else if (el.classList.contains('accommodation')) {
                        scrollProgress.classList.add('on-yellow');
                        break;
                    }
                    break;
                }
            }
        }
    };

    scrollCallbacks.push(updateScrollProgress);
    updateScrollProgress();

    scrollCallbacks.push(handleWipeScroll);
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
        const countdownEl = document.getElementById('countdown');
        const countDate = new Date('January 23, 2026 15:00:00').getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        // Hide countdown if event has passed or gap is invalid
        if (gap <= 0) {
            if (countdownEl) countdownEl.style.display = 'none';
            return;
        }

        // Show countdown and update values
        if (countdownEl) countdownEl.style.display = '';

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
    };

    if (document.getElementById('days')) {
        countdown(); // Run immediately to set values before showing
        setInterval(countdown, 1000);
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

    // ================================
    // ACCOMMODATION FULLSCREEN SLIDER
    // ================================
    const accommodationSlider = document.getElementById('accommodationSlider');
    if (accommodationSlider) {
        const slides = accommodationSlider.querySelectorAll('.accommodation-slide');
        const dots = document.querySelectorAll('.accommodation-nav__dot');
        const prevBtn = document.querySelector('.accommodation-nav__arrow--prev');
        const nextBtn = document.querySelector('.accommodation-nav__arrow--next');
        let currentSlide = 0;
        const totalSlides = slides.length;

        const goToSlide = (index) => {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentSlide = index;

            // Slide the container
            accommodationSlider.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        // Arrow navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        accommodationSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        accommodationSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1); // Swipe left = next
                } else {
                    goToSlide(currentSlide - 1); // Swipe right = prev
                }
            }
        }, { passive: true });
    }
});
