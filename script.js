document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('mainHeader');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.querySelector('nav');
    const copyright = document.getElementById('copyright-text');

    // 1. Header shrink on scroll
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        });
    }

    // Handle menu closing on resize from mobile to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });

    // 2. Mobile menu toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
            }
        });
    }

    // 3. Highlight active navigation link
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 4. Update copyright year automatically
    if (copyright) {
        copyright.textContent = copyright.textContent.replace('KeebLovers', 'Keyniverse').replace(/\d{4}/, new Date().getFullYear());
    }
});
