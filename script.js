/* Custom Upgraded JS for Mainak Saha's Academic Profile */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dark/Light Theme Switcher
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

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
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next
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
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 5. Accordion Functional Elements (Workshops / FDPs)
    // ==========================================
    const accHeaders = document.querySelectorAll('.acc-header');

    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accItem = header.parentElement;
            
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
                item.style.animation = 'none';
                item.offsetHeight; // trigger reflow
                item.style.animation = 'fadeIn 0.4s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-tab');
            filterPublications();
        });
    });

    let searchTimeout;
    pubSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterPublications();
        }, 150);
    });

    // ==========================================
    // 7. Contact Email Client Composer
    // ==========================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const emailTo = 'mainak.skms@gmail.com';
            const emailSubject = encodeURIComponent(`[Portfolio Query] ${subject}`);
            const emailBody = encodeURIComponent(
                `Hello Mainak,\n\nMy name is ${name}.\n\nMessage:\n${message}\n\nBest Regards,\n${name}`
            );

            window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
        });
    }

    // ==========================================
    // 8. Academic Ticker Infinite Loop Cloning
    // ==========================================
    const tickerTrack = document.getElementById('ticker-track');
    if (tickerTrack) {
        const items = Array.from(tickerTrack.children);
        
        items.forEach(item => {
            const clone = item.cloneNode(true);
            tickerTrack.appendChild(clone);
        });

        items.forEach(item => {
            const clone = item.cloneNode(true);
            tickerTrack.appendChild(clone);
        });
    }

    // ==========================================
    // 9. BibTeX Citation Modal & Copy to Clipboard
    // ==========================================
    const citeModal = document.getElementById('cite-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const bibtexCodeContent = document.getElementById('bibtex-code-content');
    const copyBibtexBtn = document.getElementById('copy-bibtex-btn');
    
    const citeButtons = document.querySelectorAll('.btn-cite, .btn-cite-trigger');

    function openCiteModal(bibtexData) {
        bibtexCodeContent.textContent = bibtexData.trim();
        citeModal.classList.add('active');
        citeModal.setAttribute('aria-hidden', 'false');
    }

    function closeCiteModal() {
        citeModal.classList.remove('active');
        citeModal.setAttribute('aria-hidden', 'true');
        
        const copyText = copyBibtexBtn.querySelector('span');
        const successIcon = copyBibtexBtn.querySelector('.copy-success-icon');
        copyText.textContent = "Copy Code";
        successIcon.style.display = "none";
    }

    // Use event delegation or loop to bind cite triggers
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('btn-cite') || target.classList.contains('btn-cite-trigger')) {
            e.stopPropagation();
            const bibtex = target.getAttribute('data-bibtex');
            if (bibtex) {
                openCiteModal(bibtex);
            }
        }
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeCiteModal);
    }

    if (citeModal) {
        citeModal.addEventListener('click', (e) => {
            if (e.target === citeModal) {
                closeCiteModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && citeModal.classList.contains('active')) {
                closeCiteModal();
            }
        });
    }

    if (copyBibtexBtn) {
        copyBibtexBtn.addEventListener('click', () => {
            const codeText = bibtexCodeContent.textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                const copyText = copyBibtexBtn.querySelector('span');
                const successIcon = copyBibtexBtn.querySelector('.copy-success-icon');
                
                copyText.textContent = "Copied!";
                successIcon.style.display = "inline-block";
                
                setTimeout(() => {
                    copyText.textContent = "Copy Code";
                    successIcon.style.display = "none";
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // ==========================================
    // 10. Smooth Stats Counter Animation
    // ==========================================
    const statsNums = document.querySelectorAll('.stat-num');
    
    if (statsNums.length > 0) {
        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const endVal = parseInt(targetEl.getAttribute('data-val'), 10);
                    let startVal = 0;
                    const duration = 1500; // ms
                    const startTime = performance.now();

                    function animateCount(timestamp) {
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const currentVal = Math.floor(progress * endVal);
                        
                        targetEl.textContent = currentVal + (endVal > 10 ? "+" : "");
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            targetEl.textContent = endVal + (endVal > 10 ? "+" : "");
                        }
                    }

                    requestAnimationFrame(animateCount);
                    observer.unobserve(targetEl);
                }
            });
        }, {
            threshold: 0.8
        });

        statsNums.forEach(el => countObserver.observe(el));
    }
});
