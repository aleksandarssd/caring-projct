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

/* ==========================================
   COOKIE CONSENT MODAL
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const CONSENT_KEY = 'raum-im-leben-cookie-consent';
  
  if (!localStorage.getItem(CONSENT_KEY)) {
    // Create the modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'cookie-overlay';
    
    // Create the modal content
    overlay.innerHTML = `
      <div class="cookie-modal">
        <h2>Privatsphäre-Einstellungen</h2>
        <p>Wir verwenden Cookies und ähnliche Technologien auf unserer Website und verarbeiten personenbezogene Daten von dir (z.B. IP-Adresse), um z.B. Inhalte und Anzeigen zu personalisieren, Medien von Drittanbietern einzubinden oder Zugriffe auf unsere Website zu analysieren. Die Datenverarbeitung kann auch erst in Folge gesetzter Cookies stattfinden. Wir teilen diese Daten mit Dritten, die wir in den Privatsphäre-Einstellungen benennen.</p>
        <p>Die Datenverarbeitung kann mit deiner Einwilligung oder auf Basis eines berechtigten Interesses erfolgen, dem du in den Privatsphäre-Einstellungen widersprechen kannst. Du hast das Recht, nicht einzuwilligen und deine Einwilligung zu einem späteren Zeitpunkt zu ändern oder zu widerrufen. Der Widerruf wird sofort wirksam, hat jedoch keine Auswirkungen auf bereits verarbeitete Daten. Weitere Informationen zur Verwendung deiner Daten findest du in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
        <p class="cookie-muted">Du bist unter 16 Jahre alt? Dann kannst du nicht in optionale Services einwilligen. Du kannst deine Eltern oder Erziehungsberechtigten bitten, mit dir in diese Services einzuwilligen.</p>
        <p class="cookie-muted">Wenn du alle Services akzeptierst, erlaubst du, dass WordPress Emojis² und Google Fonts² geladen werden. Diese sind nach ihrem Zweck in Gruppen Funktional² unterteilt</p>
        
        <div class="cookie-buttons">
          <button id="btn-accept-cookies" class="btn" style="width: 100%; margin-bottom: 12px;">Alle akzeptieren</button>
          <button id="btn-decline-cookies" class="btn" style="width: 100%;">Weiter ohne Einwilligung</button>
        </div>
        
        <div class="cookie-secondary-link">
          <a href="#">Privatsphäre-Einstellungen individuell festlegen</a>
        </div>
        
        <div class="cookie-footer-links">
          <a href="datenschutz.html">Datenschutzerklärung</a> &bull; <a href="impressum.html">Impressum</a>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Block scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Handle button clicks
    const acceptBtn = document.getElementById('btn-accept-cookies');
    const declineBtn = document.getElementById('btn-decline-cookies');
    
    const closeModal = (choice) => {
      localStorage.setItem(CONSENT_KEY, choice);
      overlay.remove();
      document.body.style.overflow = '';
    };
    
    acceptBtn.addEventListener('click', () => closeModal('accepted'));
    declineBtn.addEventListener('click', () => closeModal('declined'));
  }
});
