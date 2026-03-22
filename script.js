document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in-section');
    const nav = document.querySelector('nav');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Navbar scroll behavior (Glassmorphic + Auto-Hide)
    let lastScrollTop = 0;
    const scrollThreshold = 5;
    
    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // 1. Glassmorphic effect on scroll
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // 2. Smart Hide/Show logic
        if (Math.abs(lastScrollTop - currentScroll) <= scrollThreshold) return;
        
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling Down - Hide Nav
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling Up - Show Nav
            nav.classList.remove('nav-hidden');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Resume Download Simulation
    const downloadBtn = document.getElementById('download-resume');
    downloadBtn.addEventListener('click', () => {
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing PDF...';
        
        setTimeout(() => {
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded Successfully';
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'Nidhi_Savita_Resume.pdf';
            link.click();
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
            }, 3000);
        }, 1500);
    });

    // Social Icon Custom Animations
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.animation = 'pulse 1s infinite alternate';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.animation = '';
        });
    });
});
