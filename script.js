/**
 * Mainak Saha — Academic Portfolio Script
 * Clean Minimal Edition
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // 1. MOBILE NAV TOGGLE
    // ===========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle?.addEventListener('click', () => {
        navMenu?.classList.toggle('open');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => navMenu?.classList.remove('open'));
    });

    // ===========================================
    // 2. ACTIVE NAV LINK ON SCROLL
    // ===========================================
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const NAV_H = 50;

    function updateActiveNav() {
        let current = '';
        sections.forEach(sec => {
            if (sec.getBoundingClientRect().top <= NAV_H + 60) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ===========================================
    // 3. SMOOTH SCROLL WITH OFFSET
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 8;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===========================================
    // 4. STAT COUNTER ANIMATION
    // ===========================================
    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-val') || '0');
        const dur = 1100;
        const start = performance.now();
        const update = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
    }

    const statObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { animateCount(e.target); statObs.unobserve(e.target); }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-val]').forEach(el => statObs.observe(el));

    // ===========================================
    // 5. DUPLICATE NEWS TRACK (infinite scroll)
    // ===========================================
    const newsTrack = document.getElementById('news-track');
    if (newsTrack) {
        newsTrack.innerHTML += newsTrack.innerHTML;
    }

    // ===========================================
    // 6. PUBLICATION FILTER + SEARCH
    // ===========================================
    const tabs    = document.querySelectorAll('.ptab');
    const entries = document.querySelectorAll('.pub-item[data-cat]');
    const search  = document.getElementById('pub-search');

    let activeTab = 'all';
    let query = '';

    function filterPubs() {
        entries.forEach(item => {
            const cat = item.getAttribute('data-cat') || '';
            const txt = item.textContent.toLowerCase();
            const show = (activeTab === 'all' || cat === activeTab) &&
                         (query === '' || txt.includes(query));
            item.style.display = show ? '' : 'none';
        });
    }

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTab = btn.getAttribute('data-tab') || 'all';
            filterPubs();
        });
    });

    let st;
    search?.addEventListener('input', e => {
        clearTimeout(st);
        st = setTimeout(() => {
            query = e.target.value.toLowerCase().trim();
            filterPubs();
        }, 180);
    });

    filterPubs();

    // ===========================================
    // 7. BIBTEX MODAL
    // ===========================================
    const modal     = document.getElementById('cite-modal');
    const bibtexEl  = document.getElementById('modal-bibtex');
    const closeBtn  = document.getElementById('modal-close');
    const copyBtn   = document.getElementById('modal-copy');

    const openModal = (bib) => {
        if (!modal || !bibtexEl) return;
        bibtexEl.textContent = bib.trim();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal?.classList.remove('open');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.pub-link-cite').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.getAttribute('data-bibtex') || ''));
    });

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    copyBtn?.addEventListener('click', () => {
        const text = bibtexEl?.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
            if (copyBtn) {
                const orig = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied to Clipboard';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = orig;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        }).catch(() => {
            const ta = Object.assign(document.createElement('textarea'), {
                value: text,
                style: 'position:fixed;opacity:0'
            });
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 2000);
        });
    });

    // ===========================================
    // 8. SCROLL REVEAL
    // ===========================================
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ===========================================
    // 9. EMAIL COPY FALLBACK
    // ===========================================
    document.querySelectorAll('.email-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default mailto: action on systems without mail client
            // We can let the user know we copied it. We don't call e.preventDefault()
            // to allow normal mail client launch if configured, but we still copy it.
            const email = 'mainak.skms@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                // Remove any existing tooltips
                document.querySelectorAll('.email-tooltip').forEach(t => t.remove());

                // Create a temporary tooltip/bubble
                const tooltip = document.createElement('div');
                tooltip.className = 'email-tooltip';
                tooltip.textContent = 'Email copied to clipboard!';
                document.body.appendChild(tooltip);

                // Position tooltip near the clicked element
                const rect = link.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 38}px`;

                setTimeout(() => tooltip.classList.add('show'), 10);
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => tooltip.remove(), 250);
                }, 2000);
            });
        });
    });

});

