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
    
    // Center map on Sri Lanka, disable scroll wheel zoom by default
    mainMap = L.map('map', { scrollWheelZoom: false }).setView([7.8731, 80.7718], 7);

    // Enable scroll zoom on click, disable when mouse leaves
    mainMap.on('click', () => mainMap.scrollWheelZoom.enable());
    mainMap.on('mouseout', () => mainMap.scrollWheelZoom.disable());

    // Define premium multi-layer map sources to support complete district, road, temple, and river views
    const darkTheme = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    });

    const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Define interactive overlays
    const railOverlay = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const labelOverlay = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    });

    // Set default base map (Original green street map as default on load)
    streetMap.addTo(mainMap);

    // Group maps for interactive layer switching
    const baseMaps = {
      "Sleek Dark Map 🖤": darkTheme,
      "Standard Street Map (Original) 🗺️": streetMap,
      "Latest Satellite Map 🛰️": satelliteMap,
      "Topographic Terrain Map 🏔️": topoMap
    };

    const overlayMaps = {
      "Railway Network Overlay 🚂": railOverlay,
      "Roads & Places Labels Overlay 🏷️": labelOverlay
    };

    // Add Layer Control Panel to map (non-collapsed, perfectly accessible)
    L.control.layers(baseMaps, overlayMaps, { collapsed: false, position: 'topright' }).addTo(mainMap);

    // Set initial colors to original (since OSM standard is loaded by default)
    mapEl.classList.add('original-colors');

    // Toggle color filters dynamically on layer selection
    mainMap.on('baselayerchange', function(e) {
      if (e.name === "Sleek Dark Map 🖤") {
        mapEl.classList.remove('original-colors');
      } else {
        mapEl.classList.add('original-colors');
      }
    });

    // Filter markers from places cards
    const locations = [
      { id: 'sigiriya', name: 'Sigiriya Rock Fortress', coords: [7.9570, 80.7603], category: 'historical' },
      { id: 'kandy', name: 'Temple of the Tooth', coords: [7.2936, 80.6413], category: 'historical' },
      { id: 'ella', name: 'Ella Nine Arch Bridge', coords: [6.8768, 81.0609], category: 'nature' },
      { id: 'galle', name: 'Galle Fort', coords: [6.0267, 80.2173], category: 'historical' },
      { id: 'mirissa', name: 'Mirissa Beach', coords: [5.9483, 80.4716], category: 'beach' },
      { id: 'tea', name: 'Nuwara Eliya', coords: [6.9497, 80.7891], category: 'nature' },
      { id: 'anuradhapura', name: 'Anuradhapura', coords: [8.3122, 80.4131], category: 'historical' },
      { id: 'yala', name: 'Yala National Park', coords: [6.3981, 81.3323], category: 'nature' }
    ];
    locations.forEach(loc => {
      const marker = L.marker(loc.coords);
      marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.category.charAt(0).toUpperCase() + loc.category.slice(1)}`);
      mapMarkers[loc.id] = marker;
    });
  };
  // Helper to focus map on a specific place
  window.focusPlace = (id) => {
    const marker = mapMarkers[id];
    if (marker && mainMap) {
      if (!mainMap.hasLayer(marker)) {
        marker.addTo(mainMap);
      }
      mainMap.setView(marker.getLatLng(), 13);
      marker.openPopup();
      document.getElementById('map-wrap').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Coordinate lookup table for advanced tourism features
  const destinationCoords = {
    sigiriya: { lat: 7.9570, lon: 80.7603, name: 'Sigiriya Rock Fortress', category: 'historical', desc: 'Ancient rock fortress with water gardens and frescoes.' },
    kandy: { lat: 7.2936, lon: 80.6413, name: 'Temple of the Tooth Relic', category: 'historical', desc: 'Sacred Buddhist temple set beside Kandy Lake.' },
    ella: { lat: 6.8768, lon: 81.0609, name: 'Ella Nine Arch Bridge', category: 'nature', desc: 'Colonial-era railway viaduct in green tea hills.' },
    galle: { lat: 6.0267, lon: 80.2173, name: 'Galle Fort', category: 'historical', desc: 'Well-preserved Dutch colonial fortress on the coast.' },
    mirissa: { lat: 5.9483, lon: 80.4716, name: 'Mirissa Beach', category: 'beach', desc: 'Beautiful crescent beach known for whale watching.' },
    tea: { lat: 6.9497, lon: 80.7891, name: 'Nuwara Eliya Tea Estates', category: 'nature', desc: 'Cool misty hills surrounded by rolling tea plantations.' },
    anuradhapura: { lat: 8.3122, lon: 80.4131, name: 'Anuradhapura Sacred City', category: 'historical', desc: 'Ancient capital featuring massive sacred stupas.' },
    yala: { lat: 6.3981, lon: 81.3323, name: 'Yala National Park', category: 'nature', desc: 'Wild safari park with the highest density of leopards.' }
  };

  // State Management
  let selectedItinerary = [];
  let itineraryPolyline = null;
  let liveExchangeRates = {};
  let quizScores = { historical: 0, nature: 0, beach: 0 };
  let currentQuizStep = 0;

  let hasInitializedAll = false;
  function initAll() {
    if (hasInitializedAll) return;
    hasInitializedAll = true;
    initMap();
    initWeather();
    initItineraryBuilder();
    initCurrencyConverter();
    initTravelQuiz();
    initInstantSearch();
  }

  // Run initializations
  document.addEventListener('DOMContentLoaded', initAll);

  if (document.getElementById('map')) {
    initAll();
  }

  // ---- Weather Integration ----
  function initWeather() {
    Object.keys(destinationCoords).forEach(id => {
      fetchWeather({ id: id, lat: destinationCoords[id].lat, lon: destinationCoords[id].lon });
    });
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

  // ---- Itinerary Builder Integration ----
  function initItineraryBuilder() {
    // Dynamically inject the "+ Add to Trip" buttons inside each place card's place-info block
    const cards = document.querySelectorAll('.place-card');
    cards.forEach(card => {
      const id = card.id.replace('place-', '');
      if (!destinationCoords[id]) return;

      const infoEl = card.querySelector('.place-info');
      if (!infoEl) return;

      // Check if button already exists to prevent duplicate injections on dynamic loads
      if (document.getElementById(`btn-add-${id}`)) return;

      const btn = document.createElement('button');
      btn.className = 'btn-add-trip';
      btn.id = `btn-add-${id}`;
      btn.setAttribute('data-id', id);
      btn.innerHTML = '✙ Add to Trip';
      infoEl.appendChild(btn);

      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent card zoom from firing
        toggleItineraryItem(id);
      });
    });

    // Bind action buttons
    const clearBtn = document.getElementById('itinerary-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedItinerary = [];
        updateItineraryUI();
      });
    }

    const copyBtn = document.getElementById('itinerary-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyItineraryToClipboard();
      });
    }
  }

  function toggleItineraryItem(id) {
    const index = selectedItinerary.indexOf(id);
    if (index > -1) {
      selectedItinerary.splice(index, 1);
    } else {
      selectedItinerary.push(id);
    }
    updateItineraryUI();
  }

  function updateItineraryUI() {
    const wrap = document.getElementById('itinerary-wrap');
    const timeline = document.getElementById('itinerary-timeline');
    const countVal = document.getElementById('itinerary-count');
    const distanceVal = document.getElementById('itinerary-distance');

    if (!wrap || !timeline) return;

    // Update place cards add buttons
    const allButtons = document.querySelectorAll('.btn-add-trip');
    allButtons.forEach(btn => {
      const btnId = btn.getAttribute('data-id');
      if (selectedItinerary.includes(btnId)) {
        btn.classList.add('added');
        btn.innerHTML = '✓ Added to Trip';
      } else {
        btn.classList.remove('added');
        btn.innerHTML = '✙ Add to Trip';
      }
    });

    // Toggle panel visibility
    if (selectedItinerary.length === 0) {
      wrap.classList.add('hidden');
      if (itineraryPolyline && mainMap) {
        mainMap.removeLayer(itineraryPolyline);
        itineraryPolyline = null;
      }
      return;
    }

    wrap.classList.remove('hidden');
    timeline.innerHTML = '';

    let totalDist = 0;
    const latlngs = [];

    selectedItinerary.forEach((id, i) => {
      const dest = destinationCoords[id];
      if (!dest) return;

      latlngs.push([dest.lat, dest.lon]);

      // Dynamically add marker to map if not already present
      const marker = mapMarkers[id];
      if (marker && !mainMap.hasLayer(marker)) {
        marker.addTo(mainMap);
      }

      // Create timeline element stop card
      const itemCard = document.createElement('div');
      itemCard.className = 'itinerary-item';
      itemCard.innerHTML = `
        <div class="itinerary-item-num">${i + 1}</div>
        <button class="btn-itinerary-remove" aria-label="Remove stop">&times;</button>
        <div class="itinerary-item-meta">${dest.category.charAt(0).toUpperCase() + dest.category.slice(1)} stop</div>
        <h4 class="itinerary-item-title">${dest.name}</h4>
        <p class="itinerary-item-desc">${dest.desc}</p>
      `;

      itemCard.querySelector('.btn-itinerary-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleItineraryItem(id);
      });

      // Zoom to this stop when clicked
      itemCard.addEventListener('click', () => {
        window.focusPlace(id);
      });

      timeline.appendChild(itemCard);

      // Distance calculation from previous stop
      if (i > 0) {
        const prev = destinationCoords[selectedItinerary[i - 1]];
        if (prev) {
          const d = getDistance(prev.lat, prev.lon, dest.lat, dest.lon);
          totalDist += d * 1.3; // Approx winding roads scale for Sri Lanka
        }
      }
    });

    countVal.textContent = selectedItinerary.length;
    distanceVal.textContent = `${Math.round(totalDist)} km`;

    // Render polyline on Leaflet map
    if (mainMap) {
      if (itineraryPolyline) {
        mainMap.removeLayer(itineraryPolyline);
      }

      if (latlngs.length > 1) {
        itineraryPolyline = L.polyline(latlngs, {
          color: '#00ffff',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 12',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mainMap);

        // Zoom map to fit sequence
        mainMap.fitBounds(itineraryPolyline.getBounds(), { padding: [50, 50] });
      }
    }
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function copyItineraryToClipboard() {
    if (selectedItinerary.length === 0) return;

    let text = `🇱🇰 BEAUTIFUL SRI LANKA - MY TRAVEL ITINERARY 🗺️\n\n`;
    text += `Your scheduled adventure route sequence in paradise:\n`;
    text += `========================================================\n`;

    selectedItinerary.forEach((id, i) => {
      const dest = destinationCoords[id];
      if (dest) {
        text += `${i + 1}. ${dest.name} [${dest.category.toUpperCase()}]\n`;
        text += `   - Highlight: ${dest.desc}\n\n`;
      }
    });

    const distStr = document.getElementById('itinerary-distance').textContent;
    text += `========================================================\n`;
    text += `Total Stops Selected: ${selectedItinerary.length}\n`;
    text += `Estimated Total Driving Distance: ${distStr}\n\n`;
    text += `Made with ❤️ in Sri Lanka. Have a magical journey! 🌴🌞🐘`;

    navigator.clipboard.writeText(text).then(() => {
      const copyBtn = document.getElementById('itinerary-copy');
      const origText = copyBtn.innerHTML;
      copyBtn.innerHTML = 'Copied! ✅';
      setTimeout(() => copyBtn.innerHTML = origText, 2000);
    }).catch(err => console.error("Could not copy itinerary text: ", err));
  }

  // ---- Currency Converter Widget Integration ----
  async function initCurrencyConverter() {
    const amtInput = document.getElementById('conv-amount');
    const fromSelect = document.getElementById('conv-from');
    const toSelect = document.getElementById('conv-to');
    const resEl = document.getElementById('conv-result');
    const rtEl = document.getElementById('conv-rate');
    const swBtn = document.getElementById('conv-swap');

    if (!amtInput || !fromSelect || !toSelect || !resEl || !rtEl) return;

    // Fetch dynamic rates
    try {
      const resp = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await resp.json();
      
      if (data && data.rates) {
        liveExchangeRates = data.rates;
        rtEl.textContent = `Live exchange rates loaded.`;
        performConversion();
      }
    } catch (err) {
      console.error("Rates fetch failed, applying fallbacks: ", err);
      rtEl.textContent = `Live rates unavailable. Using fallbacks.`;
      
      liveExchangeRates = {
        USD: 1.0,
        LKR: 300.0, // Fallback conversion
        EUR: 0.92,
        GBP: 0.79,
        AUD: 1.51,
        JPY: 156.0,
        INR: 83.5
      };
      performConversion();
    }

    amtInput.addEventListener('input', performConversion);
    fromSelect.addEventListener('change', performConversion);
    toSelect.addEventListener('change', performConversion);

    if (swBtn) {
      swBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        performConversion();
      });
    }

    function performConversion() {
      const amt = parseFloat(amtInput.value);
      const toCur = toSelect.value;
      if (isNaN(amt) || amt <= 0) {
        resEl.textContent = `-- ${toCur}`;
        return;
      }

      const fromCur = fromSelect.value;

      if (!liveExchangeRates[fromCur] || !liveExchangeRates[toCur]) return;

      const amtInUSD = amt / liveExchangeRates[fromCur];
      const converted = amtInUSD * liveExchangeRates[toCur];

      const syms = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$', JPY: '¥', INR: '₹', LKR: 'Rs' };
      const toSym = syms[toCur] || '';

      resEl.textContent = `${toSym} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const liveRate = liveExchangeRates[toCur] / liveExchangeRates[fromCur];
      rtEl.textContent = `1 ${fromCur} = ${liveRate.toFixed(4)} ${toCur}`;
    }
  }

  // ---- Travel Style Personality Quiz Integration ----
  function initTravelQuiz() {
    const trigger = document.getElementById('quiz-trigger');
    const modal = document.getElementById('quiz-modal');
    const closeBtn = document.getElementById('quiz-modal-close');
    const startBtn = document.getElementById('btn-quiz-start');
    const retryBtn = document.getElementById('btn-quiz-retry');
    const applyBtn = document.getElementById('btn-quiz-apply');

    if (!modal) return;

    if (trigger) {
      trigger.addEventListener('click', () => {
        modal.classList.add('open');
        resetQuiz();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        showQuizScreen(1);
      });
    }

    const optButtons = modal.querySelectorAll('.quiz-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const scoreType = btn.getAttribute('data-value');
        const parent = btn.closest('.quiz-screen');
        const qIndex = parseInt(parent.getAttribute('data-question'));

        if (scoreType && quizScores[scoreType] !== undefined) {
          quizScores[scoreType]++;
        }

        if (qIndex < 4) {
          showQuizScreen(qIndex + 1);
        } else {
          renderQuizResult();
        }
      });
    });

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        resetQuiz();
        showQuizScreen(1);
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        applyQuizRecomms();
      });
    }
  }

  function resetQuiz() {
    quizScores = { historical: 0, nature: 0, beach: 0 };
    currentQuizStep = 0;
    updateProgressBar(0);
    showQuizScreen('start');
  }

  function showQuizScreen(stepId) {
    const screens = document.querySelectorAll('.quiz-screen');
    screens.forEach(s => s.classList.remove('active'));

    const targetScreen = document.getElementById(`quiz-screen-${stepId}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    if (typeof stepId === 'number') {
      currentQuizStep = stepId;
      updateProgressBar((stepId - 1) * 25);
    }
  }

  function updateProgressBar(percentage) {
    const progress = document.getElementById('quiz-progress');
    if (progress) {
      progress.style.width = `${percentage}%`;
    }
  }

  function renderQuizResult() {
    updateProgressBar(100);
    showQuizScreen('result');

    const resTitle = document.getElementById('quiz-result-title');
    const resDesc = document.getElementById('quiz-result-desc');
    const resIcon = document.getElementById('quiz-result-icon');
    const applyBtn = document.getElementById('btn-quiz-apply');

    let winnerCat = 'historical';
    let highVal = -1;

    for (const c in quizScores) {
      if (quizScores[c] > highVal) {
        highVal = quizScores[c];
        winnerCat = c;
      }
    }

    const dict = {
      historical: {
        title: 'Cultural Historian 🏛️',
        icon: '🏛️',
        desc: 'You possess a deep curiosity for history, ancient kingdoms, and sacred spirituality. You love wandering around centuries-old palace ruins, learning about rich local legends, and feeling the sacred tranquility of pristine temple grounds. Your perfect Sri Lankan matches are places like Sigiriya, Kandy, Galle Fort, and Anuradhapura Sacred City.'
      },
      nature: {
        title: 'Wilderness Explorer 🏔️',
        icon: '🏔️',
        desc: 'You are fueled by active adventure, fresh mountain air, and wild nature! You thrive on hiking through misty mountain peaks, walking in emerald-green rolling tea plantations, and experiencing exciting wildlife encounters in pristine national parks. Your perfect Sri Lankan matches are Ella, Nuwara Eliya Tea Estates, and Yala National Park.'
      },
      beach: {
        title: 'Tropical Wanderer 🏖️',
        icon: '🌴',
        desc: 'You are all about sun-soaked relaxation, catching turquoise waves, and chilling under golden coconut palms. You appreciate tropical laid-back living, surfing under spectacular sunsets, and waking up directly to the sounds of crashing ocean waves. Your perfect Sri Lankan matches are Galle Fort and Mirissa Beach.'
      }
    };

    const topMatch = dict[winnerCat];
    resTitle.textContent = topMatch.title;
    resIcon.textContent = topMatch.icon;
    resDesc.textContent = topMatch.desc;

    applyBtn.setAttribute('data-match-category', winnerCat);
  }

  function applyQuizRecomms() {
    const applyBtn = document.getElementById('btn-quiz-apply');
    const category = applyBtn.getAttribute('data-match-category');

    if (!category) return;

    // Clear previous recommendations
    const cards = document.querySelectorAll('.place-card');
    cards.forEach(c => c.classList.remove('card-highlight'));

    // Highlight recommended cards
    cards.forEach(c => {
      if (c.getAttribute('data-category') === category) {
        c.classList.add('card-highlight');
      }
    });

    // Auto-click category filter
    const catFilterBtn = document.getElementById(`filter-${category}`);
    if (catFilterBtn) {
      catFilterBtn.click();
    }

    // Centering Leaflet Map to cover recommended coordinates
    if (mainMap) {
      const matchPoints = [];
      Object.keys(destinationCoords).forEach(id => {
        if (destinationCoords[id].category === category) {
          matchPoints.push([destinationCoords[id].lat, destinationCoords[id].lon]);
        }
      });

      if (matchPoints.length > 0) {
        const bounds = L.latLngBounds(matchPoints);
        mainMap.fitBounds(bounds, { padding: [60, 60] });
      }
    }

    // Scroll to places grid
    document.getElementById('places').scrollIntoView({ behavior: 'smooth' });
  }

  function initInstantSearch() {
    const searchInput = document.getElementById('map-instant-search');
    const dropdown = document.getElementById('search-autocomplete-dropdown');
    if (!searchInput || !dropdown) return;

    let debounceTimeout;

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      clearTimeout(debounceTimeout);

      if (!val) {
        dropdown.innerHTML = '';
        dropdown.classList.remove('open');
        return;
      }

      // 1. Filter local places
      const localMatches = [];
      Object.keys(destinationCoords).forEach(id => {
        const dest = destinationCoords[id];
        if (dest.name.toLowerCase().includes(val) || dest.category.toLowerCase().includes(val)) {
          localMatches.push({ id, ...dest, isLocal: true });
        }
      });

      renderSuggestions(localMatches);

      // 2. Fetch external places from Photon API (debounced to avoid spamming Nominatim)
      debounceTimeout = setTimeout(async () => {
        try {
          const query = encodeURIComponent(val + " Sri Lanka");
          const resp = await fetch(`https://photon.komoot.io/api/?q=${query}&limit=5`);
          const data = await resp.json();
          
          if (data && data.features) {
            const externalMatches = data.features.map(f => {
              const name = f.properties.name || f.properties.city || f.properties.state || 'Scenic Location';
              const details = [f.properties.city, f.properties.state, f.properties.country].filter(Boolean).join(', ');
              return {
                name,
                coords: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
                desc: details,
                category: f.properties.osm_value || 'Tourism Place',
                isLocal: false
              };
            }).filter(ext => {
              // Filter duplicates against local matches
              return !localMatches.some(loc => loc.name.toLowerCase().includes(ext.name.toLowerCase()));
            });

            renderSuggestions([...localMatches, ...externalMatches]);
          }
        } catch (err) {
          console.error("Photon autocomplete error:", err);
        }
      }, 300);
    });

    function renderSuggestions(matches) {
      if (matches.length === 0) {
        dropdown.innerHTML = '<div class="autocomplete-item" style="cursor: default;"><span class="autocomplete-title">No locations found 📍</span></div>';
        dropdown.classList.add('open');
        return;
      }

      dropdown.innerHTML = '';
      matches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        
        const tagClass = match.isLocal ? 'local' : 'external';
        const tagText = match.isLocal ? '★ Featured Stop' : '🌍 Sri Lanka Map';

        item.innerHTML = `
          <span class="autocomplete-title">${match.name}</span>
          <span class="autocomplete-desc">${match.desc || match.category}</span>
          <span class="autocomplete-tag ${tagClass}">${tagText}</span>
        `;

        item.addEventListener('click', () => {
          if (match.isLocal) {
            window.focusPlace(match.id);
          } else {
            // Dynamically mount external marker on map
            if (mainMap) {
              mainMap.setView(match.coords, 14);
              const extMarker = L.marker(match.coords).addTo(mainMap);
              extMarker.bindPopup(`<strong>${match.name}</strong><br>${match.desc || 'Scenic spot in Sri Lanka'}`).openPopup();
            }
            document.getElementById('map-wrap').scrollIntoView({ behavior: 'smooth' });
          }
          searchInput.value = '';
          dropdown.innerHTML = '';
          dropdown.classList.remove('open');
        });

        dropdown.appendChild(item);
      });
      dropdown.classList.add('open');
    }

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

}());
