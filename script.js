/**
 * DREAM.ER Portfolio - Core Interactivity & Animation Engine
 * Features:
 * - Scroll-aware sticky navbar with glassmorphism enhancement
 * - Active section scrollspy
 * - Accessible mobile navigation drawer
 * - Interactive hero role rotator with character fade
 * - Cursor spotlight tracker (desktop)
 * - 3D card perspective tilt with glare tracking
 * - IntersectionObserver scroll reveal system
 * - Animated numeric counters for stats
 * - Copy to clipboard toast notifications
 * - Floating back-to-top button with circular scroll progress
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroRoleRotator();
  initCursorSpotlight();
  initCardTilt();
  initScrollReveals();
  initStatCounters();
  initClipboardToast();
  initBackToTop();
});

/* =====================================================
   1. NAVBAR SCROLL EFFECT & SCROLLSPY
===================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header background transition
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scrollspy to mark active nav item
    const scrollPos = scrollY + 140; // Offset for header
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Smooth scroll with offset for header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* =====================================================
   2. MOBILE NAVIGATION DRAWER
===================================================== */
function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navItems = document.querySelector('.nav-items');
  const navActions = document.querySelector('.nav-actions');

  if (!mobileBtn || !navItems) return;

  // Create mobile drawer overlay if not present
  let drawer = document.querySelector('.mobile-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.innerHTML = `
      <div class="mobile-drawer-inner">
        <div class="mobile-drawer-header">
          <span class="mobile-drawer-logo">DREAM.<span>ER</span></span>
          <button class="mobile-drawer-close" aria-label="Close navigation">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <ul class="mobile-nav-list">
          <li><a href="#home" class="mobile-nav-link">Home</a></li>
          <li><a href="#about" class="mobile-nav-link">About</a></li>
          <li><a href="#projects" class="mobile-nav-link">Projects</a></li>
          <li><a href="#skills" class="mobile-nav-link">Skills</a></li>
          <li><a href="#contact" class="mobile-nav-link">Contact</a></li>
        </ul>
        <div class="mobile-drawer-footer">
          <a href="Assets/Vasanth_Resume.pdf" class="nav-button resume-button" download>
            <i class="fa-solid fa-download"></i>
            Download Resume
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  const closeBtn = drawer.querySelector('.mobile-drawer-close');
  const mobileLinks = drawer.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    drawer.classList.add('is-open');
    mobileBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    mobileBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      closeDrawer();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 300);
      }
    });
  });

  // Close when clicking outside inner content
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* =====================================================
   3. HERO ROLE ROTATOR
===================================================== */
function initHeroRoleRotator() {
  const roleEl = document.querySelector('.job-role');
  if (!roleEl) return;

  const roles = [
    'Full Stack Developer',
    'Modern Web Engineer',
    'Creative Problem Solver',
    'UI & Performance Enthusiast'
  ];

  let currentIndex = 0;

  // Wrap in container for smooth height & fade transition
  roleEl.classList.add('rotating-role');
  roleEl.style.minHeight = '1.4em';

  setInterval(() => {
    currentIndex = (currentIndex + 1) % roles.length;
    
    // Smooth fade-out and slide
    roleEl.classList.add('fade-out');

    setTimeout(() => {
      roleEl.textContent = roles[currentIndex];
      roleEl.classList.remove('fade-out');
      roleEl.classList.add('fade-in');

      setTimeout(() => {
        roleEl.classList.remove('fade-in');
      }, 350);
    }, 300);
  }, 3200);
}

/* =====================================================
   4. CURSOR SPOTLIGHT TRACKER
===================================================== */
function initCursorSpotlight() {
  // Only enable on fine pointer devices (desktops/laptops)
  if (window.matchMedia('(pointer: fine)').matches) {
    let spotlight = document.querySelector('.cursor-spotlight');
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.className = 'cursor-spotlight';
      document.body.appendChild(spotlight);
    }

    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Smooth lerp animation for spotlight
    function animateSpotlight() {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(animateSpotlight);
    }

    requestAnimationFrame(animateSpotlight);
  }
}

/* =====================================================
   5. 3D CARD PERSPECTIVE TILT
===================================================== */
function initCardTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const tiltElements = document.querySelectorAll('.project-card, .code-card, .skill-card, .contact-card');

  tiltElements.forEach((card) => {
    // Add glare element
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees (max +-8 deg for subtle premium feel)
      const rotateX = ((cardY - centerY) / centerY) * -6;
      const rotateY = ((cardX - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;

      // Position glare
      const percentX = (cardX / rect.width) * 100;
      const percentY = (cardY / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(124, 92, 255, 0.18), transparent 60%)`;
      glare.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });
}

/* =====================================================
   6. INTERSECTION OBSERVER SCROLL REVEAL
===================================================== */
function initScrollReveals() {
  const elementsToReveal = [
    { selector: '.section-heading-block', effect: 'fade-up' },
    { selector: '.projects-heading', effect: 'fade-up' },
    { selector: '.skills-heading', effect: 'fade-up' },
    { selector: '.contact-content', effect: 'fade-up' },
    { selector: '.hero-content', effect: 'fade-up' },
    { selector: '.hero-visual', effect: 'fade-in' },
    { selector: '.stat-item', effect: 'fade-up', stagger: true },
    { selector: '.about-stat', effect: 'fade-up', stagger: true },
    { selector: '.project-card', effect: 'fade-up', stagger: true },
    { selector: '.skill-card', effect: 'scale-up', stagger: true },
    { selector: '.contact-card', effect: 'fade-up', stagger: true },
    { selector: '.hardware-container', effect: 'fade-up' },
    { selector: '.contact-visual', effect: 'fade-in' }
  ];

  // Tag elements with animation classes
  elementsToReveal.forEach((item) => {
    const elements = document.querySelectorAll(item.selector);
    elements.forEach((el, index) => {
      el.classList.add('reveal-init', `reveal-${item.effect}`);
      if (item.stagger) {
        el.style.transitionDelay = `${(index % 6) * 0.1}s`;
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-init').forEach((el) => {
    revealObserver.observe(el);
  });
}

/* =====================================================
   7. NUMERIC COUNTERS FOR STATS
===================================================== */
function initStatCounters() {
  const statElements = [
    { selector: '.hero-stats .stat-item:nth-child(1) strong', target: 5, suffix: '+' },
    { selector: '.about-stats .about-stat:nth-child(1) strong', target: 12, suffix: '+' },
    { selector: '.about-stats .about-stat:nth-child(2) strong', target: 3, suffix: '+' }
  ];

  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counterTarget, 10);
        const suffix = el.dataset.counterSuffix || '';

        if (!isNaN(target)) {
          animateCounter(el, 0, target, 1200, suffix);
        }
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  statElements.forEach((item) => {
    const el = document.querySelector(item.selector);
    if (el) {
      el.dataset.counterTarget = item.target;
      el.dataset.counterSuffix = item.suffix;
      el.textContent = `0${item.suffix}`;
      counterObserver.observe(el);
    }
  });

  function animateCounter(element, start, end, duration, suffix) {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (end - start) + start);

      element.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = `${end}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }
}

/* =====================================================
   8. COPY TO CLIPBOARD TOAST FEEDBACK
===================================================== */
function initClipboardToast() {
  // Create toast notification element if not exists
  let toast = document.querySelector('.portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'portfolio-toast';
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check"></i>
      <span class="toast-message">Copied to clipboard!</span>
    `;
    document.body.appendChild(toast);
  }

  let toastTimeout;
  function showToast(message) {
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  // Email contact cards and buttons
  const emailTargets = document.querySelectorAll(
    'a[href^="mailto:"]'
  );

  emailTargets.forEach((target) => {
    target.addEventListener('click', (e) => {
      const email = 'dkvasanth69@gmail.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Email copied: ${email}`);
        }).catch(() => {
          showToast(`Email: ${email}`);
        });
      }
    });
  });
}

/* =====================================================
   9. BACK TO TOP BUTTON WITH PROGRESS RING
===================================================== */
function initBackToTop() {
  let backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
      <svg class="progress-ring" width="48" height="48">
        <circle class="progress-ring-track" cx="24" cy="24" r="20" />
        <circle class="progress-ring-circle" cx="24" cy="24" r="20" />
      </svg>
      <i class="fa-solid fa-arrow-up"></i>
    `;
    document.body.appendChild(backToTopBtn);
  }

  const circle = backToTopBtn.querySelector('.progress-ring-circle');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;

  function updateScrollProgress() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);

    const offset = circumference - (progress * circumference);
    circle.style.strokeDashoffset = offset;

    if (scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
