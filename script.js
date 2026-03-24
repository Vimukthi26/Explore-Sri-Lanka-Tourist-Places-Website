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

  // ---- Destination Interaction ----
  placeCards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking the "Plan Visit" button
      if (e.target.closest('.place-overlay-btn')) return;
      
      const id = card.id.replace('place-', '');
      if (window.focusPlace) window.focusPlace(id);
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
      background: rgba(13, 15, 20, 0.95);
      backdrop-filter: blur(15px);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: zoom-out;
      animation: lbFadeIn 0.4s ease forwards;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: absolute; top: 2rem; right: 2rem;
      background: none; border: none; color: #fff;
      font-size: 3rem; cursor: pointer; opacity: 0.6;
      transition: opacity 0.3s; z-index: 10000;
      line-height: 1;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.6');

    const img = document.createElement('img');
    img.style.cssText = `
      max-width: 85vw; max-height: 80vh;
      object-fit: contain;
      border-radius: 16px;
      box-shadow: 0 30px 100px rgba(0,0,0,0.9);
      animation: lbZoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      border: 1px solid rgba(255,255,255,0.1);
    `;
    
    const caption = document.createElement('p');
    caption.style.cssText = `
      margin-top: 2rem;
      color: var(--clr-primary); font-size: 1.1rem;
      letter-spacing: 0.05em; text-align: center;
      font-family: var(--font-display);
      font-weight: 700;
    `;

    lb.append(closeBtn, img, caption);
    document.body.appendChild(lb);

    const closeLightbox = () => {
      lb.style.animation = 'lbFadeOut 0.3s ease forwards';
      img.style.animation = 'lbZoomOut 0.3s ease forwards';
      setTimeout(() => lb.remove(), 300);
    };

    lb.addEventListener('click', (e) => {
      if (e.target !== img) closeLightbox();
    });

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

  // ---- Interactive Map Initialization ----
  let mapInitialized = false;
  let mainMap = null;
  const mapMarkers = {};

  const initMap = () => {
    if (mapInitialized) return;
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    console.log("Initializing Explore Lanka Map...");
    mapInitialized = true;
    
    // Center map on Sri Lanka
    mainMap = L.map('map').setView([7.8731, 80.7718], 7);

    // Premium Dark themed map tiles (matched to site aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    }).addTo(mainMap);

    // Filter markers from places cards
    const locations = [
      { id: 'sigiriya', name: 'Sigiriya Rock Fortress', coords: [7.9570, 80.7603], category: 'historical' },
      { id: 'kandy', name: 'Temple of the Tooth', coords: [7.2936, 80.6413], category: 'historical' },
      { id: 'ella', name: 'Ella Nine Arch Bridge', coords: [6.8768, 81.0609], category: 'nature' },
      { id: 'galle', name: 'Galle Fort', coords: [6.0267, 80.2173], category: 'historical' },
      { id: 'mirissa', name: 'Mirissa Beach', coords: [5.9483, 80.4716], category: 'beach' },
      { id: 'tea', name: 'Nuwara Eliya', coords: [6.9497, 80.7891], category: 'nature' }
    ];

    locations.forEach(loc => {
      const marker = L.marker(loc.coords).addTo(mainMap);
      marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.category.charAt(0).toUpperCase() + loc.category.slice(1)}`);
      mapMarkers[loc.id] = marker;
    });

    // Custom geocoder to focus on Sri Lanka tourism and sacred places
    const baseGeocoder = L.Control.Geocoder.nominatim({
      geocodingQueryParams: {
        countrycodes: 'lk',
        limit: 5
      }
    });

    const customGeocoder = {
      geocode: async function(query) {
        try {
          // Query simultaneously for exact location, tourism, and temples in the area
          const [places, tourism, temples] = await Promise.all([
            baseGeocoder.geocode(query),
            baseGeocoder.geocode(query + ' tourism'),
            baseGeocoder.geocode(query + ' temple')
          ]);
          
          let allResults = [];
          if (tourism) allResults.push(...tourism);
          if (temples) allResults.push(...temples);
          if (places) allResults.push(...places);
          
          // Deduplicate by name and coordinates
          let unique = [];
          let seen = new Set();
          allResults.forEach(r => {
            let key = r.name + (r.center ? r.center.lat : '');
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(r);
            }
          });
          return unique.slice(0, 7);
        } catch(e) {
          console.error("Geocoding error:", e);
          return baseGeocoder.geocode(query);
        }
      },
      suggest: async function(query) {
        return this.geocode(query);
      }
    };

    L.Control.geocoder({
      defaultMarkGeocode: true,
      placeholder: "Search tourism & sacred places...",
      geocoder: customGeocoder
    }).addTo(mainMap);
  };

  // Helper to focus map on a specific place
  window.focusPlace = (id) => {
    const marker = mapMarkers[id];
    if (marker && mainMap) {
      mainMap.setView(marker.getLatLng(), 13);
      marker.openPopup();
      document.getElementById('map-wrap').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Run map init
  document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initWeather();
  });
  // Also run if mapEl is already there (in case of dynamic loads)
  if (document.getElementById('map')) {
    initMap();
    initWeather();
  }

  // ---- Weather Integration ----
  function initWeather() {
    const weatherLocations = [
      { id: 'sigiriya', lat: 7.9570, lon: 80.7603 },
      { id: 'kandy', lat: 7.2936, lon: 80.6413 },
      { id: 'ella', lat: 6.8768, lon: 81.0609 },
      { id: 'galle', lat: 6.0267, baseId: 'galle', lon: 80.2173 },
      { id: 'mirissa', lat: 5.9483, lon: 80.4716 },
      { id: 'tea', lat: 6.9497, lon: 80.7891 } // Nuwara Eliya
    ];

    weatherLocations.forEach(loc => fetchWeather(loc));
  }

  async function fetchWeather(loc) {
    const el = document.getElementById(`weather-${loc.id}`);
    if (!el) return;

    try {
      const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code`);
      const data = await resp.json();
      
      const temp = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;
      const info = getWeatherInfo(code);

      el.querySelector('.w-icon').textContent = info.icon;
      el.querySelector('.w-temp').textContent = `${temp}°C`;
      el.querySelector('.w-desc').textContent = info.desc;
      el.style.opacity = '1';
    } catch (err) {
      console.error("Weather error:", err);
      el.querySelector('.w-desc').textContent = "Unavailable";
    }
  }

  function getWeatherInfo(code) {
    const codes = {
      0: { icon: '☀️', desc: 'Clear' },
      1: { icon: '🌤️', desc: 'Mainly Clear' },
      2: { icon: '⛅', desc: 'Partly Cloudy' },
      3: { icon: '☁️', desc: 'Overcast' },
      45: { icon: '🌫️', desc: 'Fog' },
      48: { icon: '🌫️', desc: 'Fog' },
      51: { icon: '🌦️', desc: 'Drizzle' },
      61: { icon: '🌧️', desc: 'Rain' },
      80: { icon: '🌦️', desc: 'Showers' },
      95: { icon: '⛈️', desc: 'Thunderstorm' }
    };
    return codes[code] || { icon: '️⛅', desc: 'Cloudy' };
  }

}());
