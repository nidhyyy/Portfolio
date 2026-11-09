// Portfolio Interactive Features & Animations
document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambient Background Glow Blobs
  if (!document.querySelector('.ambient-background')) {
    const ambientBg = document.createElement('div');
    ambientBg.className = 'ambient-background';
    ambientBg.setAttribute('aria-hidden', 'true');
    ambientBg.innerHTML = `
      <div class="ambient-blob ambient-blob-1"></div>
      <div class="ambient-blob ambient-blob-2"></div>
      <div class="ambient-blob ambient-blob-3"></div>
    `;
    document.body.prepend(ambientBg);
  }

  // 2. Scroll-triggered Reveal Animations (IntersectionObserver)
  const revealTargets = document.querySelectorAll(
    '.section, .work-card, .info-panel, .contact, .page-intro, .block, .skill-group, .two-col'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    revealTargets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });
  }

  // 3. Smart Sticky Header (Auto-hide on Scroll Down, Reveal on Scroll Up + Glassmorphism)
  const header = document.querySelector('header');
  if (header) {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = 6;

    window.addEventListener(
      'scroll',
      () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Toggle glassmorphic scrolled style
        if (currentScrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        // Auto-hide navigation logic
        if (Math.abs(lastScrollY - currentScrollY) > scrollDelta) {
          if (currentScrollY > lastScrollY && currentScrollY > 90) {
            header.classList.add('nav-hidden');
          } else {
            header.classList.remove('nav-hidden');
          }
          lastScrollY = Math.max(0, currentScrollY);
        }
      },
      { passive: true }
    );
  }

  // 4. Interactive Resume Download Feedback Simulation
  const resumeLinks = document.querySelectorAll(
    'a[download*="Resume"], a[download*="resume"], a[href$="resume.pdf"]'
  );

  resumeLinks.forEach(link => {
    link.addEventListener('click', e => {
      // Allow default only if already downloading
      if (link.dataset.downloading === 'true') return;
      e.preventDefault();
      link.dataset.downloading = 'true';

      const originalHTML = link.innerHTML;
      link.innerHTML = '<span class="download-spinner" aria-hidden="true"></span> Preparing PDF...';
      link.style.pointerEvents = 'none';

      setTimeout(() => {
        link.innerHTML = '✓ Downloaded Successfully';

        // Trigger real file download
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = 'resume.pdf';
        downloadAnchor.download = 'Nidhi_Savita_Resume.pdf';
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        setTimeout(() => {
          link.innerHTML = originalHTML;
          link.style.pointerEvents = '';
          link.dataset.downloading = 'false';
        }, 2600);
      }, 850);
    });
  });

  // 5. Floating "Back to Top" Button
  let backToTopBtn = document.querySelector('.back-to-top-floating');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top-floating';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 320) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Project Category Filtering with Smooth Transition
  const filterBtns = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('[data-category]');
  const countDisplay = document.querySelector('#project-count');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(x => {
        x.classList.toggle('active', x === btn);
        x.setAttribute('aria-pressed', String(x === btn));
      });

      const selectedFilter = btn.dataset.filter;
      let visibleCount = 0;

      projectCards.forEach(card => {
        const matches = selectedFilter === 'all' || card.dataset.category === selectedFilter;
        if (matches) {
          card.hidden = false;
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
          visibleCount++;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            if (card.dataset.category !== selectedFilter && selectedFilter !== 'all') {
              card.hidden = true;
            }
          }, 200);
        }
      });

      if (countDisplay) {
        countDisplay.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
      }
    });
  });

  // 7. Clipboard Copy Helper
  async function copyText(text, statusEl) {
    if (!statusEl) return;
    try {
      await navigator.clipboard.writeText(text);
      statusEl.textContent = 'Copied to clipboard.';
    } catch {
      statusEl.textContent = 'Copy is unavailable here. Please select and copy manually.';
    }
  }

  document.querySelector('#copy-email')?.addEventListener('click', () => {
    copyText('nidhisavita2006@gmail.com', document.querySelector('#copy-status'));
  });

  // 8. Contact Form Draft Generator
  document.querySelector('#contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `Hello Nidhi,\n\n${f.get('message')}\n\nFrom: ${f.get('name')}\nEmail: ${f.get('email')}`;
    const draftTextarea = document.querySelector('#draft');
    const emailLink = document.querySelector('#email-link');
    const draftResult = document.querySelector('#draft-result');

    if (draftTextarea) draftTextarea.value = body;
    if (emailLink) {
      emailLink.href =
        'mailto:nidhisavita2006@gmail.com?subject=' +
        encodeURIComponent('Portfolio inquiry from ' + f.get('name')) +
        '&body=' +
        encodeURIComponent(body);
    }
    if (draftResult) draftResult.hidden = false;
  });

  document.querySelector('#copy-draft')?.addEventListener('click', () => {
    const draft = document.querySelector('#draft');
    if (draft) copyText(draft.value, document.querySelector('#draft-copy-status'));
  });

  // 9. Arrow Symbol (↗) to SVG Replacement
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.parentElement.tagName !== 'SCRIPT' && walker.currentNode.textContent.includes('↗')) {
      nodes.push(walker.currentNode);
    }
  }
  for (const n of nodes) {
    const frag = document.createDocumentFragment();
    n.textContent.split('↗').forEach((t, i) => {
      if (i) {
        const span = document.createElement('span');
        span.innerHTML =
          '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 19L19 5M5 5h14v14"/></svg>';
        span.style.display = 'inline-flex';
        span.style.verticalAlign = 'middle';
        span.style.marginLeft = '2px';
        frag.append(span);
      }
      frag.append(document.createTextNode(t));
    });
    n.replaceWith(frag);
  }
});
