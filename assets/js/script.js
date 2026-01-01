document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Mobile Menu
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            const isActive = mobileMenu.classList.contains('is-active');
            
            if (isActive) {
                mobileMenu.classList.remove('is-active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                mobileMenu.classList.add('is-active');
                burger.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // Countdown Timer
    const countdown = () => {
        const countDate = new Date('April 15, 2026 00:00:00').getTime();
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

            const dayEl = document.getElementById('days');
            const hourEl = document.getElementById('hours');
            const minEl = document.getElementById('minutes');

            if (dayEl) dayEl.innerText = textDay < 10 ? '0' + textDay : textDay;
            if (hourEl) hourEl.innerText = textHour < 10 ? '0' + textHour : textHour;
            if (minEl) minEl.innerText = textMinute < 10 ? '0' + textMinute : textMinute;
        }
    };

    // Run countdown every second if countdown elements exist
    if (document.getElementById('days')) {
        setInterval(countdown, 1000);
        countdown(); // Run immediately on load
    }
});
