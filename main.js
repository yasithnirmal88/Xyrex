import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP Initialization
    gsap.registerPlugin(ScrollTrigger);

    // 2. Cinematic Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.2, 
                ease: "expo.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 3. Count-up Animation for Stats
    const stats = document.querySelectorAll('.impact-stat-value');
    stats.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const suffix = stat.getAttribute('data-suffix') || '';
        
        gsap.to(stat, {
            innerText: target,
            duration: 2.5,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: stat,
                start: "top 90%"
            },
            onUpdate: function() {
                this.targets()[0].innerText = Math.ceil(this.targets()[0].innerText) + suffix;
            }
        });
    });

    // 4. Advanced Magnetic Buttons
    const magnets = document.querySelectorAll('.magnetic-btn, .nav-link, a.bg-white');
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(magnet, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 5. Section Mouse Parallax (About & Services)
    const parallaxContainers = document.querySelectorAll('#about, #services');
    parallaxContainers.forEach(container => {
        const items = container.querySelectorAll('.parallax-card, .reveal');
        
        container.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (clientX - centerX) / 50;
            const moveY = (clientY - centerY) / 50;

            items.forEach((item, index) => {
                const depth = (index + 1) * 0.2;
                gsap.to(item, {
                    x: moveX * depth,
                    y: moveY * depth,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        });
    });

    // 6. Luxury Card Interactive Glow
    document.querySelectorAll('.luxury-glass').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // 7. SPA Multi-View Routing & Mobile Menu
    const navBtns = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
    const sections = document.querySelectorAll('section[data-view]');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileClose = document.getElementById('mobile-menu-close');

    const toggleMobileMenu = (open) => {
        if (open) {
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }
    };

    mobileToggle?.addEventListener('click', () => toggleMobileMenu(true));
    mobileClose?.addEventListener('click', () => toggleMobileMenu(false));

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = btn.getAttribute('data-target');

            // Close mobile menu if open
            toggleMobileMenu(false);

            // 1. Update Navigation Visuals
            navBtns.forEach(b => {
                b.classList.remove('text-white');
                b.classList.add('text-on-surface-variant');
            });
            btn.classList.add('text-white');
            btn.classList.remove('text-on-surface-variant');

            // 2. Crossfade View Elements (Sections and Individual Components)
            const viewElements = document.querySelectorAll('[data-view]');
            viewElements.forEach(el => {
                const viewsStr = el.getAttribute('data-view');
                const views = viewsStr ? viewsStr.split(' ') : [];
                
                if(views.includes(targetView)) {
                    el.classList.remove('hidden');
                    // Add block if it's a section, otherwise let its default display rule take over
                    if (el.tagName === 'SECTION') {
                        el.classList.add('block');
                    }
                    // Trigger animation for newly visible elements
                    if (el.classList.contains('reveal') || el.tagName === 'SECTION') {
                        gsap.fromTo(el, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                    }
                } else {
                    if (el.tagName === 'SECTION') {
                        el.classList.remove('block');
                    }
                    el.classList.add('hidden');
                }
            });

            // 3. Re-calculate Parallax and Triggers
            window.scrollTo(0, 0);
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 50);
        });
    });
});
