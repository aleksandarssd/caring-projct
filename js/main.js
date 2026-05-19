/**
 * RAUM IM LEBEN — main.js
 * Global scripts for navigation, mobile menu, and smooth scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     MOBILE NAVIGATION TOGGLE
     ========================================== */
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMobile.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('open');
      });
    });
  }

  /* ==========================================
     STICKY HEADER SCROLL SHADOW
     ========================================== */
  const nav = document.getElementById('main-nav');
  
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================
     ACTIVE LINK HIGHLIGHTING
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
  }
});
