// ============================================================================
//  CONGRESO NACIONAL DE MINERÍA DURANGO 2026  –  script.js  (VERSIÓN CORREGIDA)
// ============================================================================

// ===== NAVBAR ENHANCEMENTS =====

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Particle effect on navbar hover
function createParticleEffect() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function (e) {
            const rect = this.getBoundingClientRect();
            const particles = 6;

            for (let i = 0; i < particles; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.classList.add('nav-link-particle');

                    const x = (Math.random() - 0.5) * rect.width;
                    const y = (Math.random() - 0.5) * rect.height;

                    particle.style.setProperty('--tx', `${x}px`);
                    particle.style.setProperty('--ty', `${y - 20}px`);
                    particle.style.left = '50%';
                    particle.style.top = '50%';

                    this.appendChild(particle);

                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 1000);
                }, i * 100);
            }
        });
    });
}

// Active link highlighting based on scroll position  (SOLO INDEX)
function updateActiveNavLink() {
    if (!window.location.pathname.endsWith('index.html') &&
        !window.location.pathname.endsWith('/') &&
        window.location.pathname.indexOf('index.html') === -1) {
        return;
    }

    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const logo = document.querySelector('.logo-entrada');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    /*  NUEVO COMPORTAMIENTO DEL LOGO  */
    if (logo) {
        logo.classList.add('visible');           // 1) siempre visible al cargar
        const OFFSET_HIDE = 400;                 // px que debe bajar para ocultarse
        if (window.scrollY > OFFSET_HIDE) {
            logo.classList.remove('visible');    // se oculta
        } else {
            logo.classList.add('visible');       // reaparece
        }
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if ((currentSection && href === `#${currentSection}`) ||
            (currentSection === 'inicio' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Set active link based on current page
function setActivePageLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => link.classList.remove('active'));

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Mobile menu close on click
function handleMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && !link.classList.contains('dropdown-toggle')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }
}

// Initialize all navbar enhancements
function initNavbarEnhancements() {
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
    });

    handleNavbarScroll();
    setActivePageLink();
    createParticleEffect();
    handleMobileMenu();

    // Smooth scrolling for anchor links (solo index)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#') &&
                (window.location.pathname.endsWith('index.html') ||
                 window.location.pathname.endsWith('/'))) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }
        });
    });
}

// ===== EXISTING ANIMATIONS =====

// Divide text into spans and animate appearance
function animateTitle(elementId) {
    const titulo = document.getElementById(elementId);
    if (!titulo) return;

    if (elementId === 'titulo-principal') {
        titulo.querySelectorAll('span').forEach((span, i) => {
            setTimeout(() => span.classList.add('is-visible'), i * 60);
        });
    } else {
        const texto = titulo.textContent.trim();
        titulo.textContent = ''; // Clear the original text

        let charIndex = 0;
        texto.split(' ').forEach((word, wordIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-wrapper'; // Add a class to the word span

            Array.from(word).forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
                setTimeout(() => {
                    charSpan.classList.add('is-visible');
                }, charIndex * 80);
                charIndex++;
            });

            titulo.appendChild(wordSpan);

            // Add a space after each word, except the last one
            if (wordIdx < texto.split(' ').length - 1) {
                const space = document.createTextNode(' ');
                titulo.appendChild(space);
            }
        });
    }
}

// Fade-in sections when they enter viewport - USANDO INTERSECTION OBSERVER API
document.addEventListener('DOMContentLoaded', () => {
    // Logo visible al cargar la página
    const logo = document.querySelector('.logo-entrada');
    if (logo) logo.classList.add('visible');
    
    // Title animations
    ['conferencias-titulo', 'programa-titulo', 'hotel-hampton-titulo', 'hotel-victoria-titulo', 'hotel-gobernador-titulo', 'otros-hoteles-titulo'].forEach(id => {
        if (document.getElementById(id)) animateTitle(id);
    });

    // Navbar + logo
    initNavbarEnhancements();

    // Intersection Observer para animaciones fade-in
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });
});

// Eliminar el listener de scroll y resize para revealOnScroll
// let scrollTimeout;
// window.addEventListener('scroll', () => {
//     if (scrollTimeout) return;
//     scrollTimeout = setTimeout(() => {
//         scrollTimeout = null;
//         revealOnScroll();
//     }, 50);
// });
// window.addEventListener('load', revealOnScroll);
// window.addEventListener('resize', revealOnScroll);