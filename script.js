/**
 * Mainak Saha — Academic Portfolio Script
 * Features: Theme toggle, nav scroll, IntersectionObserver reveals,
 * scrolling news duplication, publication filter+search, modal BibTeX cite
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. THEME TOGGLE
    // =========================================
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('ms-theme') || 'light';
    root.setAttribute('data-theme', savedTheme);

    themeBtn?.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('ms-theme', next);
    });

    // =========================================
    // 2. MOBILE NAV TOGGLE
    // =========================================
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger?.addEventListener('click', () => {
        navMenu?.classList.toggle('open');
    });

    // Close on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('open');
        });
    });

    // =========================================
    // 3. ACTIVE NAV LINK ON SCROLL
    // =========================================
    const sections = document.querySelectorAll('section[id], .content-section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const NAV_HEIGHT = 52;

    function setActiveNavLink() {
        let currentId = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= NAV_HEIGHT + 60) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink, { passive: true });
    setActiveNavLink();

    // =========================================
    // 4. SCROLL REVEAL (IntersectionObserver)
    // =========================================
    const revealEls = document.querySelectorAll('.reveal, .tl-item, .research-card, .pub-entry, .highlight-card, .service-card, .skill-group, .exp-table-wrap, .contact-info-block, .contact-social-block, .pub-filters, .pub-search-wrap');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Staggered delay based on position in a group
                const siblings = Array.from(entry.target.parentElement?.children || []);
                const i = siblings.indexOf(entry.target);
                const delay = Math.min(i * 70, 350);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));

    // =========================================
    // 5. ANIMATED COUNTING STATS
    // =========================================
    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-val') || '0');
        const duration = 1200;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }

        requestAnimationFrame(update);
    }

    const statEls = document.querySelectorAll('[data-val]');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statEls.forEach(el => statObserver.observe(el));

    // =========================================
    // 6. DUPLICATE NEWS TRACK FOR INFINITE SCROLL
    // =========================================
    const newsTrack = document.getElementById('news-track');
    if (newsTrack) {
        const original = newsTrack.innerHTML;
        newsTrack.innerHTML = original + original; // duplicate for seamless loop
    }

    // =========================================
    // 7. PUBLICATIONS — TAB FILTER + SEARCH
    // =========================================
    const pubTabs = document.querySelectorAll('.pub-tab');
    const pubEntries = document.querySelectorAll('.pub-entry');
    const pubSearchInput = document.getElementById('pub-search');

    let activeTab = 'all';
    let searchQuery = '';

    function filterPublications() {
        let visible = 0;
        const counts = { all: 0, journals: 0, conferences: 0, chapters: 0 };

        pubEntries.forEach(entry => {
            const cat = entry.getAttribute('data-cat') || '';
            const text = entry.textContent.toLowerCase();
            const tabMatch = activeTab === 'all' || cat === activeTab;
            const searchMatch = searchQuery === '' || text.includes(searchQuery);
            const show = tabMatch && searchMatch;

            entry.style.display = show ? '' : 'none';
            if (show) {
                counts.all++;
                if (counts[cat] !== undefined) counts[cat]++;
                if (!entry.classList.contains('visible')) {
                    entry.classList.add('visible');
                }
                visible++;
            }
        });

        // Update count badges
        const countAll = document.getElementById('count-all');
        const countJ = document.getElementById('count-journals');
        const countC = document.getElementById('count-conferences');
        const countCh = document.getElementById('count-chapters');
        if (countAll) countAll.textContent = counts.all;
        if (countJ) countJ.textContent = counts.journals;
        if (countC) countC.textContent = counts.conferences;
        if (countCh) countCh.textContent = counts.chapters;
    }

    pubTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            pubTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTab = btn.getAttribute('data-tab') || 'all';
            filterPublications();
        });
    });

    let searchTimeout;
    pubSearchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterPublications();
        }, 200);
    });

    filterPublications(); // initial run

    // =========================================
    // 8. BIBTEX CITATION MODAL
    // =========================================
    const modal = document.getElementById('cite-modal');
    const modalBibtex = document.getElementById('modal-bibtex-content');
    const modalClose = document.getElementById('modal-close');
    const modalCopyBtn = document.getElementById('modal-copy');

    function openModal(bibtex) {
        if (!modal || !modalBibtex) return;
        modalBibtex.textContent = bibtex.trim();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal?.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Attach to all cite buttons (publications + highlights)
    document.querySelectorAll('.pub-cite-btn, .btn-cite-trigger, .hl-cite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const bibtex = btn.getAttribute('data-bibtex') || '';
            openModal(bibtex);
        });
    });

    modalClose?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Copy bibtex to clipboard
    modalCopyBtn?.addEventListener('click', () => {
        const text = modalBibtex?.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
            if (modalCopyBtn) {
                const orig = modalCopyBtn.textContent;
                modalCopyBtn.textContent = '✓ Copied!';
                modalCopyBtn.classList.add('copied');
                setTimeout(() => {
                    modalCopyBtn.textContent = orig;
                    modalCopyBtn.classList.remove('copied');
                }, 2200);
            }
        }).catch(() => {
            // fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            modalCopyBtn.textContent = '✓ Copied!';
            setTimeout(() => { modalCopyBtn.textContent = 'Copy to Clipboard'; }, 2000);
        });
    });

    // =========================================
    // 9. SMOOTH SCROLL OFFSET FIX FOR NAV
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 12;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // =========================================
    // 10. INSTITUTION BANNER HIDE ON SCROLL
    // =========================================
    const instBanner = document.getElementById('institution-banner');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        if (!instBanner) return;
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            instBanner.style.transform = 'translateY(-100%)';
            instBanner.style.transition = 'transform 0.3s ease';
        } else {
            instBanner.style.transform = 'translateY(0)';
        }
        lastScrollY = scrollY;
    }, { passive: true });

});
