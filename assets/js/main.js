// Preloader Sequence Script
(function () {
    const preloader = document.querySelector('.pc-root');
    if (!preloader) return;

    const starsEl = document.getElementById('stars');
    if (starsEl) {
        for (let i = 0; i < 60; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 70}%;--d:${2 + Math.random() * 4}s;--dl:${Math.random() * 4}s;--op:${0.3 + Math.random() * 0.5}`;
            starsEl.appendChild(s);
        }
    }
    const sequence = ['lobby', 'f1', 'f2', 'f3', 'f4', 'f5', 'roof'];
    const totalSteps = sequence.length;
    let step = 0,
        pct = 0;
    const progEl = document.getElementById('prog');
    const pctEl = document.getElementById('pct');
    const sl = document.getElementById('sl');
    const sr = document.getElementById('sr');
    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    function resetAll() {
        sequence.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.transition = 'none';
            el.style.opacity = '0';
            el.style.transform =
                id === 'lobby' ? 'translateY(10px)' : 'translateY(16px)';
        });
        if (sl) sl.style.height = '0px';
        if (sr) sr.style.height = '0px';
        pct = 0;
        if (progEl) progEl.style.width = '0%';
        if (pctEl) pctEl.textContent = '0%';
        for (let i = 0; i < 5; i++) {
            const d = document.getElementById('d' + i);
            if (d) d.classList.remove('active');
        }
    }
    function showStep(idx) {
        const el = document.getElementById(sequence[idx]);
        if (!el) return;
        el.style.transition =
            'opacity 0.25s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        const scaffH = (idx + 1) * 30;
        if (sl && sr) {
            sl.style.transition = sr.style.transition = 'height 0.2s ease';
            sl.style.height = sr.style.height = scaffH + 'px';
        }
        const dotIdx = Math.floor((idx * 5) / totalSteps);
        for (let i = 0; i <= dotIdx; i++) {
            const d = document.getElementById('d' + i);
            if (d) d.classList.add('active');
        }
    }
    function animatePct(target, duration, cb) {
        const startVal = pct,
            startTime = performance.now();
        function tick(now) {
            const t = Math.min((now - startTime) / duration, 1);
            pct = Math.round(startVal + (target - startVal) * easeOut(t));
            if (progEl) progEl.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
            if (t < 1) requestAnimationFrame(tick);
            else {
                pct = target;
                if (cb) cb();
            }
        }
        requestAnimationFrame(tick);
    }
    function runSequence() {
        step = 0;
        resetAll();
        function nextStep() {
            if (step >= totalSteps) {
                // Reached 100%, wait a moment and fade out loader
                setTimeout(() => {
                    const rootEl = document.querySelector('.pc-root');
                    if (rootEl) {
                        rootEl.classList.add('fade-out');
                        document.body.classList.remove('loading');
                        document.dispatchEvent(
                            new CustomEvent('preloaderComplete')
                        );
                        // Optional: remove loader from DOM after transition finishes
                        setTimeout(() => {
                            rootEl.remove();
                        }, 250);
                    }
                }, 200);
                return;
            }
            const targetPct = Math.round(((step + 1) / totalSteps) * 100);
            showStep(step);
            step++;
            animatePct(targetPct, 120, () => setTimeout(nextStep, 80));
        }
        setTimeout(nextStep, 120);
    }

    // Start loader sequence once DOM content is ready or run immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runSequence);
    } else {
        runSequence();
    }
})();

// Construction-themed cursor
(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'construction-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="construction-cursor__tool">\u25CF</span>';
    document.body.appendChild(cursor);

    let visible = false;

    function update(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        if (!visible) {
            visible = true;
            cursor.classList.add('is-visible');
        }
    }

    // Scale up and change cursor color on hover of interactive elements
    function handleMouseOver(e) {
        const target = e.target;
        if (
            target &&
            (target.closest('a') ||
                target.closest('button') ||
                target.closest('.swiper-btn-next') ||
                target.closest('.swiper-btn-prev') ||
                target.closest('.swiper-pagination-bullet') ||
                target.closest('.nav-item') ||
                target.closest('input[type="submit"]') ||
                target.closest('input[type="button"]'))
        ) {
            cursor.classList.add('is-hovering');
        }
    }

    function handleMouseOut(e) {
        const target = e.target;
        if (
            target &&
            (target.closest('a') ||
                target.closest('button') ||
                target.closest('.swiper-btn-next') ||
                target.closest('.swiper-btn-prev') ||
                target.closest('.swiper-pagination-bullet') ||
                target.closest('.nav-item') ||
                target.closest('input[type="submit"]') ||
                target.closest('input[type="button"]'))
        ) {
            cursor.classList.remove('is-hovering');
        }
    }

    window.addEventListener('mousemove', update, { passive: true });
    window.addEventListener(
        'mouseleave',
        () => {
            visible = false;
            cursor.classList.remove('is-visible');
        },
        { passive: true }
    );
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
})();

// Header Navigation Behavior (Scroll Shadow)
(function () {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// GSAP / ScrollTrigger transitions for landing components
(function () {
    if (typeof gsap === 'undefined') return;

    // Register ScrollTrigger if loaded
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Play Hero stagger animation on preloader complete
    document.addEventListener('preloaderComplete', () => {
        gsap.from(
            '.hero-cyber__tag, .hero-cyber__title, .hero-cyber__text, .hero-cyber__actions, .hero-cyber__stat-item',
            {
                opacity: 0,
                y: 35,
                duration: 0.95,
                stagger: 0.16,
                ease: 'power3.out',
            }
        );

        gsap.from('.hero-cyber__visual', {
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: 'power2.out',
        });
    });

    // Check if ScrollTrigger is available for scroll-based animations
    if (typeof ScrollTrigger !== 'undefined') {
        // About Section Text & Pillars stagger
        gsap.from('.about-company__pillar', {
            scrollTrigger: {
                trigger: '.about-company__pillars',
                start: 'top 88%',
            },
            opacity: 0,
            y: 25,
            duration: 0.7,
            stagger: 0.18,
            ease: 'power2.out',
        });

        // Blueprint background visual parallax entrance
        gsap.fromTo(
            '.about-company__photo-frame',
            {
                y: 60,
                opacity: 0,
            },
            {
                scrollTrigger: {
                    trigger: '.about-company__photo-wrapper',
                    start: 'top 88%',
                },
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
            }
        );

        // Services Showcase panels stagger entrance
        gsap.from('.services-showcase__panel', {
            scrollTrigger: {
                trigger: '.services-showcase__accordion',
                start: 'top 88%',
            },
            opacity: 0,
            y: 35,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
        });
    }
})();

// Projects Showcase Interactive Hover/Click Tab Controller
(function () {
    const navItems = document.querySelectorAll('.projects-showcase__nav-item');
    const imageWrappers = document.querySelectorAll(
        '.projects-showcase__image-wrapper'
    );

    if (!navItems.length || !imageWrappers.length) return;

    function activateProject(item) {
        const targetProj = item.getAttribute('data-project');
        if (!targetProj) return;

        // Deactivate current active nav item and image wrapper
        document
            .querySelector('.projects-showcase__nav-item.active')
            ?.classList.remove('active');
        document
            .querySelector('.projects-showcase__image-wrapper.active')
            ?.classList.remove('active');

        // Activate target elements
        item.classList.add('active');
        const targetImg = document.querySelector(
            `.projects-showcase__image-wrapper[data-project="${targetProj}"]`
        );
        if (targetImg) {
            targetImg.classList.add('active');
        }
    }

    navItems.forEach((item) => {
        item.addEventListener('mouseenter', () => activateProject(item));
        item.addEventListener('click', () => activateProject(item));
    });
})();

// Technical Stats Counter Animation (staged on preloader completion)
(function () {
    function animateStats() {
        const stats = document.querySelectorAll('.hero-cyber__stat-val');
        stats.forEach((stat) => {
            const target = parseInt(
                stat.getAttribute('data-target') || '0',
                10
            );
            const suffix = stat.getAttribute('data-suffix') || '';

            if (stat.timerId) {
                clearInterval(stat.timerId);
            }

            let count = 0;
            const duration = 1500; // 1.5 seconds
            const steps = 50;
            const stepVal = target / steps;
            const interval = duration / steps;

            let currentStep = 0;
            stat.timerId = setInterval(() => {
                currentStep++;
                count += stepVal;

                if (currentStep >= steps) {
                    clearInterval(stat.timerId);
                    stat.timerId = null;
                    stat.textContent = target + suffix;
                } else {
                    stat.textContent = Math.floor(count) + suffix;
                }
            }, interval);
        });
    }

    // Trigger on preloader complete or DOM load if no preloader is present
    const hasPreloader = document.querySelector('.pc-root');
    if (hasPreloader) {
        document.addEventListener('preloaderComplete', () => {
            setTimeout(animateStats, 300);
        });
    } else {
        window.addEventListener('DOMContentLoaded', animateStats);
    }
})();

// Hero Grid Glow Mouse Tracker
(function () {
    const hero = document.querySelector('.hero-cyber');
    const orb = document.querySelector('.hero-cyber__grid-glow-orb');
    if (!hero || !orb) return;

    hero.addEventListener(
        'mousemove',
        (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            orb.style.animation = 'none';
            orb.style.left = `${x}px`;
            orb.style.top = `${y}px`;
        },
        { passive: true }
    );

    hero.addEventListener(
        'mouseleave',
        () => {
            orb.style.animation =
                'gridGlowOrbAnim 15s infinite alternate ease-in-out';
        },
        { passive: true }
    );
})();

// Testimonials Swiper Carousel
(function () {
    const swiperContainer = document.querySelector('.testimonials-swiper');
    if (!swiperContainer || typeof Swiper === 'undefined') return;

    new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-btn-next',
            prevEl: '.swiper-btn-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
})();

// Bottom to Top Scroll Arrow with progress indicator
(function () {
    // 1. Create and inject scroll to top button dynamically
    const btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.className = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('title', 'Scroll to top');

    btn.innerHTML = `
        <svg class="scroll-to-top__progress" width="50" height="50" viewBox="0 0 50 50">
            <circle class="scroll-to-top__circle-bg" cx="25" cy="25" r="21" fill="none" stroke-width="3"></circle>
            <circle class="scroll-to-top__circle-progress" cx="25" cy="25" r="21" fill="none" stroke-width="3" stroke-dasharray="132" stroke-dashoffset="132"></circle>
        </svg>
        <div class="scroll-to-top__arrow">
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
        </div>
    `;

    document.body.appendChild(btn);

    const progressCircle = btn.querySelector('.scroll-to-top__circle-progress');
    const pathLength = 132;

    // 2. Update progress indicator and handle visibility
    function updateScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        // Show/hide button based on scroll position
        if (scrollTop > 300) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }

        // Calculate progress percentage and stroke-dashoffset
        if (docHeight > 0) {
            const scrollPercent = scrollTop / docHeight;
            const drawLength = pathLength * scrollPercent;
            progressCircle.style.strokeDashoffset = (
                pathLength - drawLength
            ).toString();
        } else {
            progressCircle.style.strokeDashoffset = pathLength.toString();
        }
    }

    // 3. Smooth scroll to top on click
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    // 4. Attach scroll event listener with passive option
    window.addEventListener('scroll', updateScroll, { passive: true });

    // Initial run to check position on load
    updateScroll();
})();

// Contact Form Submission & Validation Handler
(function () {
    const form = document.getElementById('js-contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('form-submit-btn');
    const successMsg = document.getElementById('form-success-msg');
    const errorMsg = document.getElementById('form-error-msg');

    // File upload label update
    const fileInput = document.getElementById('form-file');
    const fileLabelText = form.querySelector('.file-label-text');

    if (fileInput && fileLabelText) {
        fileInput.addEventListener('change', function () {
            if (fileInput.files.length > 0) {
                fileLabelText.textContent = fileInput.files[0].name;
            } else {
                fileLabelText.textContent = 'Choose file or drag here';
            }
        });
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Reset display of alert messages
        successMsg.classList.add('d-none');
        errorMsg.classList.add('d-none');

        // Check if form is valid using HTML5 validation
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        form.classList.add('was-validated');

        // Disable button to prevent duplicate submissions and show loading state
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <span>Submitting Inquiry...</span>
            <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
        `;

        try {
            // Collect form data for structured logging
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Simulate API request delay (e.g., 1.5 seconds)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Form submission successful

            // Show success message and reset the form
            successMsg.classList.remove('d-none');
            form.reset();
            if (fileLabelText) {
                fileLabelText.textContent = 'Choose file or drag here';
            }
            form.classList.remove('was-validated');
        } catch (error) {
            console.error('Failed to submit contact inquiry:', error);
            errorMsg.classList.remove('d-none');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
})();

// Portfolio Projects Filter & Sliders Integration
(function () {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project-card-item');

    // Only run if we are on the projects page / elements exist
    if (filterBtns.length > 0 && projectItems.length > 0) {
        filterBtns.forEach((btn) => {
            btn.addEventListener('click', function () {
                filterBtns.forEach((b) => b.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                projectItems.forEach((item) => {
                    if (
                        filterValue === 'all' ||
                        item.getAttribute('data-category') === filterValue
                    ) {
                        item.classList.remove('project-card-item--hidden');
                    } else {
                        item.classList.add('project-card-item--hidden');
                    }
                });

                // Resize event forces Swiper updates in case layout sizes shifted
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    // Initialize Swiper Sliders for Projects
    const sliders = document.querySelectorAll('.blueprint-slider');
    if (sliders.length > 0 && typeof Swiper !== 'undefined') {
        sliders.forEach((slider, idx) => {
            // Prevent default browser navigation by attaching direct listener to the links
            slider.querySelectorAll('a.glightbox').forEach((link) => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                });
            });

            new Swiper(slider, {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                navigation: {
                    nextEl: slider.querySelector('.blueprint-slider__next'),
                    prevEl: slider.querySelector('.blueprint-slider__prev'),
                },
                pagination: {
                    el: slider.querySelector('.blueprint-slider__pagination'),
                    clickable: true,
                },
                on: {
                    click: function (swiper, event) {
                        // Prevent GLightbox trigger if the click event is part of dragging
                        if (!swiper.allowClick) {
                            return;
                        }

                        // Check if we clicked on a slide
                        if (!swiper.clickedSlide) {
                            return;
                        }

                        // Check if clicked slide contains the glightbox link
                        const link =
                            swiper.clickedSlide.querySelector('a.glightbox');
                        if (!link) {
                            return;
                        }

                        if (event) {
                            event.preventDefault();
                        }

                        // Gather unique slides in this slider
                        const uniqueLinks = Array.from(
                            slider.querySelectorAll(
                                '.swiper-slide:not(.swiper-slide-duplicate) a.glightbox'
                            )
                        );

                        const elements = uniqueLinks.map((a) => {
                            let title = '';
                            let description = '';
                            const glightboxAttr =
                                a.getAttribute('data-glightbox');
                            if (glightboxAttr) {
                                const titleMatch =
                                    glightboxAttr.match(/title:\s*([^;]+)/i);
                                const descMatch = glightboxAttr.match(
                                    /description:\s*([^;]+)/i
                                );
                                if (titleMatch) title = titleMatch[1].trim();
                                if (descMatch)
                                    description = descMatch[1].trim();
                            }
                            return {
                                href: a.getAttribute('href'),
                                type: 'image',
                                title: title,
                                description: description,
                            };
                        });

                        const activeIndex =
                            swiper.clickedIndex !== undefined
                                ? swiper.clickedIndex
                                : swiper.activeIndex;

                        // Open GLightbox programmatically
                        const projectLightbox = GLightbox({
                            elements: elements,
                            touchNavigation: true,
                            loop: true,
                            openEffect: 'zoom',
                            closeEffect: 'zoom',
                            slideEffect: 'slide',
                        });

                        projectLightbox.on('close', () => {
                            projectLightbox.destroy();
                        });

                        projectLightbox.openAt(activeIndex);
                    },
                },
            });
        });
    }

    // Initialize GLightbox globally for non-swiper elements if any exist
    if (typeof GLightbox !== 'undefined') {
        GLightbox({
            selector: '.glightbox-global',
            touchNavigation: true,
            loop: true,
            openEffect: 'zoom',
            closeEffect: 'zoom',
            slideEffect: 'slide',
        });
    }

    // Legal Page Scroll Spy
    const legalNav = document.querySelector('.legal-nav');
    if (legalNav) {
        const navLinks = legalNav.querySelectorAll('.legal-nav__link');
        const sections = Array.from(
            document.querySelectorAll('.legal-content section[id]')
        );

        function updateActiveLink() {
            if (window.getComputedStyle(legalNav).display === 'none') {
                return;
            }

            let activeSection = null;
            const scrollPos = window.scrollY + 130; // site header height + offset

            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 50
            ) {
                activeSection = sections[sections.length - 1];
            } else {
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    const sectionTop =
                        section.getBoundingClientRect().top + window.scrollY;
                    if (sectionTop <= scrollPos) {
                        activeSection = section;
                    }
                }
            }

            if (!activeSection && sections.length > 0) {
                activeSection = sections[0];
            }

            if (activeSection) {
                const id = activeSection.getAttribute('id');
                navLinks.forEach((link) => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        }

        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    updateActiveLink();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        // Instant click highlighting
        navLinks.forEach((link) => {
            link.addEventListener('click', function () {
                navLinks.forEach((l) => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        updateActiveLink();
        window.addEventListener('load', updateActiveLink);
    }
})();
