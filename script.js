/* Custom JS for Mainak Saha's Academic Portfolio */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dark/Light Theme Switcher
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check for saved theme preference; default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================
    // 2. Mobile Menu Navigation Toggler
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 3. Typing Effect in Hero Section
    // ==========================================
    const typingSpan = document.querySelector('.typing-text');
    const words = ["AI & Deep Learning", "Computer Vision", "Pattern Recognition", "Image Processing"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            // Add character
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // typing speed
        }

        // Cycle control
        if (!isDeleting && charIndex === currentWord.length) {
            // Finished typing word, wait before deleting
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingSpan) {
        typeEffect();
    }

    // ==========================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 5. Accordion Functional Elements (Workshops / FDPs)
    // ==========================================
    const accHeaders = document.querySelectorAll('.acc-header');

    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accItem = header.parentElement;
            
            // Close other items if desired (exclusive accordion behavior)
            // Comment out to allow multiple open accordions
            document.querySelectorAll('.acc-item').forEach(item => {
                if (item !== accItem) {
                    item.classList.remove('active');
                }
            });

            accItem.classList.toggle('active');
        });
    });

    // ==========================================
    // 6. Publications Hub Filter and Search Logic
    // ==========================================
    const pubSearch = document.getElementById('pub-search');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const pubItems = document.querySelectorAll('.pub-item');

    let currentCategory = 'all';
    let searchQuery = '';

    function filterPublications() {
        pubItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const title = item.querySelector('.pub-title').textContent.toLowerCase();
            const authors = item.querySelector('.pub-authors').textContent.toLowerCase();
            const venue = item.querySelector('.pub-venue').textContent.toLowerCase();
            
            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = (title.includes(searchQuery) || authors.includes(searchQuery) || venue.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                item.style.display = 'flex';
                // Trigger a small animation re-entry
                item.style.animation = 'none';
                item.offsetHeight; // trigger reflow
                item.style.animation = 'fadeIn 0.4s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Tab buttons event listener
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-tab');
            filterPublications();
        });
    });

    // Search input listener with simple debounce
    let searchTimeout;
    pubSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterPublications();
        }, 150);
    });

    // ==========================================
    // 7. Contact Email Client-composer Composer
    // ==========================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Generate mailto link parameters
            const emailTo = 'mainak.skms@gmail.com';
            const emailSubject = encodeURIComponent(`[Portfolio Query] ${subject}`);
            const emailBody = encodeURIComponent(
                `Hello Mainak,\n\nMy name is ${name}.\n\nMessage:\n${message}\n\nBest Regards,\n${name}`
            );

            // Open user's default email composer
            window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
        });
    }
});
