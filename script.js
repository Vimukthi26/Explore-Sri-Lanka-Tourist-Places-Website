// =====================================================
//   EXPLORE SRI LANKA – Interactive JavaScript
// =====================================================

(function () {
  'use strict';

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        const id = section.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Mobile hamburger menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ---- Destination Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const placeCards = document.querySelectorAll('.place-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      placeCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.classList.remove('hidden');
          // Stagger animation
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---- Contact Form Submission ----
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('btn-submit');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;

    required.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e74c3c';
        setTimeout(() => {
          field.style.borderColor = '';
        }, 2000);
      }
    });

    if (!valid) return;

    // Simulate submit
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-submit-text').textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.querySelector('.btn-submit-text').textContent = 'Send Inquiry ✈️';
      submitBtn.disabled = false;
      formSuccess.classList.add('visible');
      contactForm.reset();

      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 5000);
    }, 1500);
  });

  // ---- Scroll Reveal Animation ----
  const addRevealClass = () => {
    const revealTargets = document.querySelectorAll(
      '.feature-card, .place-card, .tip-card, .gallery-item, .contact-detail-item, .footer-col'
    );
    revealTargets.forEach((el) => el.classList.add('reveal'));
  };

  const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        setTimeout(() => {
          el.classList.add('visible');
        }, i * 60);
      }
    });
  };

  addRevealClass();
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // Run immediately for elements already in view

  // ---- Gallery Lightbox (simple) ----
  const galleryItems = document.querySelectorAll('.gallery-item');

  const createLightbox = () => {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s ease;
      cursor: zoom-out;
    `;
    const img = document.createElement('img');
    img.style.cssText = `
      max-width: 90vw; max-height: 90vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 20px 80px rgba(0,0,0,0.8);
      transform: scale(0.9); transition: transform 0.3s ease;
      width: auto; height: auto;
    `;
    const caption = document.createElement('p');
    caption.style.cssText = `
      position: absolute; bottom: 2rem; left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.7); font-size: 0.9rem;
      letter-spacing: 0.1em; text-align: center;
      font-family: 'Inter', sans-serif;
    `;
    lb.append(img, caption);
    document.body.appendChild(lb);

    lb.addEventListener('click', () => {
      lb.style.opacity = '0';
      img.style.transform = 'scale(0.9)';
      setTimeout(() => lb.remove(), 300);
    });

    setTimeout(() => {
      lb.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 10);

    return { lb, img, caption };
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      const cap = item.querySelector('.gallery-caption').textContent;
      const { img, caption } = createLightbox();
      img.src = src;
      img.alt = cap;
      caption.textContent = cap;
    });
  });

  // ---- Smooth counter animation for hero stats ----
  const counters = document.querySelectorAll('.stat-num');
  let countersAnimated = false;

  const animateCounter = (el) => {
    const target = el.textContent;
    // just add a subtle flash effect since values include text
    el.style.transition = 'color 0.5s ease';
    el.style.color = '#fff';
    setTimeout(() => {
      el.style.color = '';
    }, 500);
  };

  const handleCounterVisibility = () => {
    if (countersAnimated) return;
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersAnimated = true;
      counters.forEach((c, i) => {
        setTimeout(() => animateCounter(c), i * 200);
      });
    }
  };

  window.addEventListener('scroll', handleCounterVisibility, { passive: true });
  handleCounterVisibility();

}());
