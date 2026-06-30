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

            // 4. Re-fetch reviews when navigating to home or feedback
            if (targetView === 'home' || targetView === 'feedback') fetchReviews();
        });
    });

    // Reviews System
    const API = '/api/reviews';

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('');
    };

    const renderReviews = (reviews) => {
        const grid = document.getElementById('reviews-grid');
        if (!grid) return;
        if (reviews.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-16"><span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">rate_review</span><p class="text-on-surface-variant/50 text-lg">No reviews yet. Be the first to share your experience!</p></div>';
            return;
        }
        grid.innerHTML = reviews.map(r => `
            <div class="reveal bg-[#111] rounded-[2rem] p-8 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col">
                <div class="flex items-center gap-1 text-amber-400 text-lg mb-4">${renderStars(r.rating)}</div>
                <p class="text-white/70 text-sm leading-relaxed mb-6 flex-grow">"${r.message}"</p>
                <div class="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">${r.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="text-white font-bold text-sm">${r.name}</div>
                        <div class="text-on-surface-variant/50 text-[10px]">Verified Client</div>
                    </div>
                </div>
            </div>
        `).join('');
    };

    const renderHomeCarousel = (reviews) => {
        const track = document.getElementById('home-reviews-track');
        if (!track) return;
        if (reviews.length === 0) {
            track.innerHTML = '<div class="flex items-center gap-6 px-12 py-8 bg-[#111] rounded-[2rem] border border-white/5 mx-4" style="width: 400px;"><span class="material-symbols-outlined text-4xl text-on-surface-variant/30">rate_review</span><p class="text-on-surface-variant/50 whitespace-nowrap">No reviews yet — be the first!</p></div>';
            return;
        }
        const card = (r) => `
            <div class="bg-[#111] rounded-[2rem] p-8 border border-white/5 hover:border-white/10 transition-all duration-300 flex-shrink-0 mx-4" style="width: 360px;">
                <div class="flex items-center gap-1 text-amber-400 text-base mb-4">${renderStars(r.rating)}</div>
                <p class="text-white/70 text-sm leading-relaxed mb-6">"${r.message}"</p>
                <div class="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">${r.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="text-white font-bold text-sm">${r.name}</div>
                        <div class="text-on-surface-variant/50 text-[10px]">Verified Client</div>
                    </div>
                </div>
            </div>
        `;
        const cards = reviews.map(r => card(r)).join('');
        track.innerHTML = cards.repeat(6);
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) return [];
            const data = await res.json();
            renderReviews(data);
            renderHomeCarousel(data);
        } catch {
            renderReviews([]);
            renderHomeCarousel([]);
        }
    };

    fetchReviews();

    const starContainer = document.getElementById('star-rating');
    const ratingInput = document.getElementById('review-rating');
    if (starContainer && ratingInput) {
        const stars = starContainer.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.getAttribute('data-value'));
                ratingInput.value = value;
                stars.forEach((s, i) => s.textContent = i < value ? '★' : '☆');
            });
            star.addEventListener('mouseenter', () => {
                const value = parseInt(star.getAttribute('data-value'));
                stars.forEach((s, i) => s.textContent = i < value ? '★' : '☆');
            });
            star.addEventListener('mouseleave', () => {
                const current = parseInt(ratingInput.value);
                stars.forEach((s, i) => s.textContent = i < current ? '★' : '☆');
            });
        });
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value.trim();
            const rating = parseInt(document.getElementById('review-rating').value);
            const message = document.getElementById('review-message').value.trim();
            if (!name || !rating || !message) {
                alert('Please fill in all fields and select a rating.');
                return;
            }
            try {
                const res = await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, rating, message }),
                });
                if (!res.ok) throw new Error('Failed to submit');
                const reviews = await res.json();
                renderReviews(reviews);
                renderHomeCarousel(reviews);
            } catch {
                alert('Failed to submit review. Please try again.');
                return;
            }
            reviewForm.reset();
            document.getElementById('review-rating').value = 0;
            if (starContainer) starContainer.querySelectorAll('.star').forEach(s => s.textContent = '☆');
            const btn = reviewForm.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = 'Review Submitted!';
            btn.style.background = '#10b981';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        });
    }
});
